from flask import Blueprint, request, jsonify
from utils.token_utils import token_required
from models.user_model import User

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/profile', methods=['GET', 'PUT'])
@token_required
def profile(current_user):
    if request.method == 'GET':
        return jsonify(current_user), 200
    if request.method == 'PUT':
        # Update user profile logic
        return jsonify({"message": "Profile updated"}), 200
