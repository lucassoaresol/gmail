import argparse

from gmail_manager import GmailManager
from pg_utils import Database

if __name__ == "__main__":
    db = Database(id="gmail")

    parser = argparse.ArgumentParser(description="Extrair emails do Gmail")
    parser.add_argument(
        "id", type=str, help="ID do cliente para acessar as credenciais"
    )

    args = parser.parse_args()

    gmail_manager = GmailManager(id=args.id)
    gmail_manager.extract_emails(db)
