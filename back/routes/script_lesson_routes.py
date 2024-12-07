from flask import jsonify,request
from pymongo import MongoClient
import os

# MongoDB client setup (replace with your connection details)
client = MongoClient(os.getenv("MONGO_URI"))
db = client['backend']
script_lesson_collection = db['script_lessons']  # Collection for script lessons

def create_script_lesson():
    try:
        data = request.get_json()
        # Extract fields
        script_content = data.get('scriptContent') 
        script_expected = data.get('scriptExpected')

        # Validate input
        if not script_content or not script_expected:
            return jsonify({"message": "Invalid scriptContent or scriptExpected."}), 400

        # Insert into script_lesson_collection
        script_lesson = {
            "content": script_content,
            "expected": script_expected
        }
        script_result = script_lesson_collection.insert_one(script_lesson)

        # Return the inserted ID as the resource identifier

        return {"id": str(script_result.inserted_id)}, 201

    except Exception as e:
        return jsonify({"message": "Error processing script lesson", "error": str(e)}), 500
