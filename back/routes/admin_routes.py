from flask import Blueprint, jsonify
from utils.token_utils import token_required
from models.user_model import User

admin_blueprint = Blueprint('/admin', __name__)

def verify_admin(payload):
    return payload.get("role") == "admin"


@admin_blueprint.route('/get_all_user', methods=['GET'])
@token_required
def get_all_user(payload):
    if verify_admin(payload):
        users_json = User.get_all_user()
        return jsonify({"data": users_json})
    else:
        return jsonify({"message": "No privillage"})
