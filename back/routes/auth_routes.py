from flask import Blueprint, request, jsonify
from flask_cors import CORS
from utils.token_utils import create_jwt_token
from models.user_model import User
from utils.hash_utils import hash_password,verify_password
import bcrypt

auth_blueprint = Blueprint('auth', __name__)
CORS(auth_blueprint, origins=["http://localhost:3000"])

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.find_by_email(email)
    if user and verify_password(password, user['password']):
        token = create_jwt_token(user)
        print(token)
        return jsonify({"message": "Login successful", "token": token}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    # Check if the email is already registered
    if User.find_by_email(email):
        return jsonify({"message": "Email already registered"}), 400

    # Hash the password
    hashed_password = hash_password(password)

    # Insert the new user
    new_user = {
        "email": email,
        "password": hashed_password,
        "role": "user"
    }
    User.insert_user(new_user)  # Assuming `insert` is implemented in the User model
    return jsonify({"message": "Signup successful"}), 201


