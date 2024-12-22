from flask import Blueprint,jsonify,request
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

from models.lesson_model import Lesson
import os
import json 
course_blueprint = Blueprint('course', __name__)

# MongoDB client setup (replace with your connection details)
client = MongoClient(os.getenv("MONGO_URI"))
db = client['backend']
courses_collection = db['courses']  
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

@course_blueprint.route('/', methods=['GET'])
def get_all_course():
    try:

        page = request.args.get('page', default=1, type=int)  
        limit = request.args.get('limit', default=10, type=int) 

        if page < 1 or limit < 1:
            return jsonify({"message": "Page and limit must be positive integers."}), 400

        skip = (page - 1) * limit

        courses_cursor = courses_collection.find().skip(skip).limit(limit)
        courses = list(courses_cursor)  

        total_courses = courses_collection.count_documents({})
        total_pages = (total_courses + limit - 1) // limit  

        for course in courses:
            lesson_data = []
            for lesson_id in course.get("lessonIds", []):
                lesson, error = Lesson.get_one(lesson_id)
                if lesson:
                    lesson_data.append(lesson)
                elif error:
                    lesson_data.append({"lesson_id": lesson_id, "error": error})
            course["lessonIds"] = lesson_data
        
        courses = [parse_json(course) for course in courses]

        return jsonify({
            "status": "success",
            "data": courses,
            "pagination": {
                "page": page,
                "limit": limit,
                "total_items": total_courses,
                "total_pages": total_pages
            },
            "message": "Courses fetched successfully!"
        }), 200
    except Exception as e:
        return jsonify({"message": "Error creating course", "error": str(e)}), 500

@course_blueprint.route('/<course_id>', methods=['GET'])
def get_course_by_id(course_id):
    try:
        if not course_id:
            return jsonify({"message": "Invalid course id."}), 400
        
        course = courses_collection.find_one({"_id": ObjectId(course_id)})
        if not course:
            return jsonify({"message": "Course not found."}), 404
        
        lesson_data = []
        for lesson_id in course.get("lessonIds", []):
            lesson, error = Lesson.get_one(lesson_id)
            if lesson:
                lesson_data.append(lesson)
            elif error:
                lesson_data.append({"lesson_id": lesson_id, "error": error})

        course["lessonIds"] = lesson_data
        course = parse_json(course)

        return jsonify({
            "status": "success",
            "data": course,
            "message": "Course fetched successfully!"
        }), 200

    except Exception as e:
        return jsonify({"message": "Error fetching course", "error": str(e)}), 500

@course_blueprint.route('/', methods=['POST'])
def create_course():
    try:
        title = request.form.get('title')
        description = request.form.get('description')
        cover_url = request.form.get('cover')  # If cover is a URL, it's part of form-data
        status = request.form.get('status')  # publish | hide
        label = request.form.get('label')

        # If the cover is a file instead of a URL
        if 'cover' in request.files:
            cover_file = request.files['cover']
        
        try:
            label = json.loads(label) if label else []
            if not isinstance(label, list):
                return jsonify({"message": "Label must be a JSON array."}), 400
        except json.JSONDecodeError:
            return jsonify({"message": "Invalid JSON format for label."}), 400
        

        if not title:
            return jsonify({"message": "Title is required."}), 400
        if status not in ["publish", "hide"]:
            return jsonify({"message": "Invalid status. Allowed values are 'publish' or 'hide'."}), 400

        new_course = {
            "title": title,
            "description": description,
            "cover": cover_url,
            "rating": 0,
            "participantsId":[],
            "lessonIds": [],
            "comments": [],
            "status": status,
            "label": label,
            "createdAt": datetime.now().isoformat()
        }

        courses_collection.insert_one(new_course)

        return jsonify({"status": "success", "data": parse_json(new_course), "message": "Course created successfully!"}), 201

    except Exception as e:
        return jsonify({"message": "Error creating course", "error": str(e)}), 500
@course_blueprint.route('/<course_id>', methods=['PUT'])
def update_course(course_id):
    try:
        data = request.json
        title = data.get('title')
        description = data.get('description')
        status = data.get('status')
        label = data.get('label')  


        # try:
        #     label = json.loads(label) if label else []
        #     if not isinstance(label, list):
        #         return jsonify({"message": "Label must be a JSON array."}), 400
        # except json.JSONDecodeError:
        #     return jsonify({"message": "Invalid JSON format for label."}), 400


        if not title:
            return jsonify({"message": "Title is required."}), 400
        if status not in ["publish", "hide"]:
            return jsonify({"message": "Invalid status. Allowed values are 'publish' or 'hide'."}), 400


        update_data = {}
        if title:
            update_data["title"] = title
        if description:
            update_data["description"] = description
        if status:
            update_data["status"] = status
        if label:
            update_data["label"] = label


        result = courses_collection.update_one(
            {"_id": ObjectId(course_id)}, 
            {"$set": update_data} 
        )

        if result.matched_count == 0:
            return jsonify({"message": "Course not found."}), 404

        return jsonify({
            "status": "success",
            "message": "Course updated successfully!"
        }), 200

    except Exception as e:
        return jsonify({"message": "Error updating course", "error": str(e)}), 500
@course_blueprint.route('/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        course = courses_collection.find_one({"_id": ObjectId(course_id)})
        
        if not course:
            return jsonify({"message": "Course not found."}), 404
        
        for lesson_id in course.get("lessonIds", []):
            lesson_response, status_code = Lesson.delete(lesson_id) 
            if status_code != 200:

                return jsonify(lesson_response), status_code

        result = courses_collection.delete_one({"_id": ObjectId(course_id)})

        if result.deleted_count == 0:
            return jsonify({"message": "Course not found."}), 404

        return jsonify({
            "status": "success",
            "message": "Course and its lessons deleted successfully!"
        }), 200

    except Exception as e:
        return jsonify({"message": "Error deleting course", "error": str(e)}), 500