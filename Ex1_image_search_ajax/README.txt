Image Search Web Application using Unsplash API

This project is a web application for searching images dynamically using the Unsplash API. The application enables users to search for images by keyword and dynamically load more images.

Overview:
This web application is developed as part of the Distributed Systems Course at Azrieli College of Engineering. The system utilizes AJAX requests to fetch images from Unsplash, ensuring a seamless search experience.

Features:
✅ Live Search – Displays search results as the user types (starting from 3 characters).
✅ AJAX Requests – Fetches images dynamically from the Unsplash API.
✅ Responsive Design – Works on desktop & mobile devices.
✅ Load More Functionality – Users can load more results when available.
✅ Image Details Modal – Clicking an image reveals its description, likes, and metadata.

Technologies Used:
HTML5 – Structuring the web page.
CSS3 – Styling and responsive design.
JavaScript (ES6) – Client-side logic and AJAX requests.
jQuery – Simplifying AJAX calls and DOM manipulations.
Unsplash API – Fetching images dynamically.

Installation & Setup:
1. Clone the Repository:
    git clone https://github.com/coral555/Distributed_Systems_Course.git
    cd Distributed_Systems_Course

2. Open the Project in a Browser:
    open mainPage.html   # macOS
    start mainPage.html  # Windows

How It Works:
1. The user types a search term (minimum 3 characters).
2. The system sends an AJAX request to Unsplash API and retrieves matching images.
3. The images are displayed dynamically in a grid format.
4. If more results are available, a "Load More" button appears to fetch additional images.
5. Clicking on an image opens a modal window with additional details.