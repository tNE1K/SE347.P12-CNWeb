from flask import Blueprint,jsonify,request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from config import Config
from models.lesson_model import Lesson
from models.course_model import Course
import os
import json 
import math
course_blueprint = Blueprint('course', __name__)
CORS(course_blueprint, origins=[Config.API_URL], supports_credentials=True)
# MongoDB client setup (replace with your connection details)
client = MongoClient(os.getenv("MONGO_URI"))
db = client['backend']
courses_collection = db['courses']  
users_collection = db['users']  
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
        order = request.args.get('order', default='createdAt')
        keyword = request.args.get('keyword', default='').strip()
        rating = request.args.get('rating', default=0, type=int)
        label = request.args.get('label', default='').strip()
        priceFrom = request.args.get('priceFrom', default=0, type=int)
        priceTo = request.args.get('priceTo', default=10000000, type=int)
        teacher_id = request.args.get('teacher_id', default='').strip()

        # Validate order
        valid_sort_fields = {"createdAt", "title", "-createdAt", "-title", "rating", "-rating","price","-price"}
        if not order or order not in valid_sort_fields:
            return jsonify({"message": f"Invalid 'order' value. Allowed values: {', '.join(valid_sort_fields)}"}), 400

        # Fetch courses using the Course model's get_all method
        courses, total_courses, total_pages = Course.get_all(
            page, limit, order, keyword, rating, label, priceFrom, priceTo,teacher_id
        )
        if courses is None:
            return jsonify({"message": total_courses}), 400  
    
        return jsonify({
            "status": "success",
            "data": parse_json(courses),
            "pagination": {
                "page": page,
                "limit": limit,
                "total_items": total_courses,
                "total_pages": total_pages
            },
            "message": "Courses fetched successfully!"
        }), 200
    except Exception as e:
        return jsonify({"message": "Error fetching courses", "error": str(e)}), 500
@course_blueprint.route('/label/<label>', methods=['GET'])
def get_courses_by_label(label):
    try:
        # Fetch courses with the specified label
        courses, total_courses, total_pages = Course.get_all(
            1, 10000, "createdAt", "", 0, label, 0, 10000000, ""  # Query using the label
        )
        
        # If no courses are found, return a message indicating that
        if not courses:
            return jsonify({"message": f"No courses found with the label '{label}'."}), 404
        
        return jsonify({
            "status": "success",
            "data": parse_json(courses),
            "pagination": {
                "page": 1,
                "limit": 10000,
                "total_items": total_courses,
                "total_pages": total_pages
            },
            "message": f"Courses with label '{label}' fetched successfully!"
        }), 200

    except Exception as e:
        return jsonify({"message": "Error retrieving courses by label", "error": str(e)}), 500
@course_blueprint.route('/<course_id>', methods=['GET'])
def get_course_by_id(course_id):
    try:
        course, error = Course.get_one(course_id)
        if error:
            return jsonify({"message": error}), 400

        course = parse_json(course)  # Assuming parse_json is a function to serialize MongoDB data

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
        price = request.form.get('price')
        teacher_id = request.form.get('teacher_id')

        # If the cover is a file instead of a URL
        if 'cover' in request.files:
            cover_file = request.files['cover']
        
        try:
            label = json.loads(label) if label else []
            if not isinstance(label, list):
                return jsonify({"message": "Label must be a JSON array."}), 400
        except json.JSONDecodeError:
            return jsonify({"message": "Invalid JSON format for label."}), 400
        

        if not title or not teacher_id:
            return jsonify({"message": "Title and teacher_id is required."}), 400
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
            "numberRatings": 0,
            "status": status,
            "label": label,
            "price": int(price),
            "teacher_id" : teacher_id,
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
        cover = data.get('cover')  
        price = data.get('price')  
        lessonIds = data.get('lessonIds')  


        # try:
        #     label = json.loads(label) if label else []
        #     if not isinstance(label, list):
        #         return jsonify({"message": "Label must be a JSON array."}), 400
        # except json.JSONDecodeError:
        #     return jsonify({"message": "Invalid JSON format for label."}), 400
        update_data = {}
        if title:
            update_data["title"] = title
        if description:
            update_data["description"] = description
        if status:
            update_data["status"] = status
        if label:
            update_data["label"] = label
        if cover: 
            update_data["cover"] = cover
        if price: 
            update_data["price"] = price
        if lessonIds: 
            update_data["lessonIds"] = lessonIds
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
@course_blueprint.route('/get-user-count-stats/<teacher_id>', methods=['GET'])
def get_user_count_stats(teacher_id):
    try:
        courses, total_courses, total_pages = Course.get_all(
            1, 10000, "createdAt", "", 0, "", 0 , 10000000, teacher_id
        )    
        course_stats = []   
        unique_users = set()
        for course in courses:
            unique_users.update(course.get("participantsId", []))

            course_stats.append({
                "name": course["title"],
                "numberEnroll": len(course.get("participantsId", []))
            })
        total_unique_users = len(unique_users)
        return jsonify({
            "status": "success",
            "data": course_stats,
            "totalUniqueUsersEnroll": total_unique_users,
            "message": "Course stats fetched successfully!"
        }), 200

    except Exception as e:
        return jsonify({"message": "Error retrieving data", "error": str(e)}), 500
@course_blueprint.route('/get-course-count-stats/<teacher_id>', methods=['GET'])
def get_course_count_stats(teacher_id):
    try:
        # Fetch courses for the given teacher
        courses, total_courses, total_pages = Course.get_all(
            1, 10000, "createdAt", "", 0, "", 0 , 10000000, teacher_id
        )
        
        # Initialize a dictionary to store the count of courses by label
        label_count = {}

        # Iterate through the courses and count the labels
        for course in courses:
            for label in course.get("label", []):
                if label not in label_count:
                    label_count[label] = 0
                label_count[label] += 1
        
        # Convert the label_count dictionary to a list of dictionaries in the required format
        course_stats = [{"label": label, "numberCourse": count} for label, count in label_count.items()]

        return jsonify({
            "status": "success",
            "data": course_stats,
            "message": "Course stats fetched successfully!",
            "totalCourses" : total_courses
        }), 200

    except Exception as e:
        return jsonify({"message": "Error retrieving data", "error": str(e)}), 500
@course_blueprint.route('/get-user-enroll-course/<user_id>', methods=['GET'])
def get_user_enroll_course(user_id):
    try:
        # Fetch user by ID
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({'message': 'User not found.'}), 404

        # Get the list of enrolled course IDs
        participated_courses = user.get("participatedCourses", [])
        if not participated_courses:
            return jsonify({'message': 'No enrolled courses found for this user.', 'courses': []}), 200

        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        total_courses = len(participated_courses)
        total_pages = math.ceil(total_courses / limit)

        # Validate page and limit
        if page < 1 or limit < 1:
            return jsonify({'message': 'Invalid pagination parameters.'}), 400

        # Apply pagination to the course IDs
        start_index = (page - 1) * limit
        end_index = start_index + limit
        paginated_course_ids = participated_courses[start_index:end_index]

        # Fetch course details for the paginated IDs
        enrolled_courses = []
        for course_id in paginated_course_ids:
            course, error = Course.get_one(course_id)
            if course:
                enrolled_courses.append(course)
            else:
                print(f"Error fetching course {course_id}: {error}")

        return jsonify({
            'message': 'Enrolled courses retrieved successfully.',
            'data': parse_json(enrolled_courses),
            'pagination': {
                'page': page,
                'limit': limit,
                'total_items': total_courses,
                'total_pages': total_pages
            }
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': f'Failed to retrieve enrolled courses: {str(e)}'}), 500
