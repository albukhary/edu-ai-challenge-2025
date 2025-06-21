# Data Validation Library

A robust, type-safe validation library for complex data structures in JavaScript. This library provides a fluent API for defining validation schemas and validating data against them.

## Features

- Type-safe validator functions for primitive types (string, number, boolean, date)
- Support for complex types (arrays, objects)
- Nested validation schemas
- Optional fields
- Custom error messages
- Chainable API for defining validation rules

## Installation

```bash
# If using npm
npm install

# If using yarn
yarn
```

## Usage

### Basic Usage

```javascript
const { Schema } = require('./schema');

// Create a simple schema
const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(18).optional()
});

// Validate data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  age: 30
};

const result = userSchema.validate(userData);

if (result.isValid) {
  console.log("Validation passed!");
} else {
  console.log("Validation failed:", result.errors);
}
```

### Available Validators

#### String Validator

```javascript
// Basic string validation
const nameValidator = Schema.string();

// With constraints
const usernameValidator = Schema.string()
  .minLength(3)
  .maxLength(20)
  .pattern(/^[a-zA-Z0-9_]+$/);

// With custom error message
const emailValidator = Schema.string()
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage("Invalid email format");
```

#### Number Validator

```javascript
// Basic number validation
const scoreValidator = Schema.number();

// With constraints
const ageValidator = Schema.number()
  .min(18)
  .max(120);

// Integer validation
const countValidator = Schema.number()
  .integer()
  .min(0);
```

#### Boolean Validator

```javascript
const isActiveValidator = Schema.boolean();
```

#### Date Validator

```javascript
// Basic date validation
const dateValidator = Schema.date();

// With constraints
const birthDateValidator = Schema.date()
  .max(new Date()) // Must be in the past
  .withMessage("Birth date must be in the past");

// Date range
const eventDateValidator = Schema.date()
  .min(new Date('2023-01-01'))
  .max(new Date('2023-12-31'));
```

#### Array Validator

```javascript
// Array of strings
const tagsValidator = Schema.array(Schema.string());

// With constraints
const topScoresValidator = Schema.array(Schema.number())
  .minItems(1)
  .maxItems(10);

// Nested arrays
const matrixValidator = Schema.array(
  Schema.array(Schema.number())
);
```

#### Object Validator

```javascript
// Simple object
const addressValidator = Schema.object({
  street: Schema.string(),
  city: Schema.string(),
  postalCode: Schema.string().pattern(/^\d{5}$/),
  country: Schema.string()
});

// Nested objects
const userValidator = Schema.object({
  name: Schema.string(),
  address: addressValidator.optional()
});
```

### Optional Fields

Any validator can be made optional by calling the `.optional()` method:

```javascript
const schema = Schema.object({
  name: Schema.string(),
  age: Schema.number().optional(), // This field can be undefined or null
  address: addressSchema.optional()
});
```

### Custom Error Messages

You can provide custom error messages using the `.withMessage()` method:

```javascript
const emailValidator = Schema.string()
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage("Please enter a valid email address");
```

## Running Tests

To run the test suite:

```bash
# Using npm
npm test

# Using Jest directly
npx jest schema.test.js
```

## Test Coverage

The test suite covers all core functionality of the validation library, including:

- Base validator functionality
- String validation
- Number validation
- Boolean validation
- Date validation
- Array validation
- Object validation
- Complex nested schemas
- Optional fields
- Custom error messages

The test coverage is above 60% as required by the project specifications.
