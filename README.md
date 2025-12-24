# UpdatedRecipeBlog
# 🍳 Tabby's Recipe Blog

A modern, responsive recipe management web application built with vanilla JavaScript, featuring API integration, local storage persistence, and comprehensive security measures.

#Live Demo
https://tabby-tabby.github.io/UpdatedRecipeBlog/

## 📋 Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Security Features](#security-features)
- [Technical Highlights](#technical-highlights)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## ✨ Features

### 🔍 Recipe Search & Discovery
- Real-time recipe search using TheMealDB API
- Display search results with recipe cards
- View detailed recipe information
- Search by recipe name

### ❤️ Favorites Management
- Save up to 15 favorite recipes
- View all saved recipes in one place
- Remove individual recipes or clear all
- Real-time search/filter within favorites
- Visual progress indicator (x/15 favorites)
- Data persists across browser sessions using localStorage

### ➕ Add Custom Recipes
- Create and save your own recipes
- Comprehensive form with validation:
  - Recipe name (required, 3-100 characters)
  - Category selection (required)
  - Cuisine type (optional)
  - Ingredients (required, min 10 characters)
  - Instructions (required, min 20 characters)
  - Prep time & cook time (optional)
  - Recipe image URL (optional, validated)
  - Additional notes (optional)
- Real-time character counters
- Input sanitization to prevent XSS attacks
- Instant validation feedback

### 📖 Recipe Detail View
- Full recipe display with hero image
- Categorized information (cuisine, category, custom/API source)
- Formatted ingredients list
- Step-by-step numbered instructions
- Print-friendly layout
- Save/unsave from detail page
- Works with both API and custom recipes

## 🛠 Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styles with CSS variables, Flexbox, Grid
- **JavaScript (ES6+)** - Vanilla JS with modern features (async/await, arrow functions, template literals)
- **Bootstrap 5.3.3** - Responsive framework
- **Google Fonts** - Pacifico & Itim fonts

### API
- **TheMealDB API** - Free recipe data source (no API key required)

### Storage
- **localStorage** - Client-side data persistence

### Development Principles
- Modular JavaScript architecture
- Separation of concerns (HTML/CSS/JS)
- Progressive enhancement
- Mobile-first responsive design
- Semantic HTML
- Accessibility considerations

## 📁 Project Structure

```
tabby-recipe-blog/
├── index.html              # Home page - Search & Discovery
├── favorites.html          # Favorites management page
├── add-recipe.html         # Add custom recipe form
├── recipe-detail.html      # Recipe detail view
│
├── css/
│   └── styles.css          # Main stylesheet (all pages)
│
├── js/
│   ├── storage.js          # localStorage management (CRUD operations)
│   ├── api.js              # API call handlers
│   ├── validation.js       # Input sanitization & validation
│   ├── home.js             # Home page logic
│   ├── favorites.js        # Favorites page logic
│   ├── add-recipe.js       # Add recipe form logic
│   └── recipe-detail.js    # Recipe detail page logic
│
└── README.md               # This file
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tabby-recipe-blog.git
   cd tabby-recipe-blog
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - No build process or dependencies required!
   - Works with any modern browser (Chrome, Firefox, Safari, Edge)

3. **Optional: Use a local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   ```
   Then navigate to `http://localhost:8000`

## 💡 Usage

### Searching for Recipes
1. Open `index.html`
2. Type a search term (e.g., "chicken", "pasta", "dessert")
3. Press Enter or click the Search button
4. Browse results and click "View Recipe" for details
5. Click "Save" to add to favorites (max 15)

### Managing Favorites
1. Navigate to the Favorites page
2. View your saved recipes
3. Use the search bar to filter favorites
4. Click "Remove" to delete individual recipes
5. Click "Clear All Favorites" to reset (with confirmation)

### Adding Custom Recipes
1. Navigate to the Add Recipe page
2. Fill out the required fields (marked with *)
3. Optional: Add prep/cook time, image URL, and notes
4. Watch real-time character counters and validation
5. Click "Add Recipe to Favorites"
6. View your custom recipe in Favorites

### Viewing Recipe Details
1. Click "View Recipe" on any recipe card
2. See full ingredients and instructions
3. Save/unsave from this page
4. Use the Print button for a printer-friendly view
5. Click Back to return to previous page

## 🔒 Security Features

### Input Sanitization
- **HTML Tag Removal**: Strips all HTML tags from user input
- **Script Injection Prevention**: Removes `<script>` tags and their content
- **Character Escaping**: Removes potentially dangerous characters (`<`, `>`, `'`, `"`)
- **URL Validation**: Blocks `javascript:` and `data:` protocols in image URLs

### Form Validation
- **Client-side validation** with detailed error messages
- **Length constraints** to prevent overflow attacks
- **Category whitelisting** to prevent invalid data
- **URL format validation** with try-catch error handling
- **Sanitization layer** before localStorage storage

### Example Attack Prevention
```javascript
// User tries to inject malicious code:
Input: "<script>alert('XSS')</script>Chocolate Cake"
Sanitized Output: "Chocolate Cake"

// User tries to inject malicious URL:
Input: "javascript:alert('XSS')"
Sanitized Output: "" (empty, blocked)
```

## 🎯 Technical Highlights

### State Management
- Centralized localStorage operations in `storage.js`
- Consistent state updates across all pages
- 15-favorite limit enforced at storage layer
- Data validation before persistence

### CRUD Operations
- **Create**: Add recipes to favorites, create custom recipes
- **Read**: Display favorites, fetch recipe details, search recipes
- **Update**: (Future feature - edit custom recipes)
- **Delete**: Remove individual favorites, clear all favorites

### Data Persistence
- All favorites stored in browser localStorage
- Survives page refresh and browser restart
- No backend required
- Custom recipes stored with metadata (date added, custom flag)

### API Integration
- Async/await for clean asynchronous code
- Error handling for network failures
- Parses unusual API format (20 separate ingredient fields)
- Fallback for missing data

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px for tablet/mobile
- Flexible grid layouts with CSS Grid and Flexbox
- Touch-friendly button sizes
- Readable typography on all screen sizes

### Code Organization
- **Modular JavaScript**: Each page has its own logic file
- **Shared utilities**: Common functions in separate modules
- **Separation of concerns**: Structure (HTML), Presentation (CSS), Behavior (JS)
- **DRY principle**: No code duplication across files
- **Clear naming**: Descriptive function and variable names

## 🚀 Future Enhancements

### Planned Features
- [ ] Edit custom recipes functionality
- [ ] Recipe rating system (1-5 stars)
- [ ] Shopping list generator from ingredients
- [ ] Export/import favorites as JSON
- [ ] Meal planner calendar
- [ ] Dark mode toggle
- [ ] Advanced search filters (cuisine type, cooking time)
- [ ] Share recipes via URL
- [ ] Recipe categories/tags system
- [ ] User authentication (Firebase)
- [ ] Backend API for shared recipes

### Technical Improvements
- [ ] Convert to React for better state management
- [ ] Add unit tests (Jest)
- [ ] Implement service workers for offline functionality
- [ ] Add database (MongoDB) for cloud storage
- [ ] Implement image upload for custom recipes
- [ ] Add recipe nutrition information
- [ ] Performance optimization (lazy loading, code splitting)

## 📝 Learning Outcomes

This project demonstrates proficiency in:
- ✅ Vanilla JavaScript DOM manipulation
- ✅ Asynchronous JavaScript (Promises, async/await)
- ✅ RESTful API integration
- ✅ Browser storage APIs (localStorage)
- ✅ Form validation and input sanitization
- ✅ Security best practices (XSS prevention)
- ✅ Responsive web design
- ✅ CSS Grid and Flexbox layouts
- ✅ Modular code architecture
- ✅ Git version control
- ✅ Project documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Tabitha Rosier**
- Email: 97trosie@gmail.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Recipe data provided by [TheMealDB API](https://www.themealdb.com/)
- Bootstrap framework by [Bootstrap Team](https://getbootstrap.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Inspiration from various recipe websites

---

**Note**: This is a portfolio project created for learning purposes. All recipe data is provided by TheMealDB API.

*Last Updated: December 2025*
