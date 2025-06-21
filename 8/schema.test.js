/**
 * @file schema.test.js
 * @description Test suite for the data validation library
 */

const { Schema, Validator } = require('./schema');

// Helper function to check validation results
function expectValid(result) {
  expect(result.isValid).toBe(true);
  expect(result.errors.length).toBe(0);
}

function expectInvalid(result, expectedErrorCount = 1) {
  expect(result.isValid).toBe(false);
  expect(result.errors.length).toBeGreaterThanOrEqual(expectedErrorCount);
}

describe('Validator Base Class', () => {
  class TestValidator extends Validator {
    _validate(value) {
      return { isValid: value === 'valid', errors: value === 'valid' ? [] : ['Invalid value'] };
    }
  }

  test('should handle required values', () => {
    const validator = new TestValidator();
    expectInvalid(validator.validate(undefined));
    expectInvalid(validator.validate(null));
  });

  test('should handle optional values', () => {
    const validator = new TestValidator().optional();
    expectValid(validator.validate(undefined));
    expectValid(validator.validate(null));
  });

  test('should use custom error messages', () => {
    const customMsg = 'Custom error message';
    const validator = new TestValidator().withMessage(customMsg);
    const result = validator.validate(null);
    expect(result.errors[0]).toBe(customMsg);
  });
});

describe('StringValidator', () => {
  test('should validate string type', () => {
    const validator = Schema.string();
    expectValid(validator.validate('hello'));
    expectInvalid(validator.validate(123));
    expectInvalid(validator.validate(true));
    expectInvalid(validator.validate({}));
    expectInvalid(validator.validate([]));
  });

  test('should validate minLength', () => {
    const validator = Schema.string().minLength(5);
    expectValid(validator.validate('hello'));
    expectValid(validator.validate('hello world'));
    expectInvalid(validator.validate('hi'));
  });

  test('should validate maxLength', () => {
    const validator = Schema.string().maxLength(5);
    expectValid(validator.validate('hello'));
    expectValid(validator.validate('hi'));
    expectInvalid(validator.validate('hello world'));
  });

  test('should validate pattern', () => {
    const validator = Schema.string().pattern(/^[a-z]+$/);
    expectValid(validator.validate('hello'));
    expectInvalid(validator.validate('hello123'));
    expectInvalid(validator.validate('Hello'));
  });

  test('should validate combined constraints', () => {
    const validator = Schema.string().minLength(3).maxLength(8).pattern(/^[a-z]+$/);
    expectValid(validator.validate('hello'));
    expectInvalid(validator.validate('hi'));
    expectInvalid(validator.validate('helloworld'));
    expectInvalid(validator.validate('hello123'));
  });
});

describe('NumberValidator', () => {
  test('should validate number type', () => {
    const validator = Schema.number();
    expectValid(validator.validate(123));
    expectValid(validator.validate(0));
    expectValid(validator.validate(-10.5));
    expectInvalid(validator.validate('123'));
    expectInvalid(validator.validate(NaN));
    expectInvalid(validator.validate(true));
  });

  test('should validate min value', () => {
    const validator = Schema.number().min(5);
    expectValid(validator.validate(5));
    expectValid(validator.validate(10));
    expectInvalid(validator.validate(4));
  });

  test('should validate max value', () => {
    const validator = Schema.number().max(5);
    expectValid(validator.validate(5));
    expectValid(validator.validate(0));
    expectInvalid(validator.validate(6));
  });

  test('should validate integer constraint', () => {
    const validator = Schema.number().integer();
    expectValid(validator.validate(5));
    expectValid(validator.validate(-10));
    expectInvalid(validator.validate(5.5));
  });

  test('should validate combined constraints', () => {
    const validator = Schema.number().min(1).max(10).integer();
    expectValid(validator.validate(5));
    expectInvalid(validator.validate(0.5));
    expectInvalid(validator.validate(0));
    expectInvalid(validator.validate(11));
    expectInvalid(validator.validate(5.5));
  });
});

describe('BooleanValidator', () => {
  test('should validate boolean type', () => {
    const validator = Schema.boolean();
    expectValid(validator.validate(true));
    expectValid(validator.validate(false));
    expectInvalid(validator.validate('true'));
    expectInvalid(validator.validate(1));
    expectInvalid(validator.validate(0));
    expectInvalid(validator.validate(null));
  });
});

