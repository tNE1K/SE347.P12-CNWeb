from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from models.lesson_model import Lesson
import os
from routes.video_lesson_routes import create_video_lesson
from routes.testselection_lesson_routes import create_testselection_lesson
from routes.script_lesson_routes import create_script_lesson

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
        resource_data = None
        resource_id = lesson.get("resource", {}).get("id")
        
        if resource_id:
            # Convert the resource_id to ObjectId
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

        # Add the lesson to the joined lessons list
        joined_lessons.append(lesson)

    # Convert ObjectId fields to strings and add 'id' field
    joined_lessons = parse_json(joined_lessons)

    # Prepare pagination response
    response = {
        "status": "success",
        "data": joined_lessons,
        "message": "lessons retrieved successfully!",
        "pagination": {
            "total": total_lessons,
            "limit": limit,
            "current_page": page,
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
        # Create a new lesson document
        new_lesson = {
            "title": title,
            "description": description,
            "type": lesson_type,
            "duration": int(duration),
            "resource": id,
            "comments": []
        }

        # Insert the lesson into the collection
        inserted_lesson = lesson_collection.insert_one(new_lesson)
        created_lesson = lesson_collection.find_one({"_id": inserted_lesson.inserted_id})
        resource_data = None
        resource_id = created_lesson.get("resource", {}).get("id")
        
        if resource_id:
            # Convert the resource_id to ObjectId
            resource_id_obj = ObjectId(resource_id)
            if created_lesson["type"] == "scriptlesson":
                resource_data = db["script_lessons"].find_one({"_id": resource_id_obj})
            elif created_lesson["type"] == "testselection":
                resource_data = db["testselection_lessons"].find_one({"_id": resource_id_obj})
            elif created_lesson["type"] == "video":
                resource_data = db["video_lessons"].find_one({"_id": resource_id_obj})

        # Add the resource data to the lesson
        if resource_data:
            created_lesson["resource"] = resource_data
        
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
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        duration = data.get('duration')  # Enum for video | testselection | scriptlesson
        comments = data.get('comments', [])  # Default to empty list if no comments provided

        # Prepare update data
        update_data = {
            "title": title,
            "description": description,
            "duration": duration,
            "comments": comments
        }

        # Update the lesson in the database
        result = lesson_collection.update_one(
            {"_id": ObjectId(lesson_id)},  # Find the lesson by its ObjectId
            {"$set": update_data}  # Set the fields to update
        )

        if result.matched_count == 0:
            return jsonify({"message": "Lesson not found."}), 404

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