from pymongo import MongoClient
import os
from bson import ObjectId

client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
lesson_collection = db["lessons"]
course_collection = db["courses"]


class Lesson:
    @staticmethod
    def get_one(lesson_id):
        # Fetch the lesson from the database by its ID
        if not lesson_id:
            return None, "Invalid lesson id."
        
        lesson = lesson_collection.find_one({"_id": ObjectId(lesson_id)})
        if not lesson:
            return None, "Lesson not found."
        
        # Fetch the resource data based on lesson type
        resource_data = None
        resource_id = lesson.get("resource", {}).get("id")

        if resource_id:
            resource_id_obj = ObjectId(resource_id)
            if lesson["type"] == "scriptlesson":
                resource_data = db["script_lessons"].find_one({"_id": resource_id_obj})
            elif lesson["type"] == "testselection":
                resource_data = db["testselection_lessons"].find_one({"_id": resource_id_obj})
            elif lesson["type"] == "video":
                resource_data = db["video_lessons"].find_one({"_id": resource_id_obj})

        # Add the resource data to the lesson
        if resource_data:
            lesson["resource"] = resource_data
        
        return lesson, None
    @staticmethod
    def delete(lesson_id):
        try:
            # Attempt to delete the lesson by its ID
            result = lesson_collection.delete_one({"_id": ObjectId(lesson_id)})

            # Check if the lesson was found and deleted
            if result.deleted_count == 0:
                return {"message": "Lesson not found."}, 404

            # Remove the lesson_id from any course's lessonIds array
            course_collection.update_many(
                {"lessonIds": lesson_id},  # Find the courses containing this lesson ID
                {"$pull": {"lessonIds": lesson_id}}  # Remove the lesson ID from the array
            )

            return {"status": "success", "message": "Lesson deleted successfully!"}, 200

        except Exception as e:
            return {"message": "Error deleting lesson", "error": str(e)}, 500
  
