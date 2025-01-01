from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client['backend']
messages_collection = db['messages']

class Message:
    def __init__(self, content, sender, recipient, chat_id, type='text', attachment_url=None):
        self.content = content
        self.sender = sender
        self.recipient = recipient
        self.chat_id = chat_id
        self.type = type
        self.attachment_url = attachment_url
        self.timestamp = datetime.utcnow()
        self.status = 'sent'
        self.is_read = False

    def save(self):
        message_data = self.to_dict()
        result = messages_collection.insert_one(message_data)
        return result.inserted_id

    @staticmethod
    def get_messages(chat_id, limit=50, skip=0):
        messages = messages_collection.find(
            {"chatId": chat_id}
        ).sort(
            "timestamp", -1  # -1 for descending order (newest first)
        ).skip(skip).limit(limit)
        return list(messages)
    
    @staticmethod
    def mark_as_read(message_id):
        messages_collection.update_one(
            {"_id": ObjectId(message_id)},
            {"$set": {"isRead": True}}
        )

    @staticmethod
    def update_status(message_id, status):
        messages_collection.update_one(
            {"_id": ObjectId(message_id)},
            {"$set": {"status": status}}
        )

    def to_dict(self):
        return {
            "content": self.content,
            "sender": self.sender,
            "recipient": self.recipient,
            "timestamp": self.timestamp,
            "status": self.status,
            "type": self.type,
            "attachment_url": self.attachment_url,
            "chatId": self.chat_id,
            "isRead": self.is_read
        }
    
    @staticmethod
    def find(query):
        return db.messages.find(query)  # Trả về Cursor từ MongoDB


    @staticmethod
    def get_unread_count(chat_id, user_id):
        return messages_collection.count_documents({
            "chatId": chat_id,
            "recipient": user_id,
            "isRead": False
        })