from pymongo import MongoClient
from bson import ObjectId
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
user_collection = db["users"]

class Teacher:
    @staticmethod
    def find_by_id(id):
        return user_collection.find_one({"_id": id})

    @staticmethod
    def get_all_teacher():
        teacher = user_collection.find()
        teacher_list = [doc for doc in teacher]
        for teacher in teacher_list:
            teacher["_id"] = str(teacher["_id"])
        return teacher_list

    @staticmethod
    def get_all_course_from_teacher():
        teacher = user_collection.find()
        teacher_list = [doc for doc in teacher]
        for teacher in teacher_list:
            teacher["_id"] = str(teacher["_id"])
        return teacher_list

    @staticmethod
    def verify_teacher(id):
        return user_collection.update_one({"_id": ObjectId(id)}, {"$set" : {"role": "teacher"}})
    
    @staticmethod
    def decline_teacher(id):
        return user_collection.update_one({"_id": ObjectId(id)}, {"$set" : {"teacherVerifyRequest": False}})

    @staticmethod
    def delete_teacher(id):
        result = user_collection.delete_one({"_id": id})
        print(result.deleted_count + " successfully deleted")
        
    @staticmethod
    def get_teacher_request():
        user = user_collection.find({"teacherVerifyRequest": True})
        user_list = [doc for doc in user]
        for user in user_list:
            user["_id"] = str(user["_id"])
        return user_list