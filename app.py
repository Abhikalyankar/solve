import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity,
    create_access_token as flask_create_access_token,
)
from sqlalchemy import or_, text
from dotenv import load_dotenv
from models import db, Chat, Message, Contact, User, ChatParticipant
from jwt import ExpiredSignatureError
from flask_jwt_extended.exceptions import NoAuthorizationError, JWTDecodeError
from jose import jwt as jose_jwt, ExpiredSignatureError as JoseExpiredSignatureError

# =============================================================================
# ENVIRONMENT VARIABLES
# =============================================================================
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

print("\n==================== 🔐 ENVIRONMENT DEBUG ====================")
print("SECRET_KEY:", os.getenv("SECRET_KEY"))
print("JWT_SECRET_KEY:", os.getenv("JWT_SECRET_KEY"))
print("DATABASE:", os.getenv("SQLALCHEMY_DATABASE_URI"))
print("=============================================================\n")

# =============================================================================
# FLASK INITIALIZATION
# =============================================================================
app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "super_secret_key_12345")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super_jwt_secret_key_12345")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "SQLALCHEMY_DATABASE_URI",
    "postgresql+psycopg2://postgres:postgres@localhost:5432/superapp_db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 👇 This line makes Flask read the `user_id` claim from your FastAPI JWT
app.config["JWT_IDENTITY_CLAIM"] = "user_id"

