# items = {
#     0: {"name": "First item"}
# }


# def search() -> list:
#     return items

from flask_injector import inject
from services.provider import ItemsProvider


@inject
def search(data_provider=ItemsProvider()) -> list:
    return data_provider.get()