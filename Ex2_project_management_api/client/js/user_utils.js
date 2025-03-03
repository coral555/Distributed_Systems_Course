// Function to add a new project
function addProject(projectData, callback) {
    $.ajax({
        url: 'http://localhost:3001/projects',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(projectData),
        success: function(response) {
            callback(null, response);
        },
        error: function(xhr) {
            console.error('Error adding project:', xhr.responseText || 'Unknown error');
            callback(xhr.responseText || 'Error adding project');
        }
    });
}

// Function to update an existing project
function updateProject(projectId, projectData, callback) {
    $.ajax({
        url: `http://localhost:3001/projects/${projectId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(projectData),
        success: function(response) {
            callback(null, response);
        },
        error: function(xhr) {
            callback(xhr.responseText || 'Error updating project');
        }
    });
}

// Function to delete a project
function deleteProject(projectId, callback) {
    $.ajax({
        url: `http://localhost:3001/projects/${projectId}`,
        method: 'DELETE',
        success: function() {
            callback(null);
        },
        error: function() {
            callback('Error deleting project');
        }
    });
}

// Function to search images
function searchImages(query, page, callback) {
    $.ajax({
        url: `http://localhost:3001/projects/images/search`,
        method: 'GET',
        data: { query, page },
        success: function(data) {
            callback(null, data);
        },
        error: function(xhr) {
            callback(xhr.responseText || 'Error searching images');
        }
    });
}

// Function to add an image to a project
function addImagesToProject(projectId, imageData, callback) {
    $.ajax({
        url: `http://localhost:3001/projects/${projectId}/images`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(imageData),
        success: function(response) {
            callback(null, response);
        },
        error: function(xhr) {
            callback(xhr.responseText || 'Error adding image');
        }
    });
}

// Function to delete an image from a project
function deleteImageFromProject(projectId, imageId, callback) {
    $.ajax({
        url: `http://localhost:3001/projects/${projectId}/images/${imageId}`,
        method: 'DELETE',
        success: function() {
            callback(null);
        },
        error: function() {
            callback('Error deleting image');
        }
    });
}

// Function to fetch all projects
function fetchProjects(callback) {
    $.ajax({
        url: 'http://localhost:3001/projects',
        method: 'GET',
        success: function(data) {
            callback(null, data);
        },
        error: function() {
            callback('Error fetching projects');
        }
    });
}

// Function to fetch a specific project by ID
function fetchProjectById(projectId, callback) {
    $.ajax({
        url: `http://localhost:3001/projects/${projectId}`,
        method: 'GET',
        success: function(data) {
            callback(null, data);
        },
        error: function() {
            callback('Error fetching project details');
        }
    });
}
