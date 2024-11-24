import jwt
import os
from functools import wraps
from flask import request, jsonify
from config import Config

JWT_SECRET = os.getenv("JWT_SECRET")

def create_jwt_token(user):
    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")  # Use Config.SECRET_KEY
    return token



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        return f(decoded, *args, **kwargs)
    return decorated
