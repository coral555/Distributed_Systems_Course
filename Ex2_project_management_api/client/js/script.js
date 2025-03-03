$(document).ready(function() {
    let projects = [];
    const projectsTable = $('#projectsTable tbody');

    function renderProjects() {
        projectsTable.empty(); // Clear table
        projects.forEach(project => { // Iterate over the projects array and append each project as a row in the table
            const projectRow = `
                <tr>
                    <td>${project.id}</td>
                    <td>${project.name}</td>
                    <td>${project.manager.name}</td>
                    <td>${new Date(project.start_date).toLocaleDateString()}</td>
                    <td>${project.summary}</td>
                    <td>
                        <button class="editBtn" data-id="${project.id}">Edit</button>
                        <button class="addImageBtn" data-id="${project.id}">Add Image</button>
                        <button class="viewImagesBtn" data-id="${project.id}">View Images</button>
                        <button class="deleteBtn" data-id="${project.id}">Delete</button>
                    </td>
                </tr>
            `;
            projectsTable.append(projectRow);
        });
    }

    // Function to sort projects based on the selected option
    function sortProjects(sortOption) {
        projects.sort((a, b) => {
            if (sortOption === 'name_asc') {
                return a.name.localeCompare(b.name);
            } else if (sortOption === 'name_desc') {
                return b.name.localeCompare(a.name);
            } else if (sortOption === 'manager_asc') {
                return a.manager.name.localeCompare(b.manager.name);
            } else if (sortOption === 'manager_desc') {
                return b.manager.name.localeCompare(a.manager.name);
            } else if (sortOption === 'start_date_asc') {
                return new Date(a.start_date) - new Date(b.start_date);
            } else if (sortOption === 'start_date_desc') {
                return new Date(b.start_date) - new Date(a.start_date);
            }
        });
        renderProjects();
    }

    // Fetch projects from the server and render them
    fetchProjects(function(err, fetchedProjects) {
        if (err) {
            console.error('Error fetching projects:', err);
        } else {
            projects = Object.values(fetchedProjects);
            sortProjects('start_date_desc'); // Default sort by start date descending
        }
    });

    // Event listener for sorting projects
    $('#filterSelect').on('change', function() {
        const sortOption = $(this).val();
        sortProjects(sortOption);
    });

    // Event delegation for edit button
    $(document).on('click', '.editBtn', function() {
        const projectId = $(this).data('id');
        // Redirect to the edit form with projectId
        window.location.href = `edit.html?projectId=${projectId}`;
    });

    // Event delegation for add image button
    $(document).on('click', '.addImageBtn', function() {
        const projectId = $(this).data('id');
        $('#imageSearchModal').data('projectId', projectId).show();
    });

    // Event delegation for view images button
    $(document).on('click', '.viewImagesBtn', function() {
        const projectId = $(this).data('id');
        fetchProjectById(projectId, function(err, project) {
            if (err) {
                console.error('Error fetching project:', err);
            } else {
                displayProjectImages(project);
            }
        });
        $('#viewImagesModal').show();
    });

    // Event delegation for delete button
    $(document).on('click', '.deleteBtn', function() {
        const projectId = $(this).data('id');
        if (confirm('Are you sure you want to delete this project?')) {
            deleteProject(projectId, function(err) {
                if (err) {
                    alert('Error deleting project');
                } else {
                    alert('Project deleted successfully');
                    location.reload(); // Refresh the page to update the list
                }
            });
        }
    });

    // Close the modal when the close button is clicked
    $('#closeImageSearch').on('click', function() {
        $('#imageSearchModal').hide();
    });

    $('#closeViewImages').on('click', function() {
        $('#viewImagesModal').hide();
    });

    // Perform search when the search button is clicked
    $('#searchImageButton').on('click', function() {
        const query = $('#imageSearchInput').val();
        const projectId = $('#imageSearchModal').data('projectId');
        searchImages(query, 1, function(err, images) {
            if (err) {
                console.error('Error searching images:', err);
            } else {
                displaySearchResults(images, projectId);
            }
        });
    });

    // Display search results
    function displaySearchResults(images, projectId) {
        const resultsContainer = $('#imageSearchResults');
        resultsContainer.empty();
        images.forEach(image => {
            const imageElement = `
                <div class="imageResult">
                    <img src="${image.urls.thumb}" alt="${image.alt_description}">
                    <button class="selectImageBtn" data-id="${image.id}" data-thumb="${image.urls.thumb}" data-description="${image.alt_description}">Select</button>
                </div>
            `;
            resultsContainer.append(imageElement);
        });

        // Event delegation for select image button
        $(document).on('click', '.selectImageBtn', function() {
            const imageData = {
                id: $(this).data('id'),
                thumb: $(this).data('thumb'),
                description: $(this).data('description')
            };
            addImagesToProject(projectId, imageData, function(err) {
                if (err) {
                    console.error('Error adding image:', err);
                } else {
                    alert('Image added successfully');
                    $('#imageSearchModal').hide();
                }
            });
        });
    }

    // Display project images
    function displayProjectImages(project) {
        const resultsContainer = $('#viewImagesResults');
        resultsContainer.empty();
        project.images.forEach(image => {
            const imageElement = `
                <div class="imageResult">
                    <img src="${image.thumb}" alt="${image.description}">
                    <p>${image.description}</p>
                    <button class="deleteImageBtn" data-project-id="${project.id}" data-image-id="${image.id}">Delete</button>
                </div>
            `;
            resultsContainer.append(imageElement);
        });

        // Event delegation for delete image button
        $(document).on('click', '.deleteImageBtn', function() {
            const projectId = $(this).data('project-id');
            const imageId = $(this).data('image-id');
            deleteImageFromProject(projectId, imageId, function(err) {
                if (err) {
                    console.error('Error deleting image:', err);
                } else {
                    alert('Image deleted successfully');
                    fetchProjectById(projectId, function(err, project) {
                        if (err) {
                            console.error('Error fetching project:', err);
                        } else {
                            displayProjectImages(project);
                        }
                    });
                }
            });
        });
    }
});
