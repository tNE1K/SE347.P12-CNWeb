from flask import Blueprint, request, jsonify, current_app
from flask_cors import CORS
from utils.token_utils import token_required
from models.user_model import User
import os
import uuid
from config import Config

JWT_SECRET = os.getenv("JWT_SECRET")

teacher_blueprint = Blueprint("teacher", __name__)
CORS(teacher_blueprint, origins=[Config.API_URL], supports_credentials=True)