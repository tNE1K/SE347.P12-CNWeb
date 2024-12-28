from pymongo import MongoClient
import os
from bson import ObjectId

client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
comments_collection = db["comments"]
users_collection = db["users"]


class Comment:
    @staticmethod
    def get_one(comment_id):
        try:
            if not ObjectId.is_valid(comment_id):
                return None, "Invalid comment ID"

            pipeline = [
                {"$match": {"_id": ObjectId(comment_id)}},  
                {
                    "$lookup": {
                        "from": "users", 
                        "let": {"user_id": {"$toObjectId": "$user_id"}},  # Convert user_id to ObjectId
                        "pipeline": [
                            {"$match": {"$expr": {"$eq": ["$_id", "$$user_id"]}}}
                        ],
                        "as": "user_info"
                    }
                },
                {
                    "$unwind": {  
                        "path": "$user_info",
                        "preserveNullAndEmptyArrays": True,  
                    }
                },
                {
                    "$project": {  
                        "_id": 1,
                        "lesson_id": 1,
                        "course_id": 1,
                        "user_id": 1,
                        "content": 1,
                        "rating": 1,
                        "isReply": 1,
                        "replyIds": 1,
                        "createdAt": 1,
                        "user_info.fullName": 1,  
                        "user_info.email": 1,  
                        "user_info.avatar" : 1
                    }
                }
            ]

            result = list(comments_collection.aggregate(pipeline))
            if not result:
                return None, "Comment not found"
            return result[0], None  

        except Exception as e:
            return None, str(e)
    
