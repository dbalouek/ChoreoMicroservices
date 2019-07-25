from flask_injector import inject
from services.provider import ItemsProvider
import tweepy
import requests


@inject
def search(data_provider=ItemsProvider()) -> list:
    return data_provider.get_weather()


@inject
def put_weather(item, data_provider=ItemsProvider()):
    zip = item["zip_code"]
    r = requests.get(url="https://api.openweathermap.org/data/2.5/weather?zip="+str(zip)+",us&units=imperial&appid=904eaa61902dba144dc85f29013ec210")
    data_provider.put_weather(r.json())
    return "Weather logged"


@inject
def put_tweet():
    cfg = { 
    "consumer_key"        : "lZkuaQGAgdbLBJuMVOWsgNSkh",
    "consumer_secret"     : "KGCkLI4tPTArxgDuVpgV25lJ34l5hY4uu9BoVzZiv8YPfJ5ino",
    "access_token"        : "1108469359675084803-SVQapMQPKV2wYIS1iZlbedOCNxrx28",
    "access_token_secret" : "wEHj7K3KNHwE2oimNqGwwsJXtPrWHranUZShZ834X3nQY" 
    }
    auth = tweepy.OAuthHandler(cfg['consumer_key'], cfg['consumer_secret'])
    auth.set_access_token(cfg['access_token'], cfg['access_token_secret'])
    api = tweepy.API(auth)
    tweet = "It is " + str(r.json()["main"]["temp"]) + " degrees Fahrenheit in " + r.json()["name"]
    api.update_status(status=tweet) 
    return "Tweet delivered"