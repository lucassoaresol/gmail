from pg_utils import ClientsManager


def get_database(client_id: str):
    manager = ClientsManager()

    client = manager.get_client_by_id(client_id)

    if not client:
        raise ValueError(
            f'Cliente com ID "{client_id}" não encontrado na configuração.'
        )

    database = client.get_client_database()

    database.connect()

    return database
