from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
teacher_collection = db["teachers"]


class User:
    @staticmethod
    def find_by_id(id):
        return teacher_collection.find_one({"_id": id})

    @staticmethod
    def get_all_teacher():
        teacher = teacher_collection.find()
        teacher_list = [doc for doc in teacher]
        for teacher in teacher_list:
            teacher["_id"] = str(teacher["_id"])
        return teacher_list
    
    @staticmethod
    def verify_teacher(teacher_id):
        result = teacher_collection.update_one({'_id': teacher_id},{'isVerify' : True})
        print(result.matched_count + " successfully updated")
        
    @staticmethod
    def delete_teacher(teacher_id):
        result = teacher_collection.delete_one({'_id': teacher_id})
        print(result.deleted_count + " successfully deleted")