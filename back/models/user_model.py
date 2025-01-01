from pymongo import MongoClient
from utils.token_utils import is_token_expired
from bson import ObjectId
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
user_collection = db["users"]

class User:
    @staticmethod
    def find_by_email(email):
        return user_collection.find_one({"email": email})

    @staticmethod
    def find_by_id(id):
        return user_collection.find_one({"_id": ObjectId(id)})

    @staticmethod
    def insert_user(user):
        user_collection.insert_one(user)

    @staticmethod
    def get_all_user():
        users = user_collection.find()
        return [
            {**user, "_id": str(user["_id"])} for user in users
        ]

    @staticmethod
    def set_verify_token(email, token):
        return user_collection.update_one(
            {"email": email}, {"$set": {"email_verify_token": token}}
        )

    @staticmethod
    def check_verify_token(email):
        user = user_collection.find_one({"email": email}, {"email_verify_token": 1, "_id": 0})
        token = user.get("email_verify_token")
        return is_token_expired(token) if token else True

    @staticmethod
    def del_verify_token(email):
        return user_collection.update_one(
            {"email": email}, {"$unset": {"email_verify_token": ""}}
        )

    @staticmethod
    def update_user_first_name(email, first_name):
        return User._update_user_field(email, "firstName", first_name)

    @staticmethod
    def update_user_last_name(email, last_name):
        return User._update_user_field(email, "lastName", last_name)

    @staticmethod
    def update_user_birthday(email, birthday):
        return User._update_user_field(email, "birthday", birthday)

    @staticmethod
    def set_verify_request(id):
        return user_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": {"teacherVerifyRequest": True}}
        )

    @staticmethod
    def _update_user_field(email, field, value):
        return user_collection.update_one({"email": email}, {"$set": {field: value}})
