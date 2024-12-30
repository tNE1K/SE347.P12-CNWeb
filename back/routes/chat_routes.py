from flask import Blueprint, request, jsonify
from flask_socketio import join_room, leave_room, emit
from models.message_model import Message
from utils.token_utils import token_required
from models.chat_model import Chat
from flask_cors import cross_origin
from bson import ObjectId

chat_blueprint = Blueprint('chat', __name__)

connected_users = {}

def setup_socketio(socketio):
    @socketio.on('connect')
    def handle_connect():
        user_id = request.args.get('user_id')
        if not user_id:
            print("User ID not provided")
            return False
        print("User ID provided: " + user_id)
        connected_users[user_id] = request.sid
        print(f"User {user_id} connected with session ID {request.sid}")
        emit("connection_success", {"message": "Connected successfully!"})

    @socketio.on('join_room')
    def handle_join_room(data):
        print(data)
        room = data.get('room')
        user_id = request.args.get('user_id')  

        if room:
            join_room(room)
            print(f"User {user_id} joined room {room}")
            emit("room_joined", {"message": f"{user_id} joined room {room}"}, room=room)

    @socketio.on('send_message')
    def handle_send_message(data):
        room = data.get('room')
        message = data.get('message')
        sender_id = request.args.get('user_id')

        if room and message:
            print(f"Message from {sender_id} to room {room}: {message}")
            emit("receive_message", {"sender": sender_id, "message": message}, room=room)
            msg = Message(sender_id, room, message)
            msg.save()  # Lưu tin nhắn vào MongoDB

    @socketio.on('leave_room')
    def handle_leave_room(data):
        room = data.get('room')
        user_id = request.args.get('user_id')

        if room:
            leave_room(room)
            print(f"User {user_id} left room {room}")
            emit("room_left", {"message": f"{user_id} left room {room}"}, room=room)

    @socketio.on('disconnect')
    def handle_disconnect():
        user_id = next((k for k, v in connected_users.items() if v == request.sid), None)
        if user_id:
            del connected_users[user_id]
            print(f"User {user_id} disconnected")

@chat_blueprint.route('/list', methods=['GET'])
@token_required
def get_chat_list(payload):
    user_id = payload.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    try:
        # Tìm tất cả chat mà user là người tạo
        user_chats = Chat.find({
            "participants.0": user_id
        })
        
        chat_list = []
        for chat in user_chats:
            # Lấy thông tin chi tiết của tin nhắn cuối
            last_message = chat.get('lastMessage', {})
            if last_message:
                # Định dạng timestamp nếu có
                timestamp = last_message.get('timestamp')
                if timestamp:
                    last_message['timestamp'] = timestamp.isoformat() if hasattr(timestamp, 'isoformat') else timestamp

            chat_data = {
                "id": str(chat['_id']),
                "participants": {
                    "sender": chat['participants'][0],  # người tạo chat
                    "receiver": chat['participants'][1] if len(chat['participants']) > 1 else None  # người nhận
                },
                "isGroupChat": chat.get('isGroupChat', False),
                "lastMessage": {
                    "senderId": last_message.get('senderId'),
                    "content": last_message.get('content'),
                    "timestamp": last_message.get('timestamp')
                }
            }
            chat_list.append(chat_data)
        
        return jsonify({
            "status": "success",
            "data": {
                "chats": chat_list
            }
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# API route để lấy tin nhắn
@chat_blueprint.route('/messages', methods=['GET'])
@token_required
def get_chat_messages(payload):
    print(payload)
    sender = request.args.get('user_id')
    recipient = request.args.get('recipient')
    if not sender or not recipient:
        return jsonify({"error": "Sender and recipient are required"}), 400
    messages = Message.get_messages(sender, recipient)  # Lấy tin nhắn từ MongoDB
    return jsonify(messages), 200

# API route để gửi tin nhắn
@chat_blueprint.route('/send', methods=['POST'])
@token_required
def send_chat_message():
    data = request.json
    sender = data.get('sender')
    recipient = data.get('recipient')
    message = data.get('message')

    if not sender or not recipient or not message:
        return jsonify({"error": "Sender, recipient, and message are required"}), 400

    msg = Message(sender, recipient, message)
    msg.save()  # Lưu tin nhắn vào MongoDB
    return jsonify({"success": True}), 200