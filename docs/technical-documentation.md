# Technical Documentation

## Project Structure

### index.html
This file contains the main structure of the website, including:
- Navigation bar
- About section
- Projects section
- Skills section
- Design inspiration section
- Contact form

###styles.css
This file controls the website design, including:
- Layout and spacing
- Responsive styling
- Project cards
- Skills slider
- API section cards
- Dark/light mode styles

###script.js
This file handles the interactive of the website, including:
- Active navigation highlighting
- Theme toggle using localStorage
- Project search
- Project filtering
- Project sorting
- Fetching inspiration images from the Pexels API
- Contact form validation

---

## Features Explanation

### 1. Project Search, Filter, and Sort
the projects section allows the user to:
- Search for projects by writing in the search box
- Filter projects by category
- Sort projects by title

### 2. Theme Toggle
The user can switch between dark mode and light mode.  
The selected theme is saved, so it stays the same after refreshing the page.

### 3. Skills Section
The skills section displays my main technical skills.  

### 4. Design Inspiration API
The website connects to the Pexels API and loads design inspiration images.  
This feature includes:
- Loading message
- Error handling
- Empty state handling

### 5. Contact Form Validation
The contact form checks:
- Name is not empty
- Email is not empty
- Email format is valid
- Message is not empty

If the input is correct, a success message appears.
