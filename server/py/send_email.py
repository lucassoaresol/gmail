import argparse
import json
import os

from gmail_manager import GmailManager

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Enviar email")
    parser.add_argument(
        "id", type=str, help="ID do cliente para acessar as credenciais"
    )

    args = parser.parse_args()
    gmail_manager = GmailManager(id=args.id)

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    credentials_path = os.path.join(project_root, "credentials", args.id)
    email_file = os.path.join(credentials_path, "send_email.json")

    if not os.path.exists(email_file):
        print("Nenhum email pendente para envio.")
    else:
        with open(email_file, "r", encoding="utf-8") as file:
            email_data = json.load(file)

        cc = email_data.get("cc") if email_data.get("cc") is not None else []
        bcc = email_data.get("bcc") if email_data.get("bcc") is not None else []
        attachments = (
            email_data.get("attachments")
            if email_data.get("attachments") is not None
            else []
        )

        gmail_manager.send_email(
            to=email_data["to"],
            subject=email_data["subject"],
            body=email_data["body"],
            cc=cc,
            bcc=bcc,
            attachments=attachments,
        )

        try:
            os.remove(email_file)
            print(f"Arquivo {email_file} excluído após o envio.")
        except OSError as e:
            print(f"Erro ao excluir o arquivo {email_file}: {e}")
