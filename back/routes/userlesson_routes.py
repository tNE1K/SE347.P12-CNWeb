from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
from datetime import datetime
from bson import ObjectId

# Blueprint definition
userlesson_blueprint = Blueprint('userlesson', __name__)

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
userlesson_collection = db['userlessons']
def parse_json(data):
    """
    Recursively parse JSON data and convert all ObjectId fields to string.
    """
    if isinstance(data, dict):
        # If the data is a dictionary, recursively process its values
        return {key: parse_json(value) for key, value in data.items()}
    elif isinstance(data, list):
        # If the data is a list, recursively process its elements
        return [parse_json(item) for item in data]
    elif isinstance(data, ObjectId):
        # If the data is an ObjectId, convert it to string
        return str(data)
    else:
        # Return the value as is if it's not an ObjectId
        return data

@userlesson_blueprint.route('/create', methods=['POST'])
def create_user_lesson():
    try:
        data = request.json
        user_id = data.get("user_id")
        lesson_id = data.get("lesson_id")
        course_id = data.get("course_id")
        if not user_id or not lesson_id or not course_id:
            return jsonify({"message": "user_id, course_id and lesson_id are required."}), 400

        # Create new record
        new_user_lesson = {
            "user_id": user_id,
            "lesson_id": lesson_id,
            "course_id": course_id,
            "isCompleted": True,
            "createdAt": datetime.now().isoformat()
        }

        # Insert into MongoDB
        result = userlesson_collection.insert_one(new_user_lesson)

        return jsonify({"message": "User lesson created successfully.", "data": parse_json(new_user_lesson)}), 201

    except Exception as e:
        return jsonify({"message": "Error creating video lesson", "error": str(e)}), 500
@userlesson_blueprint.route('/get-course-progress', methods=['GET'])
def get_course_progress():
    try:
        user_id = request.args.get("user_id")
        course_id = request.args.get("course_id")

        if not user_id or not course_id:
            return jsonify({"message": "user_id and course_id are required."}), 400

        # Query MongoDB
        lessons = list(userlesson_collection.find({
            "user_id": user_id,
            "course_id": course_id
        }))

       
        return jsonify({"message": "User lessons retrieved successfully.", "data": parse_json(lessons)}), 200

    except Exception as e:
        return jsonify({"message": "Error retrieving user lessons", "error": str(e)}), 500