describe('DateValidator', () => {
  test('should validate date type', () => {
    const validator = Schema.date();
    expectValid(validator.validate(new Date()));
    expectValid(validator.validate('2023-01-01'));
    expectInvalid(validator.validate('not a date'));
    expectInvalid(validator.validate({}));
  });

  test('should validate min date', () => {
    const minDate = new Date('2023-01-01');
    const validator = Schema.date().min(minDate);
    expectValid(validator.validate(new Date('2023-01-01')));
    expectValid(validator.validate(new Date('2023-06-15')));
    expectInvalid(validator.validate(new Date('2022-12-31')));
  });

  test('should validate max date', () => {
    const maxDate = new Date('2023-12-31');
    const validator = Schema.date().max(maxDate);
    expectValid(validator.validate(new Date('2023-01-01')));
    expectValid(validator.validate(new Date('2023-12-31')));
    expectInvalid(validator.validate(new Date('2024-01-01')));
  });

  test('should validate date range', () => {
    const minDate = new Date('2023-01-01');
    const maxDate = new Date('2023-12-31');
    const validator = Schema.date().min(minDate).max(maxDate);
    expectValid(validator.validate(new Date('2023-06-15')));
    expectInvalid(validator.validate(new Date('2022-12-31')));
    expectInvalid(validator.validate(new Date('2024-01-01')));
  });
});

describe('ArrayValidator', () => {
  test('should validate array type', () => {
    const validator = Schema.array(Schema.string());
    expectValid(validator.validate([]));
    expectValid(validator.validate(['hello']));
    expectInvalid(validator.validate('not an array'));
    expectInvalid(validator.validate({}));
  });

  test('should validate array items', () => {
    const validator = Schema.array(Schema.string());
    expectValid(validator.validate(['hello', 'world']));
    expectInvalid(validator.validate(['hello', 123]));
    expectInvalid(validator.validate([true, false]));
  });

  test('should validate minItems', () => {
    const validator = Schema.array(Schema.string()).minItems(2);
    expectValid(validator.validate(['hello', 'world']));
    expectValid(validator.validate(['hello', 'world', 'again']));
    expectInvalid(validator.validate([]));
    expectInvalid(validator.validate(['hello']));
  });

  test('should validate maxItems', () => {
    const validator = Schema.array(Schema.string()).maxItems(2);
    expectValid(validator.validate([]));
    expectValid(validator.validate(['hello']));
    expectValid(validator.validate(['hello', 'world']));
    expectInvalid(validator.validate(['hello', 'world', 'again']));
  });

  test('should validate nested arrays', () => {
    const validator = Schema.array(Schema.array(Schema.number()));
    expectValid(validator.validate([[1, 2], [3, 4]]));
    expectInvalid(validator.validate([[1, 2], ['3', 4]]));
  });
});

describe('ObjectValidator', () => {
  test('should validate object type', () => {
    const validator = Schema.object({});
    expectValid(validator.validate({}));
    expectInvalid(validator.validate([]));
    expectInvalid(validator.validate('not an object'));
    expectInvalid(validator.validate(123));
  });

  test('should validate object properties', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number()
    });
    
    expectValid(validator.validate({ name: 'John', age: 30 }));
    expectInvalid(validator.validate({ name: 'John', age: '30' }));
    expectInvalid(validator.validate({ name: 123, age: 30 }));
  });

  test('should handle optional properties', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number().optional()
    });
    
    expectValid(validator.validate({ name: 'John' }));
    expectValid(validator.validate({ name: 'John', age: 30 }));
    expectInvalid(validator.validate({ age: 30 }));
  });

  test('should validate nested objects', () => {
    const addressSchema = Schema.object({
      street: Schema.string(),
      city: Schema.string()
    });
    
    const userSchema = Schema.object({
      name: Schema.string(),
      address: addressSchema
    });
    
    expectValid(userSchema.validate({
      name: 'John',
      address: { street: 'Main St', city: 'Anytown' }
    }));
    
    expectInvalid(userSchema.validate({
      name: 'John',
      address: { street: 123, city: 'Anytown' }
    }));
  });
});

describe('Complex Schema Validation', () => {
  test('should validate complex nested structures', () => {
    const addressSchema = Schema.object({
      street: Schema.string(),
      city: Schema.string(),
      postalCode: Schema.string().pattern(/^\d{5}$/),
      country: Schema.string()
    });

    const userSchema = Schema.object({
      id: Schema.string(),
      name: Schema.string().minLength(2).maxLength(50),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: Schema.number().min(18).optional(),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()),
      address: addressSchema.optional(),
      createdAt: Schema.date()
    });

    const validUser = {
      id: "12345",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true,
      tags: ["developer", "designer"],
      address: {
        street: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
        country: "USA"
      },
      createdAt: new Date()
    };

    expectValid(userSchema.validate(validUser));

    // Test with invalid email
    const invalidEmail = { ...validUser, email: "not-an-email" };
    expectInvalid(userSchema.validate(invalidEmail));

    // Test with invalid postal code
    const invalidPostalCode = {
      ...validUser,
      address: { ...validUser.address, postalCode: "1234" }
    };
    expectInvalid(userSchema.validate(invalidPostalCode));

    // Test with missing required field
    const missingName = { ...validUser };
    delete missingName.name;
    expectInvalid(userSchema.validate(missingName));
  });
});
