from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import datetime

from models.comment_model import Comment
# Blueprint definition
comments_blueprint = Blueprint('comments', __name__)

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
comments_collection = db['comments']
lessons_collection = db['lessons']
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

@comments_blueprint.route('/', methods=['POST'])
def create_comments():
    try:
        data = request.json
        lesson_id = data.get("lesson_id")
        course_id = data.get("course_id")
        user_id = data.get("user_id")
        content  = data.get("content")
        rating = data.get("rating")
        if not (lesson_id or course_id):
            return jsonify({"message": "Either lesson_id or course_id is required"}), 400
        if not user_id or not content or not rating:
            return jsonify({"message": "Missing required fields"}), 400
        comment = {
            "lesson_id": lesson_id,
            "course_id": course_id,
            "user_id": user_id,
            "content": content,
            "rating": rating,
            "numberLike": 0,
            "numberDisLike": 0,
            "isReply": False,
            "replyIds": [],
            "createdAt": datetime.utcnow()
        }
        
        comment_id = comments_collection.insert_one(comment).inserted_id
        if lesson_id:
            lesson = lessons_collection.find_one({"_id": ObjectId(lesson_id)})
            if not lesson:
                return jsonify({"message": "Lesson not found"}), 404

            # Push comment to lesson's comments array
            lessons_collection.update_one(
                {"_id": ObjectId(lesson_id)},
                {"$push": {"comments": comment_id}}
            )

            # Recalculate average rating and update
            all_ratings = list(comments_collection.find({"lesson_id": lesson_id}, {"rating": 1}))
            avg_rating = sum(c["rating"] for c in all_ratings) / len(all_ratings)
            lessons_collection.update_one(
                {"_id": ObjectId(lesson_id)},
                {"$set": {"rating": avg_rating, "numberRatings": len(all_ratings)}}
            )
        if course_id:
            course = courses_collection.find_one({"_id": ObjectId(course_id)})
            if not course:
                return jsonify({"message": "Course not found"}), 404

            # Push comment to course's comments array
            courses_collection.update_one(
                {"_id": ObjectId(course_id)},
                {"$push": {"comments": comment_id}}
            )

            # Recalculate average rating and update
            all_ratings = list(comments_collection.find({"course_id": course_id}, {"rating": 1}))
            avg_rating = sum(c["rating"] for c in all_ratings) / len(all_ratings)
            courses_collection.update_one(
                {"_id": ObjectId(course_id)},
                {"$set": {"rating": avg_rating, "numberRatings": len(all_ratings)}}
            )

        return jsonify({"message": "Comment created successfully", "comment_id": str(comment_id)}), 201
    except Exception as e:
        return jsonify({"message": "Error creating comment", "error": str(e)}), 500
@comments_blueprint.route('/by-course/<course_id>', methods=['GET'])
def get_comments_by_course(course_id):
    try:
        # Get pagination parameters
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        # Find comments by course_id with pagination
        comments_cursor = comments_collection.find({"course_id": course_id}).skip((page - 1) * limit).limit(limit)
        comments = list(comments_cursor)

        # Count total comments for the course
        total_comments = comments_collection.count_documents({"course_id": course_id})

        response = {
            "status": "success",
            "data": parse_json(comments),
            "message": "Comments retrieved successfully!",
            "pagination": {
                "page": page,
                "limit": limit,
                "total_items": total_comments,
                "total_pages": (total_comments // limit) + (1 if total_comments % limit > 0 else 0)
            }
        }
        return jsonify(response), 200
    except Exception as e:
        response = {
            "status": "error",
            "message": "Error fetching comments",
            "error": str(e)
        }
        return jsonify(response), 500
@comments_blueprint.route('/by-lesson/<lesson_id>', methods=['GET'])
def get_comments_by_lesson(lesson_id):
    try:
        # Get pagination parameters
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        # Create the aggregation pipeline
        pipeline = [
            {"$match": {"lesson_id": lesson_id}},  # Match comments by lesson_id
            {"$skip": (page - 1) * limit},  # Pagination: Skip the documents for the current page
            {"$limit": limit},  # Limit the number of documents to the specified limit
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
            {"$unwind": {
                "path": "$user_info",  # Unwind the user_info array (since $lookup results in an array)
                "preserveNullAndEmptyArrays": True  # Keep comments even if no matching user
            }},
            {
                "$project": {  # Project the necessary fields
                    "_id": 1,
                    "lesson_id": 1,
                    "course_id": 1,
                    "user_id": 1,
                    "content": 1,
                    "rating": 1,
                    "numberLike": 1,
                    "numberDisLike": 1,
                    "isReply": 1,
                    "replyIds": 1,
                    "createdAt": 1,
                    "user_info.fullName": 1,
                    "user_info.email": 1
                }
            }
        ]

        # Execute the aggregation pipeline
        comments_cursor = comments_collection.aggregate(pipeline)
        comments = list(comments_cursor)

        # Count total comments for the lesson
        total_comments = comments_collection.count_documents({"lesson_id": lesson_id})

        # Loop through comments to get replies
        for comment in comments:
            reply_ids = comment.get("replyIds", [])
            replies = []
            for reply_id in reply_ids:
                reply_comment, error = Comment.get_one(reply_id)
                if reply_comment:
                    replies.append(reply_comment)
                else:
                    # Handle error if needed (e.g., log the error or skip the reply)
                    continue
            comment["replyIds"] = replies

        response = {
            "status": "success",
            "data": parse_json(comments),
            "message": "Comments retrieved successfully!",
            "pagination": {
                "page": page,
                "limit": limit,
                "total_items": total_comments,
                "total_pages": (total_comments // limit) + (1 if total_comments % limit > 0 else 0)
            }
        }
        return jsonify(response), 200
    except Exception as e:
        response = {
            "status": "error",
            "message": "Error fetching comments",
            "error": str(e)
        }
        return jsonify(response), 500
@comments_blueprint.route('/reply-comment/<comment_id>', methods=['POST'])
def reply_comment(comment_id):
    try:
        
        # Find the parent comment
        parent_comment = comments_collection.find_one({"_id": ObjectId(comment_id)})
        if not parent_comment:
            return jsonify({"status": "error", "message": "Parent comment not found"}), 404

        # Get request data
        data = request.json
        user_id = data.get("user_id")
        content = data.get("content")

        if not user_id or not content:
            return jsonify({"status": "error", "message": "Missing required fields: user_id or content"}), 400

        # Create the reply comment
        reply_comment = {
            "lesson_id": parent_comment.get("lesson_id"),
            "course_id": parent_comment.get("course_id"),
            "user_id": user_id,
            "content": content,
            "rating": None,  # No rating for replies
            "numberLike": 0,
            "numberDisLike": 0,
            "isReply": True,
            "replyIds": [],
            "createdAt": datetime.utcnow()
        }

        # Insert the reply comment into the database
        reply_comment_id = comments_collection.insert_one(reply_comment).inserted_id

        # Update the parent comment's replyIds array
        comments_collection.update_one(
            {"_id": ObjectId(comment_id)},
            {"$push": {"replyIds": reply_comment_id}}
        )

        return jsonify({
            "status": "success",
            "message": "Reply comment created successfully",
            "data": {
                "reply_comment_id": str(reply_comment_id),
                "parent_comment_id": comment_id
            }
        }), 201

    except Exception as e:
        return jsonify({"status": "error", "message": "Error creating reply comment", "error": str(e)}), 500