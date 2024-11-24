from flask import Flask
from routes.auth_routes import auth_blueprint
from routes.user_routes import user_blueprint
# from routes.upload_routes import upload_blueprint
from config import Config
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Register blueprints
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(user_blueprint, url_prefix='/user')
# app.register_blueprint(upload_blueprint, url_prefix='/upload')

if __name__ == "__main__":
    app.run(debug=True)
