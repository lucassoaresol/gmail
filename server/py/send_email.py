import argparse

from gmail_manager import GmailManager

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Enviar email")
    parser.add_argument(
        "id", type=str, help="ID do cliente para acessar as credenciais"
    )
    parser.add_argument("--to", type=str, required=True, help="Destinatário do e-mail")
    parser.add_argument("--subject", type=str, required=True, help="Assunto do e-mail")
    parser.add_argument("--body", type=str, required=True, help="Corpo do e-mail")
    parser.add_argument("--cc", nargs="*", default=[], help="Lista de CC")
    parser.add_argument("--bcc", nargs="*", default=[], help="Lista de BCC")
    parser.add_argument("--attachments", nargs="*", default=[], help="Lista de anexos")

    args = parser.parse_args()
    gmail_manager = GmailManager(id=args.id)

    gmail_manager.send_email(
        to=args.to,
        subject=args.subject,
        body=args.body,
        cc=args.cc,
        bcc=args.bcc,
        attachments=args.attachments,
    )

    print("E-mail enviado com sucesso.")
