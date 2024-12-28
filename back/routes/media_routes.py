from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, ContentSettings
from werkzeug.utils import secure_filename
from config import Config

# Blueprint definition
media_blueprint = Blueprint('media', __name__)

# MongoDB setup
client = MongoClient(Config.MONGO_URI)
db = client['backend']
testselection_lesson_collection = db['media']

# Azure Blob Storage setup
blob_service_client = BlobServiceClient.from_connection_string(Config.AZURE_STORAGE_CONNECTION_STRING)
container_name = "se347temp"  # Replace with your container name
container_client = blob_service_client.get_container_client(container_name)

# Allowed file extensions for images and videos
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'svg'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}

def allowed_file(filename, allowed_extensions):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@media_blueprint.route('/uploadImage', methods=['POST'])
def upload_image():
    try:
        # Check if the request contains a file
        if 'file' not in request.files:
            return jsonify({"message": "No file part"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"message": "No selected file"}), 400

        # Secure the filename
        filename = secure_filename(file.filename)

        # Initialize content_settings variable
        content_settings = None

        # Check if the file is an image or video based on extension
        if allowed_file(filename, ALLOWED_IMAGE_EXTENSIONS):
            content_type = 'image/' + filename.rsplit('.', 1)[1].lower()
            content_settings = ContentSettings(content_type=content_type)
        elif allowed_file(filename, ALLOWED_VIDEO_EXTENSIONS):
            content_type = 'video/' + filename.rsplit('.', 1)[1].lower()
            content_settings = ContentSettings(content_type=content_type)
        else:
            return jsonify({"message": "Invalid file type. Only images and videos are allowed."}), 400

        # Upload the file to Azure Blob Storage
        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(file, overwrite=True, content_settings=content_settings)

        # Get the URL of the uploaded file
        file_url = blob_client.url


        return jsonify({"message": "File uploaded successfully", "file_url": file_url}), 200

    except Exception as e:
        return jsonify({"message": "Error when uploading file", "error": str(e)}), 500
