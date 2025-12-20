/* ===================================
   Home Page - Search & Discovery
   =================================== */

// UI Manager for Home Page
const UI = {
    /**
     * Show loading spinner
     */
    showLoading() {
        document.getElementById('loadingSpinner').classList.add('active');
        document.getElementById('recipesContainer').innerHTML = '';
        document.getElementById('resultsTitle').style.display = 'none';
    },
    
    /**
     * Hide loading spinner
     */
    hideLoading() {
        document.getElementById('loadingSpinner').classList.remove('active');
    },
    
    /**
     * Display search results
     * @param {Array} recipes - Array of recipe objects
     */
    displayRecipes(recipes) {
        const container = document.getElementById('recipesContainer');
        const title = document.getElementById('resultsTitle');
        
        if (recipes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>😕 No recipes found</h3>
                    <p>Try a different search term</p>
                </div>
            `;
            title.style.display = 'none';
            return;
        }
        
        title.style.display = 'block';
        container.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
        
        // Add event listeners for favorite buttons
        this.attachFavoriteListeners();
    },
    
    /**
     * Create HTML for a recipe card
     * @param {Object} recipe - Recipe object
     * @returns {string} HTML string
     */
    createRecipeCard(recipe) {
        const isFavorite = RecipeStorage.isFavorite(recipe.idMeal);
        return `
            <div class="col-md-6 col-lg-4">
                <div class="recipe-card">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-img">
                    <div class="recipe-body">
                        <span class="recipe-category">${recipe.strCategory}</span>
                        <h3 class="recipe-title">${recipe.strMeal}</h3>
                        <p class="text-muted small mb-0">${recipe.strArea} Cuisine</p>
                        <div class="recipe-actions">
                            <button class="btn-favorite ${isFavorite ? 'active' : ''}" data-recipe='${JSON.stringify(recipe)}'>
                                ${isFavorite ? '❤️ Saved' : '🤍 Save'}
                            </button>
                            <button class="btn-view" onclick="window.location.href='recipe-detail.html?id=${recipe.idMeal}'">
                                View Recipe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Attach event listeners to favorite buttons
     */
    attachFavoriteListeners() {
        document.querySelectorAll('.btn-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipe = JSON.parse(btn.dataset.recipe);
                
                if (RecipeStorage.isFavorite(recipe.idMeal)) {
                    RecipeStorage.removeFavorite(recipe.idMeal);
                    btn.classList.remove('active');
                    btn.textContent = '🤍 Save';
                } else {
                    const added = RecipeStorage.addFavorite(recipe);
                    if (added) {
                        btn.classList.add('active');
                        btn.textContent = '❤️ Saved';
                    }
                }
            });
        });
    }
};

/**
 * Handle recipe search
 */
async function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    UI.showLoading();
    const recipes = await RecipeAPI.searchRecipes(query);
    UI.hideLoading();
    UI.displayRecipes(recipes);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});