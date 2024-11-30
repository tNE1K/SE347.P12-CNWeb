import datetime
import jwt
import os
from functools import wraps
from flask import make_response, request, jsonify

JWT_SECRET = os.getenv("JWT_SECRET")

def create_jwt_token(user):
    if user["role"] == "admin":
        expiration_time = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(hours=1)
    else:
        expiration_time = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(days=3)

    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "exp": int(expiration_time.timestamp())
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token


def decode_and_get_role(token):
    decoded_role = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    if decoded_role.get("role") == "admin":
        return "admin"
    else:
        return "user"


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return make_response(jsonify({"message": "A valid token is missing!"}), 401)
        
        try:
            decoded_payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            print(decoded_payload)
        except jwt.ExpiredSignatureError:
            return make_response(jsonify({"message": "Token expired"}), 401)
        except jwt.InvalidTokenError:
            return make_response(jsonify({"message": "Invalid token"}), 401)

        return f(decoded_payload, *args, **kwargs)
    return decorated