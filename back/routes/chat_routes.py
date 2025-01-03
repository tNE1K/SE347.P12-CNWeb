from flask import Blueprint, request, jsonify
from flask_socketio import join_room, leave_room, emit
from models.message_model import Message
from utils.token_utils import token_required
from models.chat_model import Chat
from flask_cors import cross_origin
from bson import ObjectId
from datetime import datetime
from models.user_model import User

chat_blueprint = Blueprint('chat', __name__)

connected_users = {}
chat_rooms = {}       # {chat_id: [user_id1, user_id2]}

def setup_socketio(socketio):
    @socketio.on('connect')
    def handle_connect():
        user_id = request.args.get('user_id')
        chat_id = request.args.get('chat_id')

        if not user_id:
            print("User ID not provided")
            return False
        print(f"User {user_id} attempting to connect to chat {chat_id}")

        if chat_id not in chat_rooms:
            chat_rooms[chat_id] = [] 

        if user_id not in chat_rooms[chat_id]:
            chat_rooms[chat_id].append(user_id) 

        join_room(chat_id)
        print(f"User {user_id} connected and joined room {chat_id}")
        emit("connection_success", {"message": f"User {user_id} successfully joined room {chat_id}"})

    @socketio.on('send_message')
    def handle_send_message(data):
        room = data.get('room')
        content = data.get('content')
        sender_id = request.args.get('user_id')
        recipient_id = data.get('recipient_id')
        message_type = data.get('type', 'text')
        attachment_url = data.get('attachment_url', None)
        sender_sid = request.sid

        if room and content and sender_id and recipient_id:
            print(f"Message from {sender_id} to room {room}: {content}")
            emit("receive_message", {"sender": sender_id, "content": content}, room=room, skip_sid=sender_sid)

            message = Message(
                content=content,
                sender=sender_id,
                recipient=recipient_id,
                chat_id=room,
                type=message_type,
                attachment_url=attachment_url
            )
            message_id = message.save()
            Chat.update_last_message(room, content, sender_id) 
            print(f"Message saved to MongoDB with ID: {message_id}")

            return {"status": "success", "content": "Message sent successfully!"}
        else:
            return {"status": "error", "content": "Invalid message data!"}

    @socketio.on('leave_room')
    def handle_leave_room(data):
        room = data.get('room')
        user_id = request.args.get('user_id')

        if room and user_id and room in chat_rooms and user_id in chat_rooms[room]:
            chat_rooms[room].remove(user_id)  # Xóa user khỏi phòng chat
            leave_room(room)  # Rời khỏi phòng chat
            print(f"User {user_id} left room {room}")
            emit("room_left", {"message": f"User {user_id} left room {room}"}, room=room)
        else:
            emit("error", {"message": "Invalid room or user not in room."})


    @socketio.on('disconnect')
    def handle_disconnect():
        user_id = next((k for k, v in connected_users.items() if v == request.sid), None)
        if user_id:
            del connected_users[user_id]
            # Xoá user khỏi các phòng chat liên quan
            for chat_id, users in list(chat_rooms.items()):
                if user_id in users:
                    users.remove(user_id)
                    if not users:  # Xoá phòng nếu rỗng
                        del chat_rooms[chat_id]
            print(f"User {user_id} disconnected")    
    


# Lấy danh sách chat của user api    
@chat_blueprint.route('/list', methods=['GET'])
@token_required
def get_chat_list(payload):
    user_id = payload.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    try:
        user_chats = Chat.find({
            "participants": user_id
        })
        print("user_chats: ", user_chats)
        chat_list = []
        for chat in user_chats:
            last_message = chat.get('lastMessage', {})
            if last_message:
                timestamp = last_message.get('timestamp')
                if timestamp:
                    last_message['timestamp'] = timestamp.isoformat() if hasattr(timestamp, 'isoformat') else timestamp

            sender = chat['participants'][0] if chat['participants'][0] == user_id else chat['participants'][1]
            receiver = chat['participants'][1] if chat['participants'][0] == user_id else chat['participants'][0]
            
            user = User.find_by_id(ObjectId(receiver))
            if not user:
                return jsonify({"error": f"User with ID {receiver} not found"}), 400
            user_name = user['firstName'] + " " + user['lastName']
            chat_data = {
                "id": str(chat['_id']),
                "participants": {
                    "sender": sender,  # người tạo chat
                    "receiver": receiver  # người nhận
                }, 
                "isGroupChat": chat.get('isGroupChat', False),
                "receiverName": user_name,
                "lastMessage": {
                    "senderId": last_message.get('senderId'),
                    "content": last_message.get('content'),
                    "timestamp": last_message.get('timestamp')
                }
            }
            chat_list.append(chat_data)
            print("chat data: ", chat_data)
        
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

@chat_blueprint.route('/messages', methods=['GET'])
@token_required
def get_chat_messages(payload):
    chat_id = request.args.get('chat_id')
    print("payload", payload)
    if not chat_id:
        return jsonify({"error": "Chat ID is required"}), 400
    try:
        messages = Message.find({"chatId": chat_id})
        print("messages:", messages)

        formatted_messages = []
        for message in messages:
            formatted_message = {
                "id": str(message['_id']),
                "sender": message['sender'],    
                "recipient": message['recipient'],
                "content": message['content'],
                "timestamp": message['timestamp'].isoformat() if hasattr(message['timestamp'], 'isoformat') else message['timestamp']
            }
            formatted_messages.append(formatted_message)
        print("formatted_messages: ", formatted_messages)
        return jsonify({
            "status": "success",
            "data": {
                "messages": formatted_messages
            }
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@chat_blueprint.route('/create', methods=['POST'])
@token_required
def handle_create_chat(payload):
    data = request.get_json()
    user_id = data['senderId']
    participants = data['participants']
    content = data['content']
    is_group_chat = data['isGroupChat']

    user = User.find_by_email(participants)

    if user:
        temp = str(user['_id'])
    else:
        return jsonify({"error": f"User with email {participants} not found"}), 400

    if not user_id or not participants:
        return jsonify({"error": "User ID and participants are required"}), 400
    
    existing_chat = Chat.check_participants_exist([user_id, temp])
    print(existing_chat)
    if existing_chat:
        return jsonify({"error": "Chat already exists"}), 400

    print(f"Creating chat with participants: {participants}, is_group_chat: {is_group_chat}")
    chat_id = Chat.create_chat(temp,user_id,is_group_chat)
    print(f"Chat created with ID: {chat_id}")
    print(f"Updating last message with content: {content}, user_id: {user_id}")
    Chat.update_last_message(chat_id, content, user_id)
    print("Last message updated")

    return jsonify({
        "status": "success",
        "data": {
            "participants": temp,
            "content": content,
            "isGroupChat": is_group_chat
        }
    }), 200