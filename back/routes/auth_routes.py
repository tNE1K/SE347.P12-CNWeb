from flask import Blueprint, make_response, request, jsonify
from flask_cors import CORS
from utils.token_utils import create_jwt_token
from models.user_model import User
from utils.hash_utils import hash_password, verify_password
import jwt
import os

JWT_SECRET = os.getenv("JWT_SECRET")

auth_blueprint = Blueprint("auth", __name__)
CORS(auth_blueprint, origins=["http://localhost:3000"], supports_credentials=True)


@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user = User.find_by_email(email)

    if email == "admin@example.com" and password == "admin":
        token = create_jwt_token(user)
        response = jsonify({"message": "Login successful"})
        response.set_cookie(
            "auth_token", token, httponly=True, secure=False, samesite="Strict"
        )  # secure=True in production
        return response, 200

    if user and verify_password(password, user["password"]):
        token = create_jwt_token(user)
        response = jsonify({"message": "Login successful"})
        response.set_cookie(
            "auth_token", token, httponly=True, secure=False, samesite="Strict"
        )  # secure=True in production
        return response, 200

    return jsonify({"message": "Invalid credentials"}), 401


@auth_blueprint.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Validate input
    if not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    # Check if the email is already registered
    if User.find_by_email(email):
        return jsonify({"message": "Email already registered"}), 400

    # Hash the password
    hashed_password = hash_password(password)

    # Insert the new user
    new_user = {"email": email, "password": hashed_password, "role": "user"}
    User.insert_user(new_user)  # Assuming `insert` is implemented in the User model
    response = jsonify({"message": "Signup successful"})
    return response, 201


@auth_blueprint.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout successful"})
    response.set_cookie(
        "auth_token", "", httponly=True, secure=False, samesite="Strict", expires=0
    )  # secure=True in production
    return response, 200


@auth_blueprint.route("/me", methods=["GET"])
def get_user():
    token = request.cookies.get("auth_token")
    print(token)
    if not token:
        return jsonify({"message": "Unauthorized"}), 401
    try:
        user_data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        print(user_data)
        return jsonify(
            {
                "id": user_data["user_id"],
                "email": user_data["email"],
                "role": user_data["role"],
            }
        )
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401
