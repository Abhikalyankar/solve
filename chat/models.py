from django.db import models

class Contact(models.Model):
    owner = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    avatar = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=255, default="Hey there! I’m using SuperApp")
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Chat(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    type = models.CharField(max_length=20, default="personal")
    participants = models.TextField()  # comma-separated list
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat {self.id}"


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.CharField(max_length=50)
    receiver = models.CharField(max_length=50)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="sent")

    def __str__(self):
        return f"{self.sender} → {self.receiver}"
