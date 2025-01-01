from pymongo import MongoClient
import os
from bson import ObjectId
from models.lesson_model import Lesson

client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
course_collection = db["courses"]


class Course:
    @staticmethod
    def get_one(course_id):
        try:
            # Fetch course by ID
            if not course_id:
                return None, "Invalid course id."
            
            course = course_collection.find_one({"_id": ObjectId(course_id)})
            if not course:
                return None, "Course not found."
            lesson_data = []
            for lesson_id in course.get("lessonIds", []):
                lesson, error = Lesson.get_one(lesson_id)
                if lesson:
                    lesson_data.append(lesson)
            course["lessonIds"] = lesson_data
            return course, None
        except Exception as e:
            return None, str(e)
    @staticmethod
    def get_all(page, limit, order, keyword, rating, label, priceFrom, priceTo,teacher_id):
        try:
            skip = (page - 1) * limit
            valid_sort_fields = {"createdAt", "title", "-createdAt", "-title", "rating", "-rating"}

            if not order or order not in valid_sort_fields:
                return None, f"Invalid 'order' value. Allowed values: {', '.join(valid_sort_fields)}"
            
            sort_field = order.lstrip('-')
            sort_direction = -1 if order.startswith('-') else 1

            # Build the query
            filters = []
            if keyword:
                filters.append({
                    "$or": [
                        {"title": {"$regex": keyword, "$options": "i"}},
                        {"description": {"$regex": keyword, "$options": "i"}}
                    ]
                })
            
            if rating > 0:
                filters.append({"rating": {"$gte": rating}})
            
            if priceFrom >= 0 and priceTo > priceFrom:
                filters.append({"price": {"$gte": priceFrom, "$lte": priceTo}})
            
            if label:
                filters.append({"label": {"$in": [label]}})
            if teacher_id: 
                filters.append({"teacher_id": teacher_id})
            
            query = {"$and": filters} if filters else {}

            courses_cursor = course_collection.find(query).sort(sort_field, sort_direction).skip(skip).limit(limit)
            courses = list(courses_cursor)

            # Fetch lessons for each course
            for course in courses:
                lesson_data = []
                for lesson_id in course.get("lessonIds", []):
                    lesson, error = Lesson.get_one(lesson_id)
                    if lesson:
                        lesson_data.append(lesson)
                course["lessonIds"] = lesson_data

            total_courses = course_collection.count_documents(query)
            total_pages = (total_courses + limit - 1) // limit

            return courses, total_courses, total_pages
        except Exception as e:
            return None, str(e)
  
