#A
from django.urls import path
from .views import HelloView
from .views import BruhView
from .views import OCR_view

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("bruh/", BruhView.as_view(), name="bruh"),
    path("ocr/", OCR_view.as_view(), name="ocr")

]