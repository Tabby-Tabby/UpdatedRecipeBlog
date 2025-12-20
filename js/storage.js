/* ===================================
   Recipe Storage Manager
   Handles all localStorage operations
   =================================== */

const RecipeStorage = {
    /**
     * Get all favorite recipes from localStorage
     * @returns {Array} Array of recipe objects
     */
    getFavorites() {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    },
    
    /**
     * Save favorites array to localStorage
     * @param {Array} favorites - Array of recipe objects
     */
    saveFavorites(favorites) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    },
    
    /**
     * Check if a recipe is in favorites
     * @param {string} recipeId - Recipe ID to check
     * @returns {boolean} True if recipe is favorited
     */
    isFavorite(recipeId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.idMeal === recipeId);
    },
    
    /**
     * Add a recipe to favorites (with 15-recipe limit)
     * @param {Object} recipe - Recipe object to add
     * @returns {boolean} True if successfully added
     */
    addFavorite(recipe) {
        const favorites = this.getFavorites();
        
        // Check if already favorited
        if (this.isFavorite(recipe.idMeal)) {
            return false;
        }
        
        // Check 15 favorite limit
        if (favorites.length >= 15) {
            alert('⚠️ Maximum 15 favorites reached!\n\nPlease remove some favorites before adding more.');
            return false;
        }
        
        favorites.push(recipe);
        this.saveFavorites(favorites);
        return true;
    },
    
    /**
     * Remove a recipe from favorites
     * @param {string} recipeId - Recipe ID to remove
     */
    removeFavorite(recipeId) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(fav => fav.idMeal !== recipeId);
        this.saveFavorites(favorites);
    },
    
    /**
     * Get a specific recipe by ID from favorites
     * @param {string} recipeId - Recipe ID to find
     * @returns {Object|null} Recipe object or null if not found
     */
    getRecipeById(recipeId) {
        const favorites = this.getFavorites();
        return favorites.find(fav => fav.idMeal === recipeId) || null;
    },
    
    /**
     * Clear all favorites
     */
    clearAll() {
        localStorage.removeItem('favorites');
    }
};