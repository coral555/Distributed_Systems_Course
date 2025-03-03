// Submitted By: Coral Bahofrker
document.addEventListener('DOMContentLoaded', () =>{  
    // initialize & set up event listeners and get the ID's of the elements i created and use it to access them on the screen
    const searchBarInput = document.getElementById('searchBarInput');
    const imageGrid = document.getElementById('imageGrid');
    const loadMoreButon = document.getElementById('loadMoreButon');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    const clientId = '0UA1NAW5TqzN8y_OGQyISxb24mOS96d-k-g2gUlPix8';  // the key from unsplash
    let currentPage = 1;  // initialize current page of the search results to be = 1 --> according to Miriam's instruction
    let currentQuery = ''; // current search query
    searchBarInput.value = ''; // to clear the search input 

    // serch input listener - acts when the user typed at least 3 characters
    searchBarInput.addEventListener('input', (event) => {
        const query = event.target.value.trim(); // get the input's value

        if(query.length >= 3){ // if the query is at least 3 characters
            currentQuery = query; // update it
            currentPage = 1; // first page
            imageGrid.innerHTML = ''; // clear imageGrid
            clear(); // function to clear any old elements and details on the screen
            findPictures(query, currentPage); // search for the images with the current page & query
        }else{ // if the query is less than 3 characters
            currentQuery = ''; // clear currentQuery
            imageGrid.innerHTML = ''; // clear imageGrid
            loadMoreContainer.style.display = 'none'; // hide and don't show "Load More" button
            clear(); // function to clear any old elements and details on the screen
        }
    });


    // load More Buton listener - acts when the user clicked on the button & load more pictures for the curren query
    loadMoreButon.addEventListener('click', () => {
        if(currentQuery.length >= 3){  // if the query is at least 3 characters
            currentPage++; // move to next page
            findPictures(currentQuery, currentPage); // search for the images with the current page & query
        }
    });


    // get pictures from unsplash according to the current query & page
    function findPictures(query, page){
        // the url's format for the AJAX request
        const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${clientId}&per_page=20&page=${page}`;  
        
        $.ajax({  // AJAX request
            url: url,
            method: 'GET', // HTTP method for the request to get the pictuers we want according to the current query
            dataType: 'json', // parse response as JSON
            timeout: 10000, // timout of 10 sec
            success: function(data){ // callback method if we succeeded
                showPictures(data.results); // show/print the pictuers we've got

                if(page >= data.total_pages){ // if we are in the last page
                    loadMoreContainer.style.display = 'none'; // hide and don't show "Load More" button
                }
                else{ // if not
                    loadMoreContainer.style.display = 'block'; // show "Load More" button
                }
            },
            error: function(xhr, status, error){ // callback method if we had an error
                console.error('Error get pictures:', error); // log the error in the console
                console.error('Status Error:', status); // log the status in the console
                console.error('XHR Error:', xhr); // log the xhr in the console

                let errMsg = 'Failed to get pictures.'; // defult message
                if(status === 'timeout'){ // timeout error
                    errMsg = 'Request timed out.';
                }
                else if(xhr.status === 0){  // network error
                    errMsg = 'Network error - check connection.';
                }
                else if(xhr.status >= 400 && xhr.status < 500){ // client Http errors
                    errMsg = `Client error - ${xhr.status}, ${xhr.statusText}`;
                }
                else if(xhr.status >= 500){ // server Http error
                    errMsg = `Server error - ${xhr.status}, ${xhr.statusText}`;
                }
                else if(status === 'parsererror'){ // parse error
                    errMsg = 'Parse error.';
                }

                const errMsgElement = document.createElement('p'); // create a paragraph
                errMsgElement.textContent = errMsg; // write error message
                errMsgElement.style.color = 'red'; // color the error message in red
                imageGrid.appendChild(errMsgElement); // show it on the screen
            }
        });
    }

    // show the searched pictures from unsplash on the imageGrid 
    // pictures - is an unsplash's objects array
    function showPictures(pictures){
        pictures.forEach( picture => { // run over each picture
            const pictureElement = document.createElement('img'); // creating new image element
            pictureElement.src = picture.urls.thumb; // set the src keep the thumb picture
            pictureElement.alt = picture.alt_description; // set alt to keep the alt_description
            pictureElement.addEventListener('click', () => showPictureDetails(picture)); // adding a clickable listener so we could click on the picture and see it
            imageGrid.appendChild(pictureElement); // show the image element on the screen - imageGrid
        });
    }


    // show the nessecery detailes on each clicked picture
    function showPictureDetails(picture){
        clear(); // function to clear any old elements and details on the screen
        const title = picture.description || 'Untitled'; // save the picture description as title --> if there's no description, it will save "Untitled"
        const description = picture.alt_description || 'No description'; // save the picture alt_description as description --> if there's no alt_description, it will save "No description"

        const pictureWindow = document.createElement('div'); // creating new div element for the pop-up picture window
        pictureWindow.classList.add('modal'); // add it to the div
        // set the HTML for the clicked picture
        pictureWindow.innerHTML = `
            <div class="picWindow">
                <span class="close">&times;</span>
                <h2>${title}</h2>
                <img src="${picture.urls.small}" alt="${picture.alt_description}">
                <p>Description: ${description}</p>
                <p>Likes: ${picture.likes}</p>
            </div>    
        `;

        // adding a listener to close the window when clicking on the X button on the screen
        pictureWindow.querySelector('.close').addEventListener('click', () => {
            pictureWindow.remove(); // remove/close the pop-up window
        });
        document.body.appendChild(pictureWindow); // apply the new window on the screen
    }

    // function to clear any old elements and details on the screen
    function clear() {  
        const toClear = document.querySelector('.modal');
        if(toClear){
            toClear.remove();
        }
    }
});