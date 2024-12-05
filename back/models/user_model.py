from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
user_collection = db["users"]


class User:
    @staticmethod
    def find_by_email(email):
        return user_collection.find_one({"email": email})

    @staticmethod
    def get_all_user():
        users = user_collection.find()
        users_list = [doc for doc in users]
        for user in users_list:
            user["_id"] = str(user["_id"])
        return users_list
    
    @staticmethod
    def insert_user(user):
        user_collection.insert_one(user)
