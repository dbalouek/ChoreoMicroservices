from flask_injector import inject
from services.provider import ItemsProvider
import tweepy
import requests

@inject
def search(data_provider=ItemsProvider()) -> list:
    return data_provider.get()

@inject
def put(item, data_provider=ItemsProvider()):
    zip = item["zip_code"]
    r = requests.get(url="https://api.openweathermap.org/data/2.5/weather?zip="+str(zip)+",us&units=imperial&appid=904eaa61902dba144dc85f29013ec210")
    data_provider.put(r.json())

    cfg = { 
    "consumer_key"        : "txQIINOX1cnNz9EySfpKdTkD2",
    "consumer_secret"     : "NN2erSOqXXWRWwGvO7JlSid0VISx0bslE6wK6w0AJqF4uGy5Oo",
    "access_token"        : "1638919993-biwwARnDUcIYUdr9zlveC8F5f8wVYhxLsf9Zry7",
    "access_token_secret" : "hAKHQbuxt5LJD660zxKFyOvsZkuEaaJ4clKsyRcmiGn7m" 
    }
    auth = tweepy.OAuthHandler(cfg['consumer_key'], cfg['consumer_secret'])
    auth.set_access_token(cfg['access_token'], cfg['access_token_secret'])
    api = tweepy.API(auth)
    tweet = "It is " + str(r.json()["main"]["temp"]) + " degrees Fahrenheit in " + r.json()["name"]
    api.update_status(status=tweet) 

    return "Tweet delivered"