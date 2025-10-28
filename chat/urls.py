from django.urls import path
from . import views

urlpatterns = [
    path("contacts/", views.get_contacts),
    path("contacts/add/", views.add_contact),
    path("chats/", views.get_chats),
    path("chat/create/", views.create_chat),
    path("messages/<str:sender>/<str:receiver>/", views.get_messages),
    path("messages/send/", views.send_message),
]
