from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# =====================================================================
# USER MODEL (📞 Phone number is the primary identifier)
# =====================================================================
class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    phone_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, index=True)
    city = db.Column(db.String(120))
    password_hash = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    # Relationships
    chats = db.relationship('ChatParticipant', back_populates='user', cascade="all, delete-orphan")
    contacts = db.relationship('Contact', back_populates='owner', cascade="all, delete-orphan")

    # Public data (for sharing with other users)
    def to_public(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "email": self.email,
            "city": self.city,
        }

    def __repr__(self):
        fullname = f"{self.first_name or ''} {self.last_name or ''}".strip()
        return f"<User {fullname or self.phone_number}>"

# =====================================================================
# CONTACT MODEL (📞 Unique per user by phone)
# =====================================================================
class Contact(db.Model):
    __tablename__ = 'contact'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    phone = db.Column(db.String(20), nullable=False, index=True)
    avatar = db.Column(db.String(255), default="https://via.placeholder.com/100")
    status = db.Column(db.String(120), default="Hey there! I’m using SuperApp")
    is_online = db.Column(db.Boolean, default=False)
    last_seen = db.Column(db.String(50), default="Just now")

    # Link to owning user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"))
    owner = db.relationship('User', back_populates='contacts')

    # ✅ Unique constraint: one phone per user
    __table_args__ = (
        db.UniqueConstraint('user_id', 'phone', name='contact_unique_user_phone'),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name or self.phone,  # fallback to phone
            "phone": self.phone,
            "avatar": self.avatar,
            "status": self.status,
            "isOnline": self.is_online,
            "lastSeen": self.last_seen,
        }

    def __repr__(self):
        return f"<Contact {self.name or self.phone}>"

# =====================================================================
# CHAT MODEL
# =====================================================================
class Chat(db.Model):
    __tablename__ = 'chat'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    avatar = db.Column(db.String(255), default="https://via.placeholder.com/100")
    type = db.Column(db.String(20), default="personal")  # personal, group, broadcast
    last_message = db.Column(db.String(500))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    unread_count = db.Column(db.Integer, default=0)

    # Relationships
    messages = db.relationship('Message', backref='chat', lazy=True, cascade="all, delete-orphan")
    participants = db.relationship('ChatParticipant', back_populates='chat', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "avatar": self.avatar,
            "type": self.type,
            "lastMessage": self.last_message,
            "timestamp": self.timestamp.isoformat() + "Z" if self.timestamp else None,
            "unreadCount": self.unread_count,
            "participants": [p.user.to_public() for p in self.participants] if self.participants else [],
        }

    def __repr__(self):
        return f"<Chat {self.name or self.id} ({self.type})>"

# =====================================================================
# CHAT PARTICIPANT MODEL
# =====================================================================
class ChatParticipant(db.Model):
    __tablename__ = 'chat_participant'

    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id', ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"))
    joined_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    chat = db.relationship('Chat', back_populates='participants')
    user = db.relationship('User', back_populates='chats')

    def to_dict(self):
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "user": self.user.to_public() if self.user else None,
            "joined_at": self.joined_at.isoformat() + "Z" if self.joined_at else None,
        }

    def __repr__(self):
        return f"<ChatParticipant chat={self.chat_id}, user={self.user_id}>"

# =====================================================================
# MESSAGE MODEL (📞 Sender & Receiver are phone numbers)
# =====================================================================
class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id', ondelete="CASCADE"))
    sender = db.Column(db.String(20), nullable=False, index=True)     # phone number
    receiver = db.Column(db.String(20), nullable=False, index=True)   # phone number
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    status = db.Column(db.String(20), default="sent")  # sent, delivered, seen

    def to_dict(self):
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "sender": self.sender,
            "receiver": self.receiver,
            "content": self.content,
            "timestamp": self.timestamp.isoformat() + "Z" if self.timestamp else None,
            "status": self.status,
        }

    def __repr__(self):
        return f"<Message {self.sender} → {self.receiver} | {self.content[:20]}...>"
