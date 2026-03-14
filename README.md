# Version 1 Task — React + Django OCR Upload Starter

## Goal
Build **Version 1** of the backend OCR pipeline.

This version does **not** do real OCR yet.
It only proves that:

1. React or Postman can send a **POST** request to Django
2. Django can receive an uploaded file at **`/api/ocr/`**
3. Django can return JSON confirming the file was received

---

## Simple Mental Model
Think of this as a mail room:

- **Frontend / Postman** = person sending a package
- **POST request** = the delivery action
- **`/api/ocr/`** = the mail desk
- **`request.FILES`** = the tray where uploaded files arrive
- **JSON response** = the receipt slip that says “package received”

Version 1 is only:

**send file → receive file → return file info**

---

# Project Structure

```text
backend/
├── .venv/
├── api/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── db.sqlite3
```

## Important files for Version 1

- **`config/settings.py`** → project settings
- **`config/urls.py`** → main URL map
- **`api/urls.py`** → routes for the API app
- **`api/views.py`** → request handling logic

---

# Version 1 Task Checklist

## Step 1 — Install backend packages
Activate your Django virtual environment first.

```bash
cd backend
source .venv/bin/activate
pip install djangorestframework django-cors-headers
```

### Optional OCR packages for later
These are **not required** just to test upload, but you will need them for real OCR.

```bash
pip install pytesseract pillow
```

---

## Step 2 — Install Tesseract on your Mac
Install this on your **Mac system**, not inside the project folder.

```bash
brew install tesseract
```

Check that it installed:

```bash
tesseract --version
```

---

## Step 3 — Update `config/settings.py`
Add the apps and CORS config so React can talk to Django.

```python
# backend/config/settings.py

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party apps
    "corsheaders",        # Lets browser requests from React reach Django
    "rest_framework",     # Gives us APIView and JSON responses

    # Your app
    "api",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # Put this near the top
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Allow your React dev server to call Django during local development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

---

## Step 4 — Connect the `api` app in `config/urls.py`
This tells Django that anything starting with `/api/` should be handled by the `api` app.

```python
# backend/config/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Send all /api/... requests into api/urls.py
    path("api/", include("api.urls")),
]
```

---

## Step 5 — Create the OCR route in `api/urls.py`
This creates the app-level route for `/ocr/`.
When combined with `/api/` from the main URL file, the full endpoint becomes:

```text
/api/ocr/
```

```python
# backend/api/urls.py

from django.urls import path
from .views import OCRView, HelloView

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("ocr/", OCRView.as_view(), name="ocr"),
]
```

---

## Step 6 — Create the backend view in `api/views.py`
This is the main file for Version 1.
It accepts a file upload and returns file information.

```python
# backend/api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.permissions import AllowAny


class HelloView(APIView):
    # Simple test endpoint: GET /api/hello/
    def get(self, request):
        return Response({"message": "Hello from Django"})


class OCRView(APIView):
    # IMPORTANT:
    # These must be class attributes, not inside post().
    # This makes the endpoint open for testing.
    authentication_classes = []
    permission_classes = [AllowAny]

    # These parsers let DRF understand file uploads sent as form-data.
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        # Helpful message if you open /api/ocr/ in the browser.
        return Response({"message": "Use POST and send a file with key name 'file'."})

    def post(self, request):
        """
        This runs when the client sends:
        POST /api/ocr/
        with multipart/form-data
        """

        # Look for the uploaded file under the key name "file"
        uploaded_file = request.FILES.get("file")

        # If no file was sent, return a 400 error
        if not uploaded_file:
            return Response(
                {"error": "No file was uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Return basic file info to prove the upload worked
        return Response(
            {
                "message": "POST request worked",
                "filename": uploaded_file.name,
                "size": uploaded_file.size,
                "content_type": uploaded_file.content_type,
            },
            status=status.HTTP_200_OK,
        )
```

---

## Step 7 — Run the backend

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

Django should run at:

```text
http://127.0.0.1:8000/
```

---

## Step 8 — Test the route in the browser
This tests only the **GET** helper message.

Open:

```text
http://127.0.0.1:8000/api/ocr/
```

Expected response:

```json
{
  "message": "Use POST and send a file with key name 'file'."
}
```

---

## Step 9 — Test the POST request in Postman
Use these exact settings:

### Request
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/ocr/`

### Body
- choose **form-data**
- add a key named:

```text
file
```

- change the key type from **Text** to **File**
- choose an image file from your computer

### Expected response

```json
{
  "message": "POST request worked",
  "filename": "receipt.png",
  "size": 153244,
  "content_type": "image/png"
}
```

---

## Step 10 — Test with curl instead of Postman (optional)

```bash
curl -X POST http://127.0.0.1:8000/api/ocr/ \
  -F "file=@/full/path/to/your/image.png"
```

---

# Why 403 happened earlier
The common mistake was putting these lines **inside** `post()`:

```python
authentication_classes = []
permission_classes = [AllowAny]
```

That does **not** work because DRF checks permissions **before** entering `post()`.

They must be placed at the **class level** like this:

```python
class OCRView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
```

---

# What Version 1 does
Version 1 can:

- accept a POST request
- receive an uploaded file
- return file details as JSON

Version 1 does **not** yet:

- run OCR
- save files to the database
- extract totals / dates / invoice numbers
- support PDFs or background jobs

---

# What Version 2 will do
After Version 1 works, the next step is:

1. install `pytesseract` and `pillow`
2. create `api/services.py`
3. open the uploaded image with Pillow
4. pass the image to Tesseract
5. return extracted text

Example future code:

```python
from PIL import Image
import pytesseract


def extract_text_from_image(uploaded_file):
    image = Image.open(uploaded_file)
    text = pytesseract.image_to_string(image)
    return text.strip()
```

Then inside `post()`:

```python
text = extract_text_from_image(uploaded_file)
return Response({"text": text})
```

---

# Debug Checklist
If the endpoint does not work, check these in order:

## 1. URL mapping
- Does `config/urls.py` include `path("api/", include("api.urls"))`?
- Does `api/urls.py` include `path("ocr/", OCRView.as_view(), name="ocr")`?

## 2. View class settings
- Are `authentication_classes = []` and `permission_classes = [AllowAny]` at the **class level**?
- Not inside `post()`?

## 3. Postman body
- Is **form-data** selected?
- Is the key named exactly **`file`**?
- Is the key type set to **File**?

## 4. Server restart
After changing code, restart Django:


