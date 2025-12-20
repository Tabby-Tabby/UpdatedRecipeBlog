/* ===================================
   Favorites Page - Manage Saved Recipes
   =================================== */

// UI Manager for Favorites Page
const UI = {
    /**
     * Display all favorite recipes
     * @param {Array} recipes - Array of recipe objects
     */
    displayFavorites(recipes) {
        const container = document.getElementById('favoritesContainer');
        
        if (recipes.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <div class="empty-state-icon">💔</div>
                        <h3>No Favorites Yet</h3>
                        <p>Start building your collection of favorite recipes!</p>
                        <a href="index.html" class="btn-primary-custom">Discover Recipes</a>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
    },
    
    /**
     * Create HTML for a recipe card
     * @param {Object} recipe - Recipe object
     * @returns {string} HTML string
     */
    createRecipeCard(recipe) {
        return `
            <div class="col-md-6 col-lg-4" id="card-${recipe.idMeal}">
                <div class="recipe-card">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-img">
                    <div class="recipe-body">
                        <span class="recipe-category">${recipe.strCategory}</span>
                        <h3 class="recipe-title">${recipe.strMeal}</h3>
                        <div class="recipe-meta">
                            <span>🌍 ${recipe.strArea}</span>
                        </div>
                        <div class="recipe-actions">
                            <button class="btn-remove" onclick="removeFavorite('${recipe.idMeal}')">
                                ❌ Remove
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
     * Update the favorites counter display
     * @param {number} count - Number of favorites
     */
    updateCounter(count) {
        document.getElementById('favCount').textContent = count;
        const percentage = (count / 15) * 100;
        document.getElementById('counterFill').style.width = percentage + '%';
        
        // Disable clear button if no favorites
        const clearBtn = document.getElementById('clearAllBtn');
        clearBtn.disabled = count === 0;
    },
    
    /**
     * Filter recipes by search term
     * @param {string} searchTerm - Search query
     */
    filterRecipes(searchTerm) {
        const favorites = RecipeStorage.getFavorites();
        
        if (!searchTerm) {
            this.displayFavorites(favorites);
            return;
        }
        
        const filtered = favorites.filter(recipe => {
            const searchLower = searchTerm.toLowerCase();
            return (
                recipe.strMeal.toLowerCase().includes(searchLower) ||
                recipe.strCategory.toLowerCase().includes(searchLower) ||
                recipe.strArea.toLowerCase().includes(searchLower)
            );
        });
        
        this.displayFavorites(filtered);
    }
};

/**
 * Remove individual favorite with animation
 * @param {string} recipeId - Recipe ID to remove
 */
function removeFavorite(recipeId) {
    const card = document.getElementById(`card-${recipeId}`);
    card.classList.add('removing');
    
    setTimeout(() => {
        RecipeStorage.removeFavorite(recipeId);
        loadFavorites();
    }, 300);
}

/**
 * Clear all favorites with confirmation
 */
function confirmClearAll() {
    const count = RecipeStorage.getFavorites().length;
    
    if (count === 0) return;
    
    const confirmed = confirm(
        `⚠️ Are you sure you want to delete all ${count} favorite recipes?\n\n` +
        `This action cannot be undone!`
    );
    
    if (confirmed) {
        RecipeStorage.clearAll();
        loadFavorites();
        alert('✅ All favorites have been cleared!');
    }
}

/**
 * Load and display all favorites
 */
function loadFavorites() {
    const favorites = RecipeStorage.getFavorites();
    UI.displayFavorites(favorites);
    UI.updateCounter(favorites.length);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load favorites on page load
    loadFavorites();
    
    // Search/Filter handler
    document.getElementById('filterInput').addEventListener('input', (e) => {
        UI.filterRecipes(e.target.value);
    });
});