/* ===================================
   Add Recipe Page - Form Handling
   =================================== */

/**
 * Update character counter for a field
 * @param {string} inputId - Input element ID
 * @param {string} counterId - Counter element ID
 */
function updateCharCounter(inputId, counterId) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    
    input.addEventListener('input', () => {
        const length = input.value.length;
        const maxLength = input.getAttribute('maxlength');
        
        counter.textContent = length;
        
        // Color coding
        const percentage = (length / maxLength) * 100;
        counter.parentElement.classList.remove('warning', 'danger');
        
        if (percentage > 90) {
            counter.parentElement.classList.add('danger');
        } else if (percentage > 75) {
            counter.parentElement.classList.add('warning');
        }
    });
}

/**
 * Show error message for a field
 * @param {string} fieldId - Field element ID
 * @param {string} message - Error message
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    
    field.classList.add('invalid');
    field.classList.remove('valid');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

/**
 * Clear error message for a field
 * @param {string} fieldId - Field element ID
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    
    field.classList.remove('invalid');
    field.classList.add('valid');
    errorDiv.classList.remove('show');
}

/**
 * Reset the entire form
 */
function resetForm() {
    if (confirm('Are you sure you want to clear all fields?')) {
        document.getElementById('recipeForm').reset();
        
        // Clear all validation states
        document.querySelectorAll('.form-control, .form-select').forEach(field => {
            field.classList.remove('invalid', 'valid');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
        
        // Reset character counters
        document.getElementById('nameCounter').textContent = '0';
        document.getElementById('ingredientsCounter').textContent = '0';
        document.getElementById('instructionsCounter').textContent = '0';
        document.getElementById('notesCounter').textContent = '0';
    }
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        recipeName: document.getElementById('recipeName').value,
        category: document.getElementById('category').value,
        cuisine: document.getElementById('cuisine').value,
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value,
        prepTime: document.getElementById('prepTime').value,
        cookTime: document.getElementById('cookTime').value,
        imageUrl: document.getElementById('imageUrl').value,
        notes: document.getElementById('notes').value
    };
    
    // Validate all fields
    let isValid = true;
    const validatedData = {};
    
    // Validate recipe name
    const nameValidation = FormValidator.validateRecipeName(formData.recipeName);
    if (!nameValidation.valid) {
        showError('recipeName', nameValidation.message);
        isValid = false;
    } else {
        clearError('recipeName');
        validatedData.recipeName = nameValidation.cleaned;
    }
    
    // Validate category
    const categoryValidation = FormValidator.validateCategory(formData.category);
    if (!categoryValidation.valid) {
        showError('category', categoryValidation.message);
        isValid = false;
    } else {
        clearError('category');
        validatedData.category = categoryValidation.cleaned;
    }
    
    // Validate ingredients
    const ingredientsValidation = FormValidator.validateIngredients(formData.ingredients);
    if (!ingredientsValidation.valid) {
        showError('ingredients', ingredientsValidation.message);
        isValid = false;
    } else {
        clearError('ingredients');
        validatedData.ingredients = ingredientsValidation.cleaned;
    }
    
    // Validate instructions
    const instructionsValidation = FormValidator.validateInstructions(formData.instructions);
    if (!instructionsValidation.valid) {
        showError('instructions', instructionsValidation.message);
        isValid = false;
    } else {
        clearError('instructions');
        validatedData.instructions = instructionsValidation.cleaned;
    }
    
    // Validate image URL (optional)
    if (formData.imageUrl) {
        const imageValidation = FormValidator.validateImageURL(formData.imageUrl);
        if (!imageValidation.valid) {
            showError('imageUrl', imageValidation.message);
            isValid = false;
        } else {
            clearError('imageUrl');
            validatedData.imageUrl = imageValidation.cleaned;
        }
    }
    
    // If validation fails, stop here
    if (!isValid) {
        return;
    }
    
    // Sanitize optional fields
    validatedData.cuisine = InputSanitizer.sanitizeHTML(formData.cuisine) || 'Custom';
    validatedData.notes = InputSanitizer.sanitizeHTML(formData.notes);
    validatedData.prepTime = formData.prepTime;
    validatedData.cookTime = formData.cookTime;
    
    // Check if favorites limit reached
    const favorites = RecipeStorage.getFavorites();
    if (favorites.length >= 15) {
        alert('⚠️ Maximum 15 favorites reached!\n\nPlease remove some favorites before adding more.');
        return;
    }
    
    // Create recipe object (matching API format for consistency)
    const recipe = {
        idMeal: 'custom_' + Date.now(), // Unique ID
        strMeal: validatedData.recipeName,
        strCategory: validatedData.category,
        strArea: validatedData.cuisine,
        strInstructions: validatedData.instructions,
        strMealThumb: validatedData.imageUrl || 'https://via.placeholder.com/300x200?text=Custom+Recipe',
        ingredients: validatedData.ingredients,
        notes: validatedData.notes,
        prepTime: validatedData.prepTime,
        cookTime: validatedData.cookTime,
        isCustom: true, // Flag to identify custom recipes
        dateAdded: new Date().toISOString()
    };
    
    // Save to favorites
    RecipeStorage.addFavorite(recipe);
    
    // Show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.classList.add('show');
    
    // Reset form
    document.getElementById('recipeForm').reset();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize character counters
    updateCharCounter('recipeName', 'nameCounter');
    updateCharCounter('ingredients', 'ingredientsCounter');
    updateCharCounter('instructions', 'instructionsCounter');
    updateCharCounter('notes', 'notesCounter');
    
    // Form submission
    document.getElementById('recipeForm').addEventListener('submit', handleSubmit);
    
    // Real-time validation (on blur)
    document.getElementById('recipeName').addEventListener('blur', function() {
        if (this.value) {
            const validation = FormValidator.validateRecipeName(this.value);
            if (!validation.valid) {
                showError('recipeName', validation.message);
            } else {
                clearError('recipeName');
            }
        }
    });
    
    document.getElementById('ingredients').addEventListener('blur', function() {
        if (this.value) {
            const validation = FormValidator.validateIngredients(this.value);
            if (!validation.valid) {
                showError('ingredients', validation.message);
            } else {
                clearError('ingredients');
            }
        }
    });
    
    document.getElementById('instructions').addEventListener('blur', function() {
        if (this.value) {
            const validation = FormValidator.validateInstructions(this.value);
            if (!validation.valid) {
                showError('instructions', validation.message);
            } else {
                clearError('instructions');
            }
        }
    });
    
    document.getElementById('imageUrl').addEventListener('blur', function() {
        if (this.value) {
            const validation = FormValidator.validateImageURL(this.value);
            if (!validation.valid) {
                showError('imageUrl', validation.message);
            } else {
                clearError('imageUrl');
            }
        }
    });
});