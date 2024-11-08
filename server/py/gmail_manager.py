import os
from datetime import datetime, timedelta

import arrow
from pg_utils import Database
from simplegmail import Gmail
from simplegmail.query import construct_query


class GmailManager:
    def __init__(self, id: str):
        self.id = id
        self.project_root = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..")
        )
        self.credentials_path = os.path.join(self.project_root, "credentials", self.id)
        self.gmail = Gmail(
            client_secret_file=os.path.join(
                self.credentials_path, "client_secret.json"
            ),
            creds_file=os.path.join(self.credentials_path, "gmail_token.json"),
        )

    def process_messages(self, messages):
        for msg in messages:
            email_data = {
                "id": msg.id,
                "date": arrow.get(msg.date).datetime,
                "subject": msg.subject,
                "body": msg.html,
                "client_id": self.id,
            }

            search_email = self.db.search_by_field("emails", "id", msg.id, ["id"])
            if not search_email:
                self.db.insert_into_table("emails", email_data)

    def extract_emails(self, db: Database):
        self.db = db
        today = datetime.now()
        after_date = (today - timedelta(days=1)).strftime("%Y/%m/%d")

        query_params = {
            "after": after_date,
        }

        messages = self.gmail.get_messages(query=construct_query(query_params))

        self.process_messages(messages)

    def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        cc: list = None,
        bcc: list = None,
        attachments: list = None,
    ):
        try:
            message = self.gmail.send_message(
                sender="monitoramento@insidedb.com.br",
                to=to,
                subject=subject,
                msg_html=body,
                cc=cc,
                bcc=bcc,
                attachments=attachments,
            )
            print(f"Email enviado com sucesso para {to}.")
            return message
        except Exception as e:
            print(f"Erro ao enviar email para {to}: {e}")
            return None
