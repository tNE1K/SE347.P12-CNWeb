from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
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

        # Upload the file to Azure Blob Storage
        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(file, overwrite=True)

        # Get the URL of the uploaded file
        file_url = blob_client.url

        # Optionally, store the URL in MongoDB
        testselection_lesson_collection.insert_one({"file_url": file_url})

        return jsonify({"message": "Image uploaded successfully", "file_url": file_url}), 200

    except Exception as e:
        return jsonify({"message": "Error when uploading image", "error": str(e)}), 500
