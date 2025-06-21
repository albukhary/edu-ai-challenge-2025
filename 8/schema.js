/**
 * @file schema.js
 * @description A robust data validation library for complex inputs
 */

/**
 * Base Validator class that all specific validators extend
 * @template T - The type of value being validated
 */
class Validator {
  /**
   * @protected
   * @type {string|null}
   */
  _errorMessage = null;
  
  /**
   * @protected
   * @type {boolean}
   */
  _isOptional = false;

  /**
   * Validates the provided value against this validator's rules
   * @param {any} value - The value to validate
   * @returns {{isValid: boolean, errors: string[]}} Validation result with errors if any
   */
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this._isOptional) {
        return { isValid: true, errors: [] };
      } else {
        return { 
          isValid: false, 
          errors: [this._errorMessage || 'Value is required'] 
        };
      }
    }
    
    return this._validate(value);
  }
  
  /**
   * Internal validation method to be implemented by subclasses
   * @protected
   * @param {any} value - The value to validate
   * @returns {{isValid: boolean, errors: string[]}} Validation result
   */
  _validate(value) {
    throw new Error('_validate method must be implemented by subclass');
  }
  
  /**
   * Makes this validator optional (accepts undefined or null)
   * @returns {this} The validator instance for method chaining
   */
  optional() {
    this._isOptional = true;
    return this;
  }
  
  /**
   * Sets a custom error message for this validator
   * @param {string} message - The custom error message
   * @returns {this} The validator instance for method chaining
   */
  withMessage(message) {
    this._errorMessage = message;
    return this;
  }
}

/**
 * Validates string values
 */
class StringValidator extends Validator {
  /**
   * @private
   * @type {number|null}
   */
  _minLength = null;
  
  /**
   * @private
   * @type {number|null}
   */
  _maxLength = null;
  
  /**
   * @private
   * @type {RegExp|null}
   */
  _pattern = null;

