from bson.json_util import dumps
from pymongo import MongoClient
import json

class ItemsProvider(object):
    def __init__(self, items: list=[]):
        self.client = MongoClient('localhost', 27017)
        self.db = self.client['microservice']
        self.zip_collection = self.db['zip']
        self.weather_collection = self.db['weather']
        
    def get_zip(self, number_of_items: int=5) -> list:
        return json.loads(dumps(self.zip_collection.find()))

    def get_weather(self, number_of_items: int=5) -> list:
        return json.loads(dumps(self.weather_collection.find()))

    def put_zip(self, item):
        self.zip_collection.insert_one(item)

    def put_weather(self, item):
        self.weather_collection.insert_one(item)