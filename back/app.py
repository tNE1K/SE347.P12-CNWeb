from flask import Flask
from routes.auth_routes import auth_blueprint
from routes.user_routes import user_blueprint
from routes.admin_routes import admin_blueprint
from routes.lesson_routes import lesson_blueprint
from routes.testselection_lesson_routes import testselection_lesson_blueprint
from routes.course_routes import course_blueprint
from routes.payment_routes import payment_blueprint
from routes.teacher_routes import teacher_blueprint
from routes.comment_routes import comments_blueprint
from routes.media_routes import media_blueprint
# from routes.upload_routes import upload_blueprint
from config import Config
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
# CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
CORS(app, supports_credentials=True, origins=["http://localhost:3000"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
# Register blueprints
app.register_blueprint(auth_blueprint, url_prefix="/auth")
app.register_blueprint(user_blueprint, url_prefix="/user")
app.register_blueprint(admin_blueprint, url_prefix="/admin")
app.register_blueprint(lesson_blueprint, url_prefix="/lesson")
app.register_blueprint(testselection_lesson_blueprint, url_prefix="/testselection")
app.register_blueprint(course_blueprint, url_prefix="/course")
app.register_blueprint(payment_blueprint, url_prefix="/payment")
app.register_blueprint(teacher_blueprint, url_prefix="/teacher")
app.register_blueprint(comments_blueprint, url_prefix="/comment")
app.register_blueprint(media_blueprint, url_prefix="/media")
# app.register_blueprint(upload_blueprint, url_prefix='/upload')

if __name__ == "__main__":
    app.run(debug=True)