  /**
   * @inheritdoc
   */
  _validate(value) {
    const errors = [];
    
    if (typeof value !== 'string') {
      errors.push(this._errorMessage || 'Value must be a string');
      return { isValid: false, errors };
    }
    
    if (this._minLength !== null && value.length < this._minLength) {
      errors.push(`String must be at least ${this._minLength} characters long`);
    }
    
    if (this._maxLength !== null && value.length > this._maxLength) {
      errors.push(`String must be at most ${this._maxLength} characters long`);
    }
    
    if (this._pattern !== null && !this._pattern.test(value)) {
      errors.push(this._errorMessage || 'String does not match the required pattern');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  /**
   * Sets the minimum length requirement
   * @param {number} length - The minimum length
   * @returns {this} The validator instance for method chaining
   */
  minLength(length) {
    this._minLength = length;
    return this;
  }
  
  /**
   * Sets the maximum length requirement
   * @param {number} length - The maximum length
   * @returns {this} The validator instance for method chaining
   */
  maxLength(length) {
    this._maxLength = length;
    return this;
  }
  
  /**
   * Sets a pattern requirement
   * @param {RegExp} regex - The regular expression pattern
   * @returns {this} The validator instance for method chaining
   */
  pattern(regex) {
    this._pattern = regex;
    return this;
  }
}

/**
 * Validates number values
 */
class NumberValidator extends Validator {
  /**
   * @private
   * @type {number|null}
   */
  _min = null;
  
  /**
   * @private
   * @type {number|null}
   */
  _max = null;
  
  /**
   * @private
   * @type {boolean}
   */
  _integer = false;

  /**
   * @inheritdoc
   */
  _validate(value) {
    const errors = [];
    
    if (typeof value !== 'number' || isNaN(value)) {
      errors.push(this._errorMessage || 'Value must be a number');
      return { isValid: false, errors };
    }
    
    if (this._integer && !Number.isInteger(value)) {
      errors.push('Value must be an integer');
    }
    
    if (this._min !== null && value < this._min) {
      errors.push(`Number must be at least ${this._min}`);
    }
    
    if (this._max !== null && value > this._max) {
      errors.push(`Number must be at most ${this._max}`);
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  /**
   * Sets the minimum value requirement
   * @param {number} value - The minimum value
   * @returns {this} The validator instance for method chaining
   */
  min(value) {
    this._min = value;
    return this;
  }
  
  /**
   * Sets the maximum value requirement
   * @param {number} value - The maximum value
   * @returns {this} The validator instance for method chaining
   */
  max(value) {
    this._max = value;
    return this;
  }
  
  /**
   * Requires the number to be an integer
   * @returns {this} The validator instance for method chaining
   */
  integer() {
    this._integer = true;
    return this;
  }
}

/**
 * Validates boolean values
 */
class BooleanValidator extends Validator {
  /**
   * @inheritdoc
   */
  _validate(value) {
    if (typeof value !== 'boolean') {
      return { 
        isValid: false, 
        errors: [this._errorMessage || 'Value must be a boolean'] 
      };
    }
    
    return { isValid: true, errors: [] };
  }
}

/**
 * Validates Date values
 */
class DateValidator extends Validator {
  /**
   * @private
   * @type {Date|null}
   */
  _min = null;
  
  /**
   * @private
   * @type {Date|null}
   */
  _max = null;

  /**
   * @inheritdoc
   */
  _validate(value) {
    const errors = [];
    
    // Check if it's a valid date
    const date = value instanceof Date ? value : new Date(value);
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      errors.push(this._errorMessage || 'Value must be a valid date');
      return { isValid: false, errors };
    }
    
    if (this._min !== null && date < this._min) {
      errors.push(`Date must be on or after ${this._min.toISOString()}`);
    }
    
    if (this._max !== null && date > this._max) {
      errors.push(`Date must be on or before ${this._max.toISOString()}`);
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  /**
   * Sets the minimum date requirement
   * @param {Date} date - The minimum date
   * @returns {this} The validator instance for method chaining
   */
  min(date) {
    this._min = date;
    return this;
  }
  
  /**
   * Sets the maximum date requirement
   * @param {Date} date - The maximum date
   * @returns {this} The validator instance for method chaining
   */
  max(date) {
    this._max = date;
    return this;
  }
}

/**
 * Validates object values against a schema
 * @template T - The type of object being validated
 */
class ObjectValidator extends Validator {
  /**
   * @private
   * @type {Record<string, Validator<any>>}
   */
  _schema;
  
  /**
   * @constructor
   * @param {Record<string, Validator<any>>} schema - The schema to validate against
   */
  constructor(schema) {
    super();
    this._schema = schema;
  }

  /**
   * @inheritdoc
   */
  _validate(value) {
    const errors = [];
    
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      errors.push(this._errorMessage || 'Value must be an object');
      return { isValid: false, errors };
    }
    
    // Validate each field against its schema
    for (const [key, validator] of Object.entries(this._schema)) {
      const fieldValue = value[key];
      const fieldResult = validator.validate(fieldValue);
      
      if (!fieldResult.isValid) {
        errors.push(...fieldResult.errors.map(err => `${key}: ${err}`));
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Validates array values
 * @template T - The type of items in the array
 */
class ArrayValidator extends Validator {
  /**
   * @private
   * @type {Validator<T>}
   */
  _itemValidator;
  
  /**
   * @private
   * @type {number|null}
   */
  _minItems = null;
  
  /**
   * @private
   * @type {number|null}
   */
  _maxItems = null;

  /**
   * @constructor
   * @param {Validator<T>} itemValidator - The validator for array items
   */
  constructor(itemValidator) {
    super();
    this._itemValidator = itemValidator;
  }

  /**
   * @inheritdoc
   */
  _validate(value) {
    const errors = [];
    
    if (!Array.isArray(value)) {
      errors.push(this._errorMessage || 'Value must be an array');
      return { isValid: false, errors };
    }
    
    if (this._minItems !== null && value.length < this._minItems) {
      errors.push(`Array must contain at least ${this._minItems} items`);
    }
    
    if (this._maxItems !== null && value.length > this._maxItems) {
      errors.push(`Array must contain at most ${this._maxItems} items`);
    }
    
    // Validate each item
    for (let i = 0; i < value.length; i++) {
      const itemResult = this._itemValidator.validate(value[i]);
      if (!itemResult.isValid) {
        errors.push(...itemResult.errors.map(err => `Item at index ${i}: ${err}`));
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  /**
   * Sets the minimum items requirement
   * @param {number} count - The minimum number of items
   * @returns {this} The validator instance for method chaining
   */
  minItems(count) {
    this._minItems = count;
    return this;
  }
  
  /**
   * Sets the maximum items requirement
   * @param {number} count - The maximum number of items
   * @returns {this} The validator instance for method chaining
   */
  maxItems(count) {
    this._maxItems = count;
    return this;
  }
}

/**
 * Schema Builder - Factory for creating validators
 */
class Schema {
  /**
   * Creates a string validator
   * @returns {StringValidator} A new string validator
   */
  static string() {
    return new StringValidator();
  }
  
  /**
   * Creates a number validator
   * @returns {NumberValidator} A new number validator
   */
  static number() {
    return new NumberValidator();
  }
  
  /**
   * Creates a boolean validator
   * @returns {BooleanValidator} A new boolean validator
   */
  static boolean() {
    return new BooleanValidator();
  }
  
  /**
   * Creates a date validator
   * @returns {DateValidator} A new date validator
   */
  static date() {
    return new DateValidator();
  }
  
  /**
   * Creates an object validator
   * @template T - The type of object being validated
   * @param {Record<string, Validator<any>>} schema - The schema to validate against
   * @returns {ObjectValidator<T>} A new object validator
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }
  
  /**
   * Creates an array validator
   * @template T - The type of items in the array
   * @param {Validator<T>} itemValidator - The validator for array items
   * @returns {ArrayValidator<T>} A new array validator
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

// Export the Schema class for use in other modules
module.exports = { Schema, Validator };

// Example usage (kept from template)
// Define a complex schema
const addressSchema = Schema.object({
  street: Schema.string(),
  city: Schema.string(),
  postalCode: Schema.string().pattern(/^\d{5}$/).withMessage('Postal code must be 5 digits'),
  country: Schema.string()
});

const userSchema = Schema.object({
  id: Schema.string().withMessage('ID must be a string'),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()),
  address: addressSchema.optional(),
  metadata: Schema.object({}).optional()
});

// Validate data
const userData = {
  id: "12345",
  name: "John Doe",
  email: "john@example.com",
  isActive: true,
  tags: ["developer", "designer"],
  address: {
    street: "123 Main St",
    city: "Anytown",
    postalCode: "12345",
    country: "USA"
  }
};

const result = userSchema.validate(userData);
