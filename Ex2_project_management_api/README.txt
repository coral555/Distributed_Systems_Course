Project Management API

This repository contains a Project Management API that enables users to perform CRUD (Create, Read, Update, Delete) operations on project data using a RESTful API. It is built using Node.js and Express.js and stores project details in a JSON file.

Features:
✅ RESTful API for managing projects
✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Simple JSON-based data storage
✅ Modular structure for routes and controllers
✅ Lightweight and easy to set up

Installation & Setup:
1️⃣ Clone the Repository
    git clone https://github.com/coral555/Distributed_Systems_Course.git
    cd Distributed_Systems_Course

2️⃣ Install Dependencies
    npm install

3️⃣ Run the API Server
    node server.js

The API should now be running on http://localhost:3000.


API Endpoints

The following endpoints allow for project management:
📌 Retrieve All Projects
    GET /projects

    Response:

    [
        {
            "id": 1,
            "name": "Project Alpha",
            "description": "AI-powered task management system"
        }
    ]

📌 Create a New Project
    POST /projects

    Request Body:
    {
        "name": "New Project",
        "description": "Description of the new project"
    }

    Response:
    {
        "id": 2,
        "name": "New Project",
        "description": "Description of the new project"
    }

📌 Update an Existing Project
    PUT /projects/:id

    Request Body:
    {
        "name": "Updated Project",
        "description": "Updated description"
    }

📌 Delete a Project
    DELETE /projects/:id


Frontend Components:
This project includes basic HTML templates for user interaction:
    index.html - Displays the list of projects
    form.html - Allows users to add a new project
    edit.html - Enables project updates