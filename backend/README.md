# React + Django Starter Project

This README explains how this project was created step by step.

The goal of the project is simple:

- **React** handles the frontend UI
- **Django** handles the backend API
- the frontend can later send files or form data to the backend
- the backend can later process uploaded files and return structured JSON

---

## 1. What this project is

This project is split into two parts:

```text
myapp/
├── frontend/   # React app
└── backend/    # Django app
```

### Why split it like this?

Because each side has a different job:

- **frontend** = what the user sees and clicks
- **backend** = where the server logic, API routes, and data processing live

Think of it like this:

- React = the store front desk
- Django = the office in the back

---

## 2. What was installed first

To build this project, two main tools were needed on the computer:

### A. Node.js
Used for React.

It also installs:

- `npm` = Node package manager

### B. Python
Used for Django.

It also works with:

- `pip` = Python package installer
- `venv` = Python virtual environment tool

---

## 3. How the tools were validated in the terminal

Before creating the project, the environment was checked using these commands:

```bash
node -v
npm -v
python3 --version
pip3 --version
```

### What these commands mean

- `node -v` checks if Node.js is installed
- `npm -v` checks if npm is installed
- `python3 --version` checks if Python is installed
- `pip3 --version` checks if pip is installed

If version numbers appear, the machine is ready.

---

## 4. How the project folder was created

A main project folder was created first:

```bash
mkdir myapp
cd myapp
mkdir frontend backend
```

### What this does

- `mkdir myapp` creates the main project folder
- `cd myapp` moves into that folder
- `mkdir frontend backend` creates two separate folders

---

## 5. How the React frontend was created

The React app was created with **Vite**.

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

### Step-by-step meaning

#### `npm create vite@latest frontend -- --template react`
This creates a new React app inside the `frontend` folder.

#### `cd frontend`
Moves into the React app folder.

#### `npm install`
Downloads all React project dependencies listed in `package.json`.

#### `npm run dev`
Starts the React development server.

### What success looks like

The terminal shows a local address like:

```text
http://localhost:5173
```

That means the frontend is running.

---

## 6. How the Django backend was created

After the frontend was made, the backend setup started.

### Move to the backend folder

```bash
cd ../backend
```

### Create a virtual environment

```bash
python3 -m venv .venv
```

### Why a virtual environment is used

A **virtual environment** is an isolated Python space for this specific project.

It keeps this project’s Python packages separate from other projects on the computer.

### Activate the virtual environment

#### Mac/Linux

```bash
source .venv/bin/activate
```

#### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

When activated, the terminal usually shows something like:

```text
(.venv)
```

at the beginning of the line.

---

## 7. How Django and backend packages were installed

Once the virtual environment was active, the backend dependencies were installed:

```bash
pip install django djangorestframework django-cors-headers
```

### What each package does

#### `django`
The backend framework.

It handles:

- routes
- settings
- models
- server logic

#### `djangorestframework`
Used to build APIs more easily.

This is helpful when React needs to talk to Django using JSON.

#### `django-cors-headers`
Used during development so the React app and Django app can communicate even though they run on different ports.

---

## 8. How the Django project structure was created

After installing the packages, the Django project and app were created:

```bash
django-admin startproject config .
python manage.py startapp api
```

### What these commands do

#### `django-admin startproject config .`
Creates the main Django project in the current folder.

Important files created include:

- `manage.py`
- `config/settings.py`
- `config/urls.py`

#### `python manage.py startapp api`
Creates an app called `api`.

This is where backend API code can go.

Example:

- upload endpoints
- extraction routes
- serializer logic
- model logic

---

## 9. Backend folder structure after setup

The backend should now look something like this:

```text
backend/
├── .venv/
├── api/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   └── ...
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
└── manage.py
```

---

## 10. How the backend was run

To start the Django server:

```bash
python manage.py runserver
```

### What success looks like

The backend usually opens at:

```text
http://127.0.0.1:8000/
```

If you see the Django welcome page in the browser, the backend is working.

---

## 11. How the frontend and backend work together

During development, both servers run separately:

- React frontend: `http://localhost:5173`
- Django backend: `http://127.0.0.1:8000`

### Why are there two servers?

Because React and Django are doing different jobs:

- React renders the user interface
- Django handles business logic and APIs

React can send requests like this:

```text
POST /api/uploads/
```

Django receives that request, processes it, and sends data back.

---

## 12. What still needs to be configured in Django

After creating the Django project, some setup is usually added in `config/settings.py`.

### Add apps

```python
INSTALLED_APPS = [
    # default django apps...
    "rest_framework",
    "corsheaders",
    "api",
]
```

### Add CORS middleware

`corsheaders` middleware should be added so React can talk to Django during development.

### Allow the React frontend origin

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

This tells Django:

> “Requests from the React frontend are allowed.”

---

## 13. Recommended startup flow each time you work on the project

### Terminal 1: Start Django

```bash
cd myapp/backend
source .venv/bin/activate
python manage.py runserver
```

### Terminal 2: Start React

```bash
cd myapp/frontend
npm run dev
```

Now both sides are running together.

---

## 14. Simple system flow

### Human explanation

1. User opens the React app in the browser
2. React shows the page
3. User clicks a button or uploads a file
4. React sends the request to Django
5. Django processes the request
6. Django sends JSON back
7. React displays the result

---

## 15. Text-image diagram version

```text
┌──────────────┐
│    User      │
│ opens app    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ React Frontend       │
│ localhost:5173       │
│ - buttons            │
│ - forms              │
│ - upload UI          │
└────────┬─────────────┘
         │ API request
         ▼
┌──────────────────────┐
│ Django Backend       │
│ 127.0.0.1:8000       │
│ - routes             │
│ - logic              │
│ - validation         │
│ - JSON response      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ React updates UI     │
│ with backend result  │
└──────────────────────┘
```

---

## 16. Beginner mental model

Think of this project like a restaurant.

- **React** is the waiter taking the customer request
- **Django** is the kitchen doing the real work
- the browser is the customer table

So the flow is:

- customer asks waiter
- waiter brings request to kitchen
- kitchen prepares result
- waiter brings result back

That is exactly how the frontend and backend communicate.

---

## 17. Full command summary

Here is the complete setup again in one block:

```bash
mkdir myapp
cd myapp
mkdir frontend backend

npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev

cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip install django djangorestframework django-cors-headers

django-admin startproject config .
python manage.py startapp api
python manage.py runserver
```

---

## 18. Next step after this setup

Once this base project is working, the next logical step is to connect them.

Example next task:

- create a Django API route like `/api/hello/`
- make React call that route with `fetch()`
- display the Django response in the browser

After that, file uploads and OCR/extraction can be added on top.

---

## 19. Troubleshooting

### `node: command not found`
Node.js is not installed correctly.

### `python3: command not found`
Python is not installed correctly.

### `pip: command not found`
Python or pip is missing from your environment.

### React opens but Django does not
Make sure:

- the virtual environment is activated
- Django is installed inside that environment
- you are running `python manage.py runserver` inside the backend folder

### Django works but React cannot call it
This is usually a CORS issue.

Check:

- `django-cors-headers` is installed
- `corsheaders` is in `INSTALLED_APPS`
- the middleware is added
- `http://localhost:5173` is in `CORS_ALLOWED_ORIGINS`

---

## 20. Final idea

This project was created by first building the **frontend shell**, then the **backend shell**, and keeping them separate so they can talk through APIs.

That separation makes the project easier to scale later.

Examples of future additions:

- login system
- database models
- file upload endpoint
- OCR service integration
- extracted JSON response for React