db.init_app(app)
CORS(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# =============================================================================
# DATABASE CONNECTION TEST
# =============================================================================
with app.app_context():
    try:
        db.session.execute(text("SELECT 1"))
        print("✅ Database connection successful")
        db.create_all()
        print("✅ Tables created or already exist")
    except Exception as e:
        print("❌ Database connection failed:", e)

# =============================================================================
# JWT ERROR HANDLERS
# =============================================================================
@app.errorhandler(NoAuthorizationError)
def handle_no_auth(e):
    print("❌ Missing Authorization header:", e)
    return jsonify({"error": "Missing or malformed JWT header"}), 401


@app.errorhandler(JWTDecodeError)
def handle_jwt_decode_error(e):
    print("❌ Invalid JWT decode:", e)
    return jsonify({"error": "Invalid or expired JWT"}), 401


@app.errorhandler(ExpiredSignatureError)
def handle_expired_token(e):
    print("❌ JWT expired:", e)
    return jsonify({"error": "Token expired"}), 401


# =============================================================================
# CONTACTS (PHONE IS PRIMARY)
# =============================================================================
@app.route("/api/contacts", methods=["GET"])
@jwt_required()
def get_contacts():
    """Return contacts owned by the logged-in user."""
    try:
        user_id = get_jwt_identity()
        contacts = Contact.query.filter_by(user_id=user_id).all()
        return jsonify([c.to_dict() for c in contacts])
    except Exception as e:
        print("❌ Error fetching contacts:", e)
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/contacts/add", methods=["POST"])
@jwt_required()
def add_contact():
    """Add a new contact (phone number is the primary identifier)."""
    print("\n🟢 /api/contacts/add called")
    try:
        user_id = get_jwt_identity()
        data = request.get_json(force=True)
        phone = data.get("phone") or data.get("phone_number")
        name = data.get("name", phone)
        avatar = data.get("avatar", "https://via.placeholder.com/100")
        status = data.get("status", "Hey there! I’m using SuperApp")

        if not phone:
            return jsonify({"error": "'phone' is required"}), 400

        existing = Contact.query.filter_by(phone=phone, user_id=user_id).first()
        if existing:
            return jsonify({"error": "Contact already exists"}), 409

        new_contact = Contact(
            name=name.strip(),
            phone=phone.strip(),
            avatar=avatar,
            status=status,
            is_online=False,
            last_seen="Just now",
            user_id=user_id,
        )
        db.session.add(new_contact)
        db.session.commit()

        print(f"✅ Contact added: {new_contact.phone}")
        return jsonify({"success": True, "contact": new_contact.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        print("❌ Database error while adding contact:", e)
        return jsonify({"success": False, "error": str(e)}), 500


# =============================================================================
# CHATS (PHONE-BASED)
# =============================================================================
@app.route("/api/chats", methods=["GET"])
@jwt_required()
def get_chats():
    """Return chats belonging to the logged-in user."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        chats = Chat.query.join(ChatParticipant).filter(
            ChatParticipant.user_id == user.id
        ).order_by(Chat.timestamp.desc()).all()

        return jsonify([c.to_dict() for c in chats])
    except Exception as e:
        print("❌ Error fetching chats:", e)
        return jsonify({"success": False, "error": str(e)}), 500


# =============================================================================
# MESSAGES (BY PHONE NUMBER)
# =============================================================================
@app.route("/api/messages/<string:phone1>/<string:phone2>", methods=["GET"])
@jwt_required()
def get_messages(phone1, phone2):
    """Return all messages between two phone numbers."""
    try:
        messages = Message.query.filter(
            or_(
                (Message.sender == phone1) & (Message.receiver == phone2),
                (Message.sender == phone2) & (Message.receiver == phone1),
            )
        ).order_by(Message.timestamp).all()
        return jsonify([m.to_dict() for m in messages])
    except Exception as e:
        print("❌ Error fetching messages:", e)
        return jsonify({"success": False, "error": str(e)}), 500


# =============================================================================
# CREATE CHAT (BY PHONE NUMBER)
# =============================================================================
@app.route("/api/chat/create", methods=["POST"])
@jwt_required()
def create_chat():
    """Create a new chat using phone numbers instead of names."""
    print("\n🟢 /api/chat/create called")
    try:
        data = request.get_json(force=True)
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        if not current_user:
            return jsonify({"error": "User not found"}), 404

        participants = data.get("participants", [])
        if not participants:
            return jsonify({"error": "At least one participant phone number is required"}), 400

        chat_name = data.get("name", ", ".join(participants))
        new_chat = Chat(
            name=chat_name.strip(),
            avatar=data.get("avatar", "https://via.placeholder.com/100"),
            type=data.get("type", "personal"),
            last_message=data.get("lastMessage", ""),
            timestamp=datetime.utcnow(),
        )
        db.session.add(new_chat)
        db.session.commit()

        db.session.add(ChatParticipant(chat_id=new_chat.id, user_id=user_id))
        for pphone in participants:
            participant_user = User.query.filter_by(phone_number=pphone).first()
            if participant_user:
                db.session.add(ChatParticipant(chat_id=new_chat.id, user_id=participant_user.id))

        db.session.commit()
        print(f"✅ Chat created: {new_chat.name}")
        return jsonify({"success": True, "chat_id": new_chat.id, "chat": new_chat.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        print("❌ Database error while creating chat:", e)
        return jsonify({"success": False, "error": str(e)}), 500


# =============================================================================
# SEND MESSAGE (USED BY FRONTEND)
# =============================================================================
@app.route("/api/messages/send", methods=["POST"])
@jwt_required()
def send_message():
    """Save and broadcast a message."""
    try:
        data = request.get_json(force=True)
        chat_id = data.get("chat_id")
        sender = data.get("sender")
        receiver = data.get("receiver")
        content = (data.get("content") or "").strip()

        if not all([chat_id, sender, receiver, content]):
            return jsonify({"error": "chat_id, sender, receiver, and content required"}), 400

        chat = Chat.query.get(chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        msg = Message(
            chat_id=chat_id,
            sender=sender,
            receiver=receiver,
            content=content,
            timestamp=datetime.utcnow(),
            status="sent",
        )
        db.session.add(msg)
        chat.last_message = content
        chat.timestamp = datetime.utcnow()
        db.session.commit()

        msg_dict = msg.to_dict()
        socketio.emit("new_message", msg_dict, room=str(chat_id))
        return jsonify({"success": True, "message": msg_dict}), 201
    except Exception as e:
        db.session.rollback()
        print("❌ Error sending message:", e)
        return jsonify({"success": False, "error": str(e)}), 500


# =============================================================================
# TOKEN REFRESH ENDPOINT
# =============================================================================
@app.route("/api/token/refresh", methods=["POST"])
def refresh_token():
    """Refresh access token using refresh token issued by FastAPI."""
    try:
        data = request.get_json(force=True)
        refresh_token = data.get("refresh_token")
        if not refresh_token:
            return jsonify({"error": "Missing refresh token"}), 400

        secret = app.config["JWT_SECRET_KEY"]
        payload = jose_jwt.decode(refresh_token, secret, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id or payload.get("type") != "refresh":
            return jsonify({"error": "Invalid refresh token"}), 401

        new_token = flask_create_access_token(identity=user_id)
        return jsonify({"access": new_token})
    except JoseExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 401
    except Exception as e:
        print("❌ Refresh error:", e)
        return jsonify({"error": "Invalid refresh token"}), 401


# =============================================================================
# SOCKET.IO EVENTS
# =============================================================================
@socketio.on("join")
def handle_join(data):
    room = str(data.get("chat_id"))
    join_room(room)
    print(f"🟢 Client joined room {room}")


@socketio.on("leave")
def handle_leave(data):
    room = str(data.get("chat_id"))
    leave_room(room)
    print(f"🔵 Client left room {room}")


@socketio.on("send_message")
def handle_socket_send_message(data):
    """Broadcast incoming socket messages."""
    room = str(data.get("chat_id"))
    print(f"📨 Re-broadcasting message in room {room}")
    emit("new_message", data, room=room, include_self=False)


# =============================================================================
# HEALTH CHECK
# =============================================================================
@app.route("/")
def health():
    return jsonify({
        "status": "✅ Flask Chat Backend Running",
        "Database": app.config["SQLALCHEMY_DATABASE_URI"],
        "Identifier": "📞 Using phone numbers as primary identity"
    })


# =============================================================================
# MAIN ENTRY
# =============================================================================
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=8001, debug=True)
