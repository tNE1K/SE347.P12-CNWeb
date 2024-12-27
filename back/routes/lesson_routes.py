from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from models.lesson_model import Lesson
import os
from routes.video_lesson_routes import create_video_lesson
from routes.testselection_lesson_routes import create_testselection_lesson
from routes.script_lesson_routes import create_script_lesson
import json

lesson_blueprint = Blueprint('lesson', __name__)
VALID_LESSON_TYPES = {"video", "testselection", "scriptlesson"}

client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
lesson_collection = db["lessons"]
course_collection = db["courses"]
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

@lesson_blueprint.route('/', methods=['GET'])
def get_all_lesson():

    # Get pagination parameters from the request
    page = int(request.args.get('page', 1))  # Default to page 1
    limit = int(request.args.get('limit', 10))  # Default to limit 10

    skip = (page - 1) * limit

    # Query MongoDB with pagination
    lessons = list(lesson_collection.find().skip(skip).limit(limit))

    # Get total count of lessons (without pagination)
    total_lessons = lesson_collection.count_documents({})

    # Prepare to join resource data
    joined_lessons = []
    for lesson in lessons:
        resources_data = []
        resource_ids = lesson.get("resource", [])
        
        for resource_id in resource_ids:
            resource_id_obj = ObjectId(resource_id)
            resource_data = None

            if lesson["type"] == "scriptlesson":
                resource_data = db["script_lessons"].find_one({"_id": resource_id_obj})
            elif lesson["type"] == "testselection":
                resource_data = db["testselection_lessons"].find_one({"_id": resource_id_obj})
            elif lesson["type"] == "video":
                resource_data = db["video_lessons"].find_one({"_id": resource_id_obj})

            if resource_data:
                resources_data.append(resource_data)

        # Add the resources data to the lesson
        lesson["resource"] = resources_data
        joined_lessons.append(lesson)

    # Convert ObjectId fields to strings and add 'id' field
    joined_lessons = parse_json(joined_lessons)

    # Prepare pagination response
    response = {
        "status": "success",
        "data": joined_lessons,
        "message": "lessons retrieved successfully!",
        "pagination": {
            "page": page,
            "limit": limit,
            "total_items": total_lessons,
            "total_pages": (total_lessons // limit) + (1 if total_lessons % limit > 0 else 0)  # Calculate total pages
        }
    }

    return jsonify(response), 200
@lesson_blueprint.route('/<lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    lesson, error = Lesson.get_one(lesson_id)
    
    if error:
        return jsonify({"message": error}), 400
    
    # Return the lesson data if found
    return jsonify({"status": "success", "data": parse_json(lesson), "message": "Lesson retrieved successfully!"}), 200


@lesson_blueprint.route('/', methods=['POST'])
def create_lesson():
    try:
        # Parse data from the request
        
        title = request.form.get('title')
        course_id = request.form.get('course_id')
        description = request.form.get('description')
        lesson_type = request.form.get('type')  # Enum for video | testselection | scriptlesson
        duration = request.form.get('duration')
        

        
        # Validate input
        if not title or not course_id:
            return jsonify({"message": "title and course_id are required."}), 400

        if lesson_type not in VALID_LESSON_TYPES:
            return jsonify({
                "message": f"Invalid lesson type. Allowed types are: {', '.join(VALID_LESSON_TYPES)}."
            }), 400
        id = ""
        resourceIds = []
        # Handle specific types of lessons
        if lesson_type == "video":
            response = create_video_lesson()
            if response[1] == 201:
                id = response[0]
            else:
                return response
        elif lesson_type == "testselection":
            response = create_testselection_lesson()
            if response[1] == 201:
                id = response[0]
            else:
                return response
        elif lesson_type == "scriptlesson":
            response = create_script_lesson()
            if response[1] == 201:
                id = response[0]
            else:
                return response
    
        resourceIds.append(str(id['id']))
        # Create a new lesson document
        new_lesson = {
            "title": title,
            "description": description,
            "type": lesson_type,
            "duration": int(duration),
            "resource": resourceIds,
            "comments": [],
            "createdAt": datetime.now().isoformat()
        }
        # Insert the lesson into the collection
        inserted_lesson = lesson_collection.insert_one(new_lesson)

        created_lesson = lesson_collection.find_one({"_id": inserted_lesson.inserted_id})
        resources_data = []
        for resource_id in resourceIds:
            resource_id_obj = ObjectId(resource_id)
            if created_lesson["type"] == "scriptlesson":
                resource_data = db["script_lessons"].find_one({"_id": resource_id_obj})
            elif created_lesson["type"] == "testselection":
                resource_data = db["testselection_lessons"].find_one({"_id": resource_id_obj})
            elif created_lesson["type"] == "video":
                resource_data = db["video_lessons"].find_one({"_id": resource_id_obj})

            if resource_data:
                resources_data.append(resource_data)

        # Add the resources data to the lesson
        created_lesson["resources"] = resources_data
        
        # query course by course_id and insert the id of createdlesson in to the array lessonIds 
        course_update_result = course_collection.update_one(
            {"_id": ObjectId(course_id)},
            {"$push": {"lessonIds": str(inserted_lesson.inserted_id)}}
        )
        if course_update_result.matched_count == 0:
            return jsonify({"message": "Course not found. Unable to update lessonIds."}), 404
        

        return jsonify({"status": "success", "data": parse_json(created_lesson), "message" :"lesson created successfully!"}), 201

    except Exception as e:
        return jsonify({"message": "Error creating lesson", "error": str(e)}), 500

@lesson_blueprint.route('/<lesson_id>', methods=['PUT'])
def update_lesson(lesson_id):
    try:
        # Parse data from the request
        title = request.form.get('title')
        description = request.form.get('description')
        duration = request.form.get('duration')  
        comments = request.form.get('comments', [])  # Default to empty list if no comments provided
        lesson_type = request.form.get('type')  # Enum for video | testselection | scriptlesson  
        selection_ids_str = request.form.get('selectionIds')  # Array of resourceIds to update directly only for testselection  
        if selection_ids_str:
            selection_ids = json.loads(selection_ids_str)
        else:
            selection_ids = []
        # Find the lesson by ID
        lesson = lesson_collection.find_one({"_id": ObjectId(lesson_id)})
        if not lesson:
            return jsonify({"message": "Lesson not found."}), 404
 
        
        new_resource_id = None
        if lesson_type and lesson_type == "video":
            old_resource_id = lesson.get("resource", [])
            if old_resource_id:
                old_resource_id = old_resource_id[0]
            else:
                old_resource_id = None
            # Delete the old resource based on its type
            if old_resource_id:
                resource_id_obj = ObjectId(old_resource_id)
                if lesson["type"] == "scriptlesson":
                    db["script_lessons"].delete_one({"_id": resource_id_obj})
            # Create a new resource based on the new lesson type
            if lesson_type == "video":
                response = create_video_lesson()   
            if response[1] == 201:
                new_resource_id = response[0]
            else:
                return response
        resources_data = []
        if new_resource_id:
            resources_data.append(new_resource_id['id'])
        update_data = {}
        if title:
            update_data["title"] = title
        if description:
            update_data["description"] = description
        if duration:
            update_data["duration"] = int(duration)
        if comments:
            update_data["comments"] = comments
        if lesson_type:
            update_data["type"] = lesson_type
        if resources_data and lesson_type == "video":
            update_data["resource"] = resources_data
        if lesson_type == "testselection" and selection_ids is not None:
            update_data["resource"] = selection_ids

        
        # Update the lesson in the database
        result = lesson_collection.update_one(
            {"_id": ObjectId(lesson_id)},
            {"$set": update_data}
        )
        if result.modified_count == 0:
            return jsonify({"message": "No changes were made to the lesson."}), 400

        return jsonify({
            "status": "success",
            "message": "Lesson updated successfully!"
        }), 200

    except Exception as e:
        return jsonify({"message": "Error updating lesson", "error": str(e)}), 500

@lesson_blueprint.route('/<lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id):
    try:

        response, status_code = Lesson.delete(lesson_id)

        return jsonify(response), status_code

    except Exception as e:
        return jsonify({"message": "Error deleting lesson", "error": str(e)}), 500