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
from routes.chat_routes import chat_blueprint, setup_socketio
from routes.userlesson_routes import userlesson_blueprint
# from routes.upload_routes import upload_blueprint
from config import Config
from flask_cors import CORS
from flask_socketio import SocketIO
import eventlet
app = Flask(__name__)
app.config.from_object(Config)


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
app.register_blueprint(chat_blueprint, url_prefix="/chat")
app.register_blueprint(userlesson_blueprint, url_prefix="/progress")


socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000"], 
                    ping_interval=25,  # Seconds between pings
                    ping_timeout=60,    # Timeout for ping response
                    reconnect=True,    # Enable auto reconnection
                    reconnection_attempts=5,  # Number of reconnection attempts
                    reconnection_delay=2,  # Delay before retrying reconnect
                    reconnection_delay_max=10)  # Max delay between reconnect attempts
setup_socketio(socketio)
# app.register_blueprint(upload_blueprint, url_prefix='/upload')

if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, host=Config.API, port=5000, debug=True)