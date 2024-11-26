from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client['backend']
users_collection = db['users']

class User:
    @staticmethod
    def find_by_email(email):
        return users_collection.find_one({"email": email})

    @staticmethod
    def insert_user(data):
        return users_collection.insert_one(data)
