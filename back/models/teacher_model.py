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
        return user_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"role": "teacher", "teacherVerifyRequest": False}}
        )
    
    @staticmethod
    def decline_teacher(id):
        return user_collection.update_one({"_id": ObjectId(id)}, {"$set" : {"teacherVerifyRequest": False}})

    @staticmethod
    def delete_teacher(id):
        result = user_collection.delete_one({"_id": id})
        print(result.deleted_count + " successfully deleted")
        
    @staticmethod
    def get_teacher_request():
        user_cursor = user_collection.find({"teacherVerifyRequest": True})
        user_list = []
        for user in user_cursor:
            user["_id"] = str(user["_id"])
            user_list.append({
                "id": user["_id"],
                "email": user.get("email"),
                "firstName": user.get("firstName"),
                "lastName": user.get("lastName"),
                "birthday": user.get("birthday"),
                "verifyImage": user.get("verifyImage")
            })
        return user_list