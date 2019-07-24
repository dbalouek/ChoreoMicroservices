from bson.json_util import dumps
from pymongo import MongoClient
import json

class ItemsProvider(object):
    def __init__(self, items: list=[]):
        self.client = MongoClient('localhost', 27017)
        self.db = self.client['microservice']
        self.collection = self.db['weather']
        
    def get(self, number_of_items: int=5) -> list:
        return json.loads(dumps(self.collection.find()))

    def put(self, item):
        self.collection.insert_one(item)