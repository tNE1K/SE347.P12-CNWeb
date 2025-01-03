from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client['backend']
messages_collection = db['chats']

class Chat:
    @staticmethod
    def get_or_create_chat(chat_id):
        chat = db.chats.find({"_id": ObjectId(chat_id)})
        if not chat:
            db.chats.insert_one({
                "_id": ObjectId(chat_id),
                "participants": [],
                "lastMessage": {
                    "senderId": None,
                    "content": None,
                    "timestamp": None
                },
                "isGroupChat": False
            })
        return chat or db.chats.find_one({"_id": ObjectId(chat_id)})

    @staticmethod
    def update_last_message(chat_id, content, sender_id):
        db.chats.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$set": {
                    "lastMessage": {
                        "senderId": sender_id,
                        "content": content,
                        "timestamp": datetime.utcnow()
                    }
                }
            }
        )
    
    @staticmethod
    def find(query):
        return db.chats.find(query)
    
    @staticmethod
    def create_chat(participants,user_id, is_group=False):
        chat_data = {
            "participants": [participants, user_id],
            "lastMessage": {
            "senderId": user_id,
            "content": None,
            "timestamp": None
            },
            "isGroupChat": is_group
        }
        result = db.chats.insert_one(chat_data)
        return result.inserted_id

    @staticmethod
    def check_participants_exist(participants):
        if len(participants) < 2:
            return False
        chat_exists = db.chats.find_one({"participants": {"$all": participants}}) is not None
        return chat_exists
    
    @staticmethod
    def delete_chat(chat_id):
        db.chats.delete_one({"_id": ObjectId(chat_id)})
        # db.messages.delete_many({"chatId": ObjectId(chat_id)})
