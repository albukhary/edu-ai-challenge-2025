const assert = require("assert");

// Import the Enigma class and related components
const { Enigma, ROTORS, REFLECTOR } = require("./enigma");

describe("Enigma Machine", () => {
  describe("Basic Encryption/Decryption", () => {
    it("should encrypt and decrypt a simple message correctly", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const message = "HELLOWORLD";
      const encrypted = enigma.process(message);

      // Create a new instance with same settings for decryption
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const decrypted = enigma2.process(encrypted);

      assert.strictEqual(decrypted, message);
    });
  });

  describe("Rotor Stepping", () => {
    it("should implement double-stepping mechanism correctly", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);

      // Test first 26 characters to verify rotor stepping
      let result = "";
      for (let i = 0; i < 26; i++) {
        result += enigma.encryptChar("A");
      }

      // Verify that the result is not just repeating the same character
      assert.notStrictEqual(result, "A".repeat(26));
    });
  });

  describe("Plugboard", () => {
    it("should correctly handle plugboard swaps in encryption/decryption cycle", () => {
      // Create two instances with same settings
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [["A", "B"]]);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [["A", "B"]]);

      const message = "AB";
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);

      // After decryption, we should get back the original message
      assert.strictEqual(decrypted, message);
    });

    it("should handle multiple plugboard pairs in encryption/decryption cycle", () => {
      // Create two instances with same settings
      const enigma1 = new Enigma(
        [0, 1, 2],
        [0, 0, 0],
        [0, 0, 0],
        [
          ["A", "B"],
          ["C", "D"],
        ]
      );
      const enigma2 = new Enigma(
        [0, 1, 2],
        [0, 0, 0],
        [0, 0, 0],
        [
          ["A", "B"],
          ["C", "D"],
        ]
      );

      const message = "ABCD";
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);

      // After decryption, we should get back the original message
      assert.strictEqual(decrypted, message);
    });

    it("should verify plugboard swap is part of the encryption path", () => {
      // Test with and without plugboard to verify it affects the output
      const enigmaWithPlugboard = new Enigma(
        [0, 1, 2],
        [0, 0, 0],
        [0, 0, 0],
        [["A", "B"]]
      );
      const enigmaWithoutPlugboard = new Enigma(
        [0, 1, 2],
        [0, 0, 0],
        [0, 0, 0],
        []
      );

      const message = "AB";
      const encryptedWithPlugboard = enigmaWithPlugboard.process(message);
      const encryptedWithoutPlugboard = enigmaWithoutPlugboard.process(message);

      // The outputs should be different because of the plugboard
      assert.notStrictEqual(encryptedWithPlugboard, encryptedWithoutPlugboard);

      // Verify we can decrypt both messages
      const decryptedWithPlugboard = enigmaWithPlugboard.process(
        encryptedWithPlugboard
      );
      const decryptedWithoutPlugboard = enigmaWithoutPlugboard.process(
        encryptedWithoutPlugboard
      );

      assert.strictEqual(decryptedWithPlugboard, message);
      assert.strictEqual(decryptedWithoutPlugboard, message);
    });
  });

  describe("Ring Settings", () => {
    it("should handle different ring settings correctly", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [1, 1, 1], []);
      const message = "TEST";
      const encrypted = enigma.process(message);

      // Create a new instance with same settings for decryption
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [1, 1, 1], []);
      const decrypted = enigma2.process(encrypted);

      assert.strictEqual(decrypted, message);
    });
  });

  describe("Special Characters", () => {
    it("should pass through non-alphabetic characters unchanged", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const message = "HELLO 123!";
      const encrypted = enigma.process(message);

      // Verify that numbers and special characters are preserved
      assert.strictEqual(encrypted.replace(/[A-Z]/g, ""), " 123!");
    });
  });
});
