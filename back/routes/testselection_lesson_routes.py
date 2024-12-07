from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
# Blueprint definition
testselection_lesson_blueprint = Blueprint('testselection_lesson', __name__)
# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client['backend']
testselection_lesson_collection = db['testselection_lessons']

@testselection_lesson_blueprint.route('/', methods=['POST'])
def create_testselection_lesson():
    try:
        data = request.get_json()
        question = data.get("question")
        explanation = data.get("explanation")
        answerA = data.get("answerA")
        answerB = data.get("answerB")
        answerC = data.get("answerC")
        answerD = data.get("answerD")
        correctAnswer = data.get("correctAnswer")

        if not all([question, explanation, answerA, answerB, answerC, answerD, correctAnswer]):
            return jsonify({"message": "All fields are required for testselection lessons."}), 400

        testselection_lesson = {
            "question": question,
            "explanation": explanation,
            "answerA": answerA,
            "answerB": answerB,
            "answerC": answerC,
            "answerD": answerD,
            "correctAnswer": correctAnswer, # "A" | "B" | "C" | "D"
        }
        result = testselection_lesson_collection.insert_one(testselection_lesson)
        return {"id": str(result.inserted_id)}, 201
    except Exception as e:
        return jsonify({"message": "Error creating testselection lesson", "error": str(e)}), 500
