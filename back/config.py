import os
from dotenv import load_dotenv

load_dotenv()

TEACHER_VERIFY_IMG_DIR = 'img/teacher/verify'
if not os.path.exists(TEACHER_VERIFY_IMG_DIR):
    os.makedirs(TEACHER_VERIFY_IMG_DIR)

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    MONGO_URI = os.getenv("MONGO_URI")
    JWT_SECRET = os.getenv("JWT_SECRET")
    CONFIRM_SECRET = os.getenv("CONFIRM_SECRET")
    AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    TEACHER_VERIFY_IMG_DIR = 'img/teacher/verify'