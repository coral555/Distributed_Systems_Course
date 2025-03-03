Project Management API with MongoDB Integration

This project is a Node.js + Express.js API for managing software projects, using MongoDB as the database. It allows project creation, team management, and image uploads, replacing the previous file-based storage system.

Tech Stack:
   - Backend: Node.js, Express.js
   - Database: MongoDB (Mongoose for ODM)
   - Validation: Mongoose Schema Validation
   - API Architecture: RESTful

Project Structure:

📦 Ex4_project_management_mongodb
 ┣ 📂 src
 ┃ ┣ 📂 db
 ┃ ┃ ┣ 📜 mongoose.js          # MongoDB connection setup
 ┃ ┣ 📂 models
 ┃ ┃ ┣ 📜 projectSchema.js      # Mongoose schema for project
 ┃ ┃ ┣ 📜 teamMemberSchema.js   # Mongoose schema for team members
 ┃ ┣ 📂 routes
 ┃ ┃ ┣ 📜 project.js            # Routes for project management
 ┃ ┃ ┣ 📜 routes.js             # Main route configuration
 ┣ 📜 package-lock.json         # Dependency lock file
 ┣ 📜 package.json              # Project dependencies & scripts
 ┣ 📜 README.txt                # Project documentation
 ┣ 📜 server.js                 # Main Express server file

Setup & Installation:
1️⃣ Clone the repository:
    git clone https://github.com/coral555/Distributed_Systems_Course.git

2️⃣ Install dependencies:
    npm install

3️⃣ Start the server:
    npm start

By default, the server runs on PORT 3001.

Project Requirements:
✔️ Data validation using Mongoose
✔️ RESTful API principles
✔️ Error handling with appropriate HTTP responses
✔️ Organized structure for maintainability
✔️ Project should be submitted as a ZIP (without node_modules)