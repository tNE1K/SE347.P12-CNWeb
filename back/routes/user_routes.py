from flask import Blueprint, request, jsonify, current_app
from utils.token_utils import token_required
from models.user_model import User
import os
import uuid
from azure.storage.blob import BlobServiceClient, ContentSettings
from config import Config  # Assuming this has your Azure connection string setup
import jwt

JWT_SECRET = os.getenv("JWT_SECRET")

user_blueprint = Blueprint('/user', __name__)

# Azure Blob Storage setup
blob_service_client = BlobServiceClient.from_connection_string(Config.AZURE_STORAGE_CONNECTION_STRING)
container_name = "se347temp"  # Replace with your Azure Blob container name
container_client = blob_service_client.get_container_client(container_name)

@user_blueprint.route('/profile', methods=['GET', 'PUT'])
@token_required
def profile(current_user):
    if request.method == 'GET':
        return jsonify(current_user), 200
    if request.method == 'PUT':
        # Update user profile logic
        return jsonify({"message": "Profile updated"}), 200

@user_blueprint.route('/upload-verify-documents/<user_id>', methods=['POST'])
@token_required
def upload_documents(user_id):
    try:
        # Accessing files from the request
        id_img = request.files.get('id_img')
        certificates = [request.files[key] for key in request.files if key.startswith('certificate_')]
        
        if not id_img or not certificates:
            return jsonify({'message': 'Both ID image and certificates are required.'}), 400
        
        # Define the allowed extensions for image files
        ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'}
        
        # Function to check if a file is allowed
        def allowed_file(filename):
            return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
        
        # Function to generate a unique blob path based on user_id
        def generate_blob_path(file):
            ext = os.path.splitext(file.filename)[1]
            return f"img/verify/{user_id}/{uuid.uuid4()}{ext}"

        # Initialize a list to store certificate filenames
        certificate_filenames = []
        
        # Handle ID image upload
        if allowed_file(id_img.filename):
            id_img_blob_path = generate_blob_path(id_img)
            id_img_blob_client = container_client.get_blob_client(id_img_blob_path)
            id_img_blob_client.upload_blob(id_img.stream, overwrite=True, content_settings=ContentSettings(content_type='image/jpeg'))  # Assuming JPEG for ID images
        else:
            return jsonify({'message': 'Invalid ID image type.'}), 400

        # Handle certificate uploads
        for cert in certificates:
            if allowed_file(cert.filename):
                cert_blob_path = generate_blob_path(cert)
                cert_blob_client = container_client.get_blob_client(cert_blob_path)
                cert_blob_client.upload_blob(cert.stream, overwrite=True, content_settings=ContentSettings(content_type='image/jpeg'))  # Assuming JPEG for certificates
                certificate_filenames.append(cert_blob_path)
            else:
                return jsonify({'message': 'Invalid certificate image type.'}), 400

        # Update verification request for the user in the database
        User.set_verify_request(user_id)

        # Generate URLs for uploaded files
        id_img_url = f"https://<your-account-name>.blob.core.windows.net/{container_name}/{id_img_blob_path}"
        certificate_urls = [f"https://<your-account-name>.blob.core.windows.net/{container_name}/{filename}" for filename in certificate_filenames]

        return jsonify({
            'message': 'Files uploaded successfully.',
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': f'Failed to upload files: {str(e)}'}), 500
    
@user_blueprint.route('/me', methods=['GET'])
@token_required
def get_info(payload):
    user = User.find_by_email(payload['email'])
    return jsonify(
            {
                "email": user["email"],
                "firstName": user["firstName"],
                "lastName": user["lastName"],
                "birthday": user["birthday"],
                "teacherVerifyRequest": user["teacherVerifyRequest"],
            }), 200

@user_blueprint.route('/update', methods=['POST'])
@token_required
def update_user_details(payload):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    email = data.get("email")
    update_data = data.get("updateData")

    if not email or not update_data:
        return jsonify({"error": "Missing required fields: 'email' or 'updateData'"}), 400

    birthday = update_data.get("birthday")
    first_name = update_data.get("firstName")
    last_name = update_data.get("lastName")

    if not all([birthday, first_name, last_name]):
        return jsonify({"error": "Missing fields in updateData"}), 400

    User.update_user_birthday(email, birthday)
    User.update_user_first_name(email, first_name)
    User.update_user_last_name(email, last_name)

    return jsonify({"message": "success"}), 200

@user_blueprint.route('/upload-video/<user_id>', methods=['POST'])
@token_required
def upload_video(user_id):
    try:
        # Accessing the video file from the request
        video = request.files.get('video')
        
        if not video:
            return jsonify({'message': 'Video file is required.'}), 400
        
        # Define the allowed extensions for video files
        ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv'}
        
        # Function to check if a file is allowed
        def allowed_file(filename):
            return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS
        
        # Function to generate a unique blob path for video
        def generate_blob_path(file):
            ext = os.path.splitext(file.filename)[1]
            return f"videos/{user_id}/{uuid.uuid4()}{ext}"
        
        # Check if the video file is allowed
        if not allowed_file(video.filename):
            return jsonify({'message': 'Invalid video file type.'}), 400

        # Generate blob path for the video
        video_blob_path = generate_blob_path(video)
        
        # Get a blob client for the video
        video_blob_client = container_client.get_blob_client(video_blob_path)
        
        # Upload the video file
        video_blob_client.upload_blob(
            video.stream,
            overwrite=True,
            content_settings=ContentSettings(content_type='video/mp4')  # Assuming MP4 for videos
        )

        # Generate the URL for the uploaded video
        video_url = f"https://<your-account-name>.blob.core.windows.net/{container_name}/{video_blob_path}"

        return jsonify({
            'message': 'Video uploaded successfully.',
            'video_url': video_url
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': f'Failed to upload video: {str(e)}'}), 500
    
@user_blueprint.route('/get-video/<user_id>/<video_name>', methods=['GET'])
@token_required
def get_video(user_id, video_name):
    try:
        # Generate the blob path based on user_id and video_name
        video_blob_path = f"videos/{user_id}/{video_name}"
        
        # Check if the blob exists
        video_blob_client = container_client.get_blob_client(video_blob_path)
        if not video_blob_client.exists():
            return jsonify({'message': 'Video not found.'}), 404

        # Generate the video URL
        video_url = f"https://<your-account-name>.blob.core.windows.net/{container_name}/{video_blob_path}"

        return jsonify({
            'message': 'Video retrieved successfully.',
            'video_url': video_url
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': f'Failed to retrieve video: {str(e)}'}), 500

