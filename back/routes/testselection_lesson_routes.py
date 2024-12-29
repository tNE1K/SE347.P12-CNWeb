from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from bson import ObjectId
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
        
        question = request.form.get("question")
        explanation = request.form.get("explanation")
        answerA = request.form.get("answerA")
        answerB = request.form.get("answerB")
        answerC = request.form.get("answerC")
        answerD = request.form.get("answerD")
        correctAnswer = request.form.get("correctAnswer")

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
@testselection_lesson_blueprint.route('/answer/<test_selection_id>', methods=['POST'])
def submit_answer(test_selection_id):
    try:
        data = request.json
        # Get the answer from the request
        user_answer = data.get("answer")  # Expecting "A", "B", "C", or "D"
        # Fetch the lesson from the database
        test_selection = testselection_lesson_collection.find_one({"_id": ObjectId(test_selection_id)})

        if not test_selection:
            return jsonify({"message": "Test Selection not found."}), 404
        print("-----------------------------------------")
        print(test_selection)
        print(user_answer)
        # Check if the answer is correct
        is_correct = user_answer == test_selection['correctAnswer']
        # Return a response
        return jsonify({
            "message": "Answer submitted successfully.",
            "is_correct": is_correct
        }), 200

    except Exception as e:
        return jsonify({"message": "Error submitting answer", "error": str(e)}), 500