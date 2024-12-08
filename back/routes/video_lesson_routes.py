from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
# Blueprint definition
video_lesson_blueprint = Blueprint('video_lesson', __name__)

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
video_lesson_collection = db['video_lessons']

@video_lesson_blueprint.route('/', methods=['POST'])
def create_video_lesson():
    try:
        file = request.form.get("file")
        duration = request.form.get("duration")

        if not file or not duration:
            return jsonify({"message": "File and duration are required for video lessons."}), 400

        video_lesson = {"file": file, "duration": int(duration)}
        result = video_lesson_collection.insert_one(video_lesson)

        return {"id": str(result.inserted_id)}, 201
    except Exception as e:
        return jsonify({"message": "Error creating video lesson", "error": str(e)}), 500
