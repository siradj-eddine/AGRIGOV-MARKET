from django.urls import path
from .views import (
    ConversationListView,
    ConversationDetailView,
    SendMessageView,
    UnreadCountView,
)

urlpatterns = [
    path('', ConversationListView.as_view(), name='conversation-list'),
    path('<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('<int:conversation_id>/send/', SendMessageView.as_view(), name='send-message'),
    path('unread/', UnreadCountView.as_view(), name='unread-count'),
]