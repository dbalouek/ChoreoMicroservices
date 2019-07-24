from flask_injector import inject
from services.provider import ItemsProvider

@inject
def search(data_provider=ItemsProvider()) -> list:
    return data_provider.get_zip()

@inject
def put_zip(item, data_provider=ItemsProvider()):
    data_provider.put_zip(item)
    return "Zip logged"