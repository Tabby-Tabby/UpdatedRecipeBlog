/* ===================================
   Input Sanitization & Validation
   Security features to prevent XSS attacks
   =================================== */

/**
 * Input Sanitizer - Removes dangerous content from user input
 */
const InputSanitizer = {
    /**
     * Remove HTML tags and dangerous characters
     * @param {string} input - User input string
     * @returns {string} Sanitized string
     */
    sanitizeHTML(input) {
        if (!input) return '';
        
        // Remove script tags and their content
        let cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        // Remove all HTML tags
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        
        // Remove potentially dangerous characters
        cleaned = cleaned.replace(/[<>'"]/g, '');
        
        // Trim whitespace
        cleaned = cleaned.trim();
        
        return cleaned;
    },
    
    /**
     * Sanitize URL to prevent javascript: protocol attacks
     * @param {string} url - URL string
     * @returns {string} Sanitized URL or empty string if invalid
     */
    sanitizeURL(url) {
        if (!url) return '';
        
        const cleaned = url.trim();
        
        // Block javascript: and data: protocols
        if (cleaned.toLowerCase().startsWith('javascript:') || 
            cleaned.toLowerCase().startsWith('data:')) {
            return '';
        }
        
        return cleaned;
    }
};

/**
 * Form Validator - Validates form inputs
 */
const FormValidator = {
    /**
     * Validate recipe name
     * @param {string} name - Recipe name
     * @returns {Object} Validation result with valid flag and cleaned value
     */
    validateRecipeName(name) {
        const cleaned = InputSanitizer.sanitizeHTML(name);
        
        if (!cleaned) {
            return { valid: false, message: 'Recipe name is required' };
        }
        
        if (cleaned.length < 3) {
            return { valid: false, message: 'Recipe name must be at least 3 characters' };
        }
        
        if (cleaned.length > 100) {
            return { valid: false, message: 'Recipe name must be less than 100 characters' };
        }
        
        return { valid: true, cleaned };
    },
    
    /**
     * Validate category selection
     * @param {string} category - Selected category
     * @returns {Object} Validation result
     */
    validateCategory(category) {
        const validCategories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage', 'Appetizer'];
        
        if (!category) {
            return { valid: false, message: 'Please select a category' };
        }
        
        if (!validCategories.includes(category)) {
            return { valid: false, message: 'Invalid category selected' };
        }
        
        return { valid: true, cleaned: category };
    },
    
    /**
     * Validate ingredients text
     * @param {string} ingredients - Ingredients text
     * @returns {Object} Validation result
     */
    validateIngredients(ingredients) {
        const cleaned = InputSanitizer.sanitizeHTML(ingredients);
        
        if (!cleaned) {
            return { valid: false, message: 'Ingredients are required' };
        }
        
        if (cleaned.length < 10) {
            return { valid: false, message: 'Please provide more detailed ingredients' };
        }
        
        return { valid: true, cleaned };
    },
    
    /**
     * Validate cooking instructions
     * @param {string} instructions - Instructions text
     * @returns {Object} Validation result
     */
    validateInstructions(instructions) {
        const cleaned = InputSanitizer.sanitizeHTML(instructions);
        
        if (!cleaned) {
            return { valid: false, message: 'Instructions are required' };
        }
        
        if (cleaned.length < 20) {
            return { valid: false, message: 'Please provide more detailed instructions' };
        }
        
        return { valid: true, cleaned };
    },
    
    /**
     * Validate image URL
     * @param {string} url - Image URL
     * @returns {Object} Validation result
     */
    validateImageURL(url) {
        if (!url) return { valid: true, cleaned: '' };
        
        const cleaned = InputSanitizer.sanitizeURL(url);
        
        if (!cleaned) {
            return { valid: false, message: 'Invalid or unsafe URL' };
        }
        
        // Basic URL format check
        try {
            new URL(cleaned);
            return { valid: true, cleaned };
        } catch (e) {
            return { valid: false, message: 'Please enter a valid URL (e.g., https://example.com/image.jpg)' };
        }
    }
};