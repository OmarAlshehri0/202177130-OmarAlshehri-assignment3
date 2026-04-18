# Technical Documentation

## Project Structure

### index.html
Contains the main sections:
- Navigation
- About section
- Projects section
- News section
- Contact form 

### css/styles.css
Used for:
- Layout and spacing
- Responsive design
- Theme styling (dark/light mode)
- Button and card styling

### js/script.js
Used for:
- Navigation highlight
- Theme toggle using localStorage
- Project filtering
- Fetching data from API
- Form validation

---

## Features Explanation

### Project Search
User can type in the search box and projects will filter.  

### Theme Toggle
User can switch between dark and light mode.  

### API Feature
The website fetches software engineering articles using a public API.  
It shows loading text and error message if something fails.

### Form Validation
The form checks:
- Name is not empty
- Email is valid
- Message is not empty

If correct, a success message appears.

---

## Responsive Design

The layout changes depending on screen size:

- Navigation becomes vertical on small screens
- Projects appear in one column on mobile
- Layout adjusts using CSS

