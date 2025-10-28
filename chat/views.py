from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Contact, Chat, Message
from .serializers import ContactSerializer, ChatSerializer, MessageSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_contacts(request):
    user = request.user.username
    contacts = Contact.objects.filter(owner=user)
    serializer = ContactSerializer(contacts, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_contact(request):
    user = request.user.username
    data = request.data
    if Contact.objects.filter(phone=data["phone"], owner=user).exists():
        return Response({"error": "Contact already exists"}, status=400)
    contact = Contact.objects.create(owner=user, **data)
    return Response({"success": True, "id": contact.id})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_chats(request):
    user = request.user.username
    chats = Chat.objects.filter(participants__icontains=user).order_by("-timestamp")
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_chat(request):
    data = request.data
    participants = data.get("participants")
    if isinstance(participants, list):
        normalized = ",".join(sorted(participants))
    else:
        normalized = ",".join(sorted(str(participants).split(",")))
    chat, created = Chat.objects.get_or_create(participants=normalized, defaults=data)
    return Response({"success": True, "chat_id": chat.id})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, sender, receiver):
    msgs = Message.objects.filter(
        Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)
    ).order_by("timestamp")
    serializer = MessageSerializer(msgs, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request):
    msg = Message.objects.create(**request.data)
    serializer = MessageSerializer(msg)
    return Response({"success": True, "message": serializer.data})
