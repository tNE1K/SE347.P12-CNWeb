from flask import Blueprint, request, jsonify, current_app
from flask_cors import CORS
from utils.token_utils import token_required
from models.user_model import User
import os
import uuid

JWT_SECRET = os.getenv("JWT_SECRET")

teacher_blueprint = Blueprint("teacher", __name__)
CORS(teacher_blueprint, origins=["http://localhost:3000"], supports_credentials=True)

@teacher_blueprint.route('/upload-documents', methods=['POST'])
@token_required
def upload_documents(payload):
    id = payload.get('user_id')
    base_upload_dir = current_app.config['TEACHER_VERIFY_IMG_DIR']
    upload_dir = os.path.join(base_upload_dir, id)
    try:
        os.makedirs(upload_dir, exist_ok=True)
        # Accessing files from the request
        id_img = request.files.get('id_img')
        certificates = [request.files[key] for key in request.files if key.startswith('certificate_')]

        if not id_img or not certificates:
            return jsonify({'message': 'Both ID image and certificates are required.'}), 400

        # Generate unique filenames
        def generate_filename(file):
            ext = os.path.splitext(file.filename)[1]
            return str(uuid.uuid4()) + ext

        # Save ID image
        id_img_filename = os.path.join(upload_dir, generate_filename(id_img))
        id_img.save(id_img_filename)

        # Save certificate images
        certificate_filenames = []
        for cert in certificates:
            cert_filename = os.path.join(upload_dir, generate_filename(cert))
            cert.save(cert_filename)
            certificate_filenames.append(cert_filename)
            
        User.set_verify_request(id)

        # Response back with file paths
        return jsonify({
            'message': 'Files uploaded successfully.',
            'id_img': id_img_filename,
            'certificates': certificate_filenames
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': f'Failed to upload files: {str(e)}'}), 500