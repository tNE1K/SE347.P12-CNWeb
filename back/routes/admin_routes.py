from flask import Blueprint, jsonify, request
from utils.token_utils import token_required
from models.user_model import User
from models.teacher_model import Teacher


admin_blueprint = Blueprint("/admin", __name__)


def verify_admin(payload):
    return payload.get("role") == "admin"


@admin_blueprint.route("/get_all_user", methods=["GET"])
@token_required
def get_all_user(payload):
    if verify_admin(payload):
        users_json = User.get_all_user()
        return jsonify({"data": users_json})
    else:
        return jsonify({"message": "No privillage"})


@admin_blueprint.route("/get_all_teacher", methods=["GET"])
@token_required
def get_all_teacher(payload):
    if verify_admin(payload):
        users_json = Teacher.get_all_teacher()
        return jsonify({"data": users_json})
    else:
        return jsonify({"message": "No privillage"})


@admin_blueprint.route("/get_all_course", methods=["GET"])
@token_required
def get_all_course(payload):
    if verify_admin(payload):
        users_json = Teacher.get_all_course()
        return jsonify({"data": users_json})
    else:
        return jsonify({"message": "No privillage"})

@admin_blueprint.route("/get_teacher_request", methods=["GET"])
@token_required
def get_teache_request(payload):
    if verify_admin(payload):
        users_json = Teacher.get_teacher_request()
        print(users_json)
        return jsonify({"data": users_json})
    else:
        return jsonify({"message": "No privillage"})
    
@admin_blueprint.route("/accept_teacher", methods=["POST"])
@token_required
def accept_teacher(payload):
    if verify_admin(payload):
        data = request.get_json()
        Teacher.verify_teacher(data["_id"])
        return jsonify({"message": "Teacher verified"})
    else:
        return jsonify({"message": "No privillage"})
    
@admin_blueprint.route("/decline_teacher", methods=["POST"])
@token_required
def decline_teacher(payload):
    if verify_admin(payload):
        data = request.get_json()
        Teacher.decline_teacher(data["_id"])
        return jsonify({"message": "Teacher declined"})
    else:
        return jsonify({"message": "No privillage"})
    