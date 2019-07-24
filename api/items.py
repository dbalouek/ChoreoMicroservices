# items = {
#     0: {"name": "First item"}
# }


# def search() -> list:
#     return items

from flask_injector import inject
from services.provider import ItemsProvider
import requests

@inject
def search(data_provider=ItemsProvider()) -> list:
    return data_provider.get()

@inject
def put(item, data_provider=ItemsProvider()):
    zip = item["zip-code"]
    r = requests.get(url="https://api.openweathermap.org/data/2.5/weather?zip="+str(zip)+",us&units=imperial&appid=904eaa61902dba144dc85f29013ec210")
    data_provider.put(r.json())
    return "It is " + str(r.json()["main"]["temp"]) + " degrees Fahrenheit in " + r.json()["name"]