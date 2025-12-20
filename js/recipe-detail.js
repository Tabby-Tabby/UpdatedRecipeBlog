/* ===================================
   Recipe Detail Page
   =================================== */

// Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');

/**
 * Parse ingredients from API recipe format
 * @param {Object} recipe - Recipe object
 * @returns {Array} Array of ingredient strings
 */
function parseIngredients(recipe) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure} ${ingredient}`.trim());
        }
    }
    return ingredients;
}

/**
 * Format instructions into numbered steps
 * @param {string} instructions - Instructions text
 * @returns {Array} Array of instruction steps
 */
function formatInstructions(instructions) {
    if (!instructions) return [];
    
    // Split by periods, newlines, or numbered steps
    const steps = instructions
        .split(/\r\n|\r|\n|\.(?=\s[A-Z])/)
        .map(step => step.trim())
        .filter(step => step.length > 10);
    
    return steps;
}

/**
 * Display the recipe on the page
 * @param {Object} recipe - Recipe object
 */
function displayRecipe(recipe) {
    const isCustom = recipe.isCustom;
    const isFav = RecipeStorage.isFavorite(recipe.idMeal);
    
    // Parse ingredients and instructions
    let ingredients = [];
    let instructions = [];
    
    if (isCustom) {
        // Custom recipe format
        ingredients = recipe.ingredients.split('\n').filter(i => i.trim());
        instructions = recipe.strInstructions.split('\n').filter(i => i.trim());
    } else {
        // API recipe format
        ingredients = parseIngredients(recipe);
        instructions = formatInstructions(recipe.strInstructions);
    }
    
    const html = `
        <!-- Recipe Header -->
        <div class="recipe-header">
            <div class="recipe-image-container">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image">
                <div class="recipe-overlay">
                    <h1 class="recipe-title pacifico">${recipe.strMeal}</h1>
                    <div class="recipe-badges">
                        <span class="badge-custom">🍽️ ${recipe.strCategory}</span>
                        <span class="badge-custom">🌍 ${recipe.strArea}</span>
                        ${isCustom ? '<span class="badge-custom">✨ Custom Recipe</span>' : ''}
                    </div>
                </div>
            </div>
            
            <div class="recipe-actions">
                <div>
                    <a href="javascript:history.back()" class="btn-back">← Back</a>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-favorite-large ${isFav ? 'active' : ''}" id="favoriteBtn" onclick="toggleFavorite()">
                        ${isFav ? '❤️ Saved' : '🤍 Save to Favorites'}
                    </button>
                    <button class="btn-print" onclick="window.print()">
                        🖨️ Print Recipe
                    </button>
                </div>
            </div>
        </div>

        <!-- Recipe Content -->
        <div class="recipe-content">
            ${isCustom && (recipe.prepTime || recipe.cookTime) ? `
                <div class="content-card">
                    <div class="recipe-info-grid">
                        ${recipe.prepTime ? `
                            <div class="info-box">
                                <div class="info-label">Prep Time</div>
                                <div class="info-value">${recipe.prepTime} min</div>
                            </div>
                        ` : ''}
                        ${recipe.cookTime ? `
                            <div class="info-box">
                                <div class="info-label">Cook Time</div>
                                <div class="info-value">${recipe.cookTime} min</div>
                            </div>
                        ` : ''}
                        ${recipe.prepTime && recipe.cookTime ? `
                            <div class="info-box">
                                <div class="info-label">Total Time</div>
                                <div class="info-value">${parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} min</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}

            <!-- Ingredients -->
            <div class="content-card">
                <h2 class="section-title">
                    <span class="section-icon">🥘</span>
                    Ingredients
                </h2>
                <ul class="ingredients-list">
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>

            <!-- Instructions -->
            <div class="content-card">
                <h2 class="section-title">
                    <span class="section-icon">👨‍🍳</span>
                    Instructions
                </h2>
                <ol class="instructions-list">
                    ${instructions.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>

            ${isCustom && recipe.notes ? `
                <div class="content-card">
                    <div class="notes-box">
                        <strong>📝 Additional Notes:</strong><br>
                        ${recipe.notes}
                    </div>
                </div>
            ` : ''}

            ${isCustom ? `
                <div class="content-card">
                    <p class="text-muted text-center">
                        <small>Custom recipe added on ${new Date(recipe.dateAdded).toLocaleDateString()}</small>
                    </p>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('mainContent').innerHTML = html;
}

/**
 * Toggle favorite status
 */
function toggleFavorite() {
    if (!window.currentRecipe) return;
    
    const btn = document.getElementById('favoriteBtn');
    
    if (RecipeStorage.isFavorite(window.currentRecipe.idMeal)) {
        RecipeStorage.removeFavorite(window.currentRecipe.idMeal);
        btn.classList.remove('active');
        btn.textContent = '🤍 Save to Favorites';
    } else {
        const added = RecipeStorage.addFavorite(window.currentRecipe);
        if (added) {
            btn.classList.add('active');
            btn.textContent = '❤️ Saved';
        }
    }
}

/**
 * Show loading state
 */
function showLoading() {
    document.getElementById('mainContent').innerHTML = `
        <div class="loading-container">
            <div class="text-center">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading recipe...</p>
            </div>
        </div>
    `;
}

/**
 * Show error state
 */
function showError() {
    document.getElementById('mainContent').innerHTML = `
        <div class="error-container">
            <div class="error-icon">😕</div>
            <h2 class="error-title">Recipe Not Found</h2>
            <p>We couldn't find the recipe you're looking for.</p>
            <a href="index.html" class="btn-back">← Back to Home</a>
        </div>
    `;
}

/**
 * Load recipe data and display
 */
async function loadRecipe() {
    if (!recipeId) {
        showError();
        return;
    }

    showLoading();

    // Check if it's a custom recipe first
    if (recipeId.startsWith('custom_')) {
        const recipe = RecipeStorage.getRecipeById(recipeId);
        if (recipe) {
            window.currentRecipe = recipe;
            displayRecipe(recipe);
        } else {
            showError();
        }
    } else {
        // Fetch from API
        const recipe = await RecipeAPI.getRecipeById(recipeId);
        if (recipe) {
            window.currentRecipe = recipe;
            displayRecipe(recipe);
        } else {
            showError();
        }
    }
}

// Load recipe when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadRecipe();
});