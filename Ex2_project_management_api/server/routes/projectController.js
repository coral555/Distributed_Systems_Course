const fs = require('fs');
const path = require('path');
const axios = require('axios');

const projectFilePath = path.join(__dirname, '../data/projects.json');

// Function to read projects from JSON file
function readProjects() {
    try {
        const projectsData = fs.readFileSync(projectFilePath);
        return JSON.parse(projectsData);
    } catch (error) {
        console.error('Error reading projects:', error);
        return {};
    }
}

// Save projects to JSON file
function saveProjects(projects) {
    fs.writeFileSync(projectFilePath, JSON.stringify(projects, null, 2));
}

// Create a new project
function createProject(req, res) {
    console.log('Received request to create project:', req.body);

    const { name, summary, manager, start_date, team } = req.body;

    // Validate required fields
    if (!name || !summary || !manager || !start_date || !team || team.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate summary length
    if (summary.length < 20 || summary.length > 80) {
        return res.status(400).json({ message: 'Summary must be between 20 and 80 characters' });
    }

    // Validate manager name format
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(manager.name)) {
        return res.status(400).json({ message: 'Manager name must contain only letters' });
    }

    // Validate manager email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(manager.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate team member names format
    for (let member of team) {
        if (!nameRegex.test(member.name)) {
            return res.status(400).json({ message: `Team member name ${member.name} must contain only letters` });
        }
    }

    // Convert start_date to timestamp
    const startDateTimestamp = new Date(start_date).getTime();

    // Function to generate a unique 13-character alphanumeric project ID
    function generateProjectId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let projectId = '';
        for (let i = 0; i < 13; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            projectId += chars[randomIndex];
        }
        return projectId;
    }

    const projectId = generateProjectId();
    
    const newProject = {
        id: projectId,
        name,
        summary,
        manager,
        start_date: startDateTimestamp, // use the timestamp
        team,
        images: []
    };

    // Read existing projects
    const projects = readProjects();

    // Add new project to projects object
    projects[projectId] = newProject;

    // Save updated projects object
    saveProjects(projects);

    // Respond with success message or data
    res.status(201).json({ message: 'Project added successfully', id: projectId });
}

// Update an existing project
function updateProject(req, res) {
    const projects = readProjects();
    const projectId = req.params.id;
    if (!projects[projectId]) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const { name, summary, start_date, newTeam } = req.body;
    if (name) projects[projectId].name = name;
    if (summary) {
        if (summary.length < 20 || summary.length > 80) {
            return res.status(400).json({ message: 'Summary must be between 20 and 80 characters' });
        }
        projects[projectId].summary = summary;
    }
    if (start_date) projects[projectId].start_date = new Date(start_date).getTime();
    if (newTeam && newTeam.length > 0) {
        newTeam.forEach(member => {
            projects[projectId].team.push(member);
        });
    }

    saveProjects(projects);
    res.status(200).json({ message: 'Project updated successfully', project: projects[projectId] });
}

// Add an image to a project
function addImagesToProject(req, res) {
    const projects = readProjects();
    const projectId = req.params.id;
    if (!projects[projectId]) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const { id, thumb, description } = req.body;
    if (!id || !thumb || !description) {
        return res.status(400).json({ message: 'Missing image details' });
    }

    const image = req.body;
    if (!projects[projectId].images) {
        projects[projectId].images = [];
    }

    projects[projectId].images.push(image);
    saveProjects(projects);
    res.status(201).json({ message: 'Image added successfully', image });
}

// Get a project by ID
function getProject(req, res) {
    const projects = readProjects();
    const projectId = req.params.id;
    if (!projects[projectId]) {
        return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(projects[projectId]);
}

// Get all projects
function getProjects(req, res) {
    const projects = readProjects();
    res.status(200).json(projects);
}

// Delete an image from a project
function deleteImageFromProject(req, res) {
    const projects = readProjects();
    const projectId = req.params.id;
    const imageId = req.params.imageId;
    if (!projects[projectId]) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const updatedImages = projects[projectId].images.filter(image => image.id !== imageId);
    if (updatedImages.length === projects[projectId].images.length) {
        return res.status(404).json({ message: 'Image not found' });
    }

    projects[projectId].images = updatedImages;
    saveProjects(projects);
    res.status(200).json({ message: 'Image deleted successfully' });
}

// Delete a project by ID
function deleteProject(req, res) {
    const projects = readProjects();
    const projectId = req.params.id;
    if (!projects[projectId]) {
        return res.status(404).json({ message: 'Project not found' });
    }

    delete projects[projectId];
    saveProjects(projects);
    res.status(204).end();
}

// Search Unsplash images
async function searchUnsplashImages(req, res) {
    const { query, page } = req.query;
    const accessKey = '0UA1NAW5TqzN8y_OGQyISxb24mOS96d-k-g2gUlPix8'; // Replace with your actual Unsplash Access Key

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query,
                per_page: 10,
                page
            },
            headers: {
                Authorization: `Client-ID ${accessKey}`
            }
        });

        res.status(200).json(response.data.results);
    } catch (error) {
        console.error('Error searching images:', error);
        res.status(500).json({ error: 'Error searching images' });
    }
}

// Add a team member to a project
function addTeamMember(req, res) {
    const projects = readProjects();
    const projectId = req.params.id;
    if (!projects[projectId]) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const { name, email, role } = req.body;
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name || !email || !role) {
        return res.status(400).json({ message: 'Missing team member details' });
    }
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: 'Team member name must contain only letters' });
    }

    projects[projectId].team.push({ name, email, role });
    saveProjects(projects);
    res.status(201).json({ message: 'Team member added successfully', team: projects[projectId].team });
}

// Remove a team member from a project
function removeTeamMember(req, res) {
    const projects = readProjects();
    const projectId = req.params.id;
    if (!projects[projectId]) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const teamMemberEmail = req.params.email;
    const updatedTeam = projects[projectId].team.filter(member => member.email !== teamMemberEmail);
    if (updatedTeam.length === projects[projectId].team.length) {
        return res.status(404).json({ message: 'Team member not found' });
    }

    projects[projectId].team = updatedTeam;
    saveProjects(projects);
    res.status(200).json({ message: 'Team member removed successfully' });
}

module.exports = {
    createProject,
    updateProject,
    addImagesToProject,
    getProject,
    getProjects,
    deleteImageFromProject,
    deleteProject,
    searchUnsplashImages,
    addTeamMember,
    removeTeamMember
};
