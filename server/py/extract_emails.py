import argparse

from gmail_manager import GmailManager
from database import get_database

if __name__ == "__main__":
    db = get_database("gmail")

    parser = argparse.ArgumentParser(description="Extrair emails do Gmail")
    parser.add_argument(
        "id", type=str, help="ID do cliente para acessar as credenciais"
    )
    parser.add_argument(
        "-d", "--days", type=int, help="Definir o número de dias", default=0
    )

    args = parser.parse_args()

    gmail_manager = GmailManager(args.id, args.days)
    gmail_manager.extract_emails(db)
