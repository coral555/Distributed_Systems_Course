// Import the Express module
const express = require('express');

// Import the body-parser module, parses incoming request bodies in a middleware
const bodyParser = require('body-parser');

// Import the cors module
const cors = require('cors');

// Import the routes from the routes module
const routes = require('./server/routes/routes');

// Create an instance of an Express application
const app = express();

// Use the CORS middleware to allow cross-origin requests
app.use(cors());

// Use the body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// any request to '/projects' will be handled by the routes module
app.use('/projects', routes);

// Define the port the server will listen on.
const PORT = process.env.PORT || 3001;

// Start the server and have it listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
