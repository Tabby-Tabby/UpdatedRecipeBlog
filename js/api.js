/* ===================================
   Recipe API Handler
   Handles all TheMealDB API calls
   =================================== */

const RecipeAPI = {
    /**
     * Search recipes by name
     * @param {string} query - Search term
     * @returns {Promise<Array>} Array of recipe objects
     */
    async searchRecipes(query) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Error fetching recipes:', error);
            return [];
        }
    },
    
    /**
     * Get a specific recipe by ID
     * @param {string} recipeId - Recipe ID to fetch
     * @returns {Promise<Object|null>} Recipe object or null if not found
     */
    async getRecipeById(recipeId) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Error fetching recipe:', error);
            return null;
        }
    }
};