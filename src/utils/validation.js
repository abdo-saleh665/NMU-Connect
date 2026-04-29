/**
 * Form Validation Helpers
 * Provides reusable validation functions and hooks for form handling
 */

/**
 * Validation rules that can be applied to form fields
 */
export const ValidationRules = {
    /**
     * Check if value is required (not empty)
     */
    required: (message = 'This field is required') => (value) => {
        if (value === null || value === undefined || value === '') {
            return message;
        }
        if (Array.isArray(value) && value.length === 0) {
            return message;
        }
        return null;
    },

    /**
     * Check if value is a valid email
     */
    email: (message = 'Please enter a valid email') => (value) => {
        if (!value) return null; // Use required rule for empty check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return message;
        }
        return null;
    },

    /**
     * Check if value meets minimum length
     */
    minLength: (min, message) => (value) => {
        if (!value) return null;
        if (value.length < min) {
            return message || `Must be at least ${min} characters`;
        }
        return null;
    },

    /**
     * Check if value does not exceed maximum length
     */
    maxLength: (max, message) => (value) => {
        if (!value) return null;
        if (value.length > max) {
            return message || `Must be no more than ${max} characters`;
        }
        return null;
    },

    /**
     * Check if value matches a pattern
     */
    pattern: (regex, message = 'Invalid format') => (value) => {
        if (!value) return null;
        if (!regex.test(value)) {
            return message;
        }
        return null;
    },

    /**
     * Check if value matches another field (e.g., confirm password)
     */
    matches: (fieldName, getValue, message) => (value) => {
        if (!value) return null;
        const otherValue = getValue(fieldName);
        if (value !== otherValue) {
            return message || `Must match ${fieldName}`;
        }
        return null;
    },

    /**
     * Phone number validation (Egyptian format)
     */
    phoneEgypt: (message = 'Please enter a valid Egyptian phone number') => (value) => {
        if (!value) return null;
        // Egyptian phone: 01xxxxxxxxx (11 digits starting with 01)
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return message;
        }
        return null;
    },

    /**
     * Student ID validation (NMU format)
     */
    studentId: (message = 'Please enter a valid student ID') => (value) => {
        if (!value) return null;
        // Format: 8 digits starting with year (e.g., 20230154)
        const idRegex = /^20[0-9]{6}$/;
        if (!idRegex.test(value)) {
            return message;
        }
        return null;
    },

    /**
     * Custom validation function
     */
    custom: (validatorFn, message = 'Invalid value') => (value) => {
        if (!validatorFn(value)) {
            return message;
        }
        return null;
    }
};

/**
 * Validate a single field with multiple rules
 * @param {*} value - The value to validate
 * @param {Function[]} rules - Array of validation rule functions
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (value, rules = []) => {
    for (const rule of rules) {
        const error = rule(value);
        if (error) {
            return error;
        }
    }
    return null;
};

/**
 * Validate entire form data
 * @param {Object} formData - Object containing form field values
 * @param {Object} validationSchema - Object mapping field names to validation rules
 * @returns {Object} - Object with errors for each field
 * 
 * @example
 * const errors = validateForm(
 *   { email: 'test', password: '' },
 *   {
 *     email: [ValidationRules.required(), ValidationRules.email()],
 *     password: [ValidationRules.required(), ValidationRules.minLength(6)]
 *   }
 * );
 * // Returns: { email: 'Please enter a valid email', password: 'This field is required' }
 */
export const validateForm = (formData, validationSchema) => {
    const errors = {};
    
    for (const [fieldName, rules] of Object.entries(validationSchema)) {
        const value = formData[fieldName];
        const error = validateField(value, rules);
        if (error) {
            errors[fieldName] = error;
        }
    }
    
    return errors;
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object from validateForm
 * @returns {boolean}
 */
export const hasErrors = (errors) => {
    return Object.keys(errors).length > 0;
};

/**
 * Create a field state manager
 * Returns functions to handle field changes and validation
 */
export const createFieldManager = (initialValues = {}, validationSchema = {}) => {
    let values = { ...initialValues };
    let errors = {};
    let touched = {};

    return {
        getValues: () => values,
        getErrors: () => errors,
        getTouched: () => touched,
        
        setValue: (field, value) => {
            values[field] = value;
            // Validate on change if field has been touched
            if (touched[field] && validationSchema[field]) {
                const error = validateField(value, validationSchema[field]);
                if (error) {
                    errors[field] = error;
                } else {
                    delete errors[field];
                }
            }
        },
        
        setTouched: (field) => {
            touched[field] = true;
            // Validate when field is touched
            if (validationSchema[field]) {
                const error = validateField(values[field], validationSchema[field]);
                if (error) {
                    errors[field] = error;
                }
            }
        },
        
        validateAll: () => {
            errors = validateForm(values, validationSchema);
            // Mark all fields as touched
            Object.keys(validationSchema).forEach(field => {
                touched[field] = true;
            });
            return !hasErrors(errors);
        },
        
        reset: () => {
            values = { ...initialValues };
            errors = {};
            touched = {};
        }
    };
};

export default {
    ValidationRules,
    validateField,
    validateForm,
    hasErrors,
    createFieldManager
};
