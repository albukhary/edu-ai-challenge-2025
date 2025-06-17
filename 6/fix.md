# Enigma Machine Bug Fix Documentation

## Bug Description

The original implementation had an incorrect rotor stepping mechanism in the `stepRotors()` method. The Enigma machine's rotor stepping mechanism is a critical component that determines how the rotors advance during encryption/decryption. The bug affected the double-stepping mechanism, which is a key feature of the historical Enigma machine.

### Original Implementation

```javascript
stepRotors() {
  if (this.rotors[2].atNotch()) this.rotors[1].step();
  if (this.rotors[1].atNotch()) this.rotors[0].step();
  this.rotors[2].step();
}
```

The original code had two issues:

1. It only checked the rightmost rotor's notch position to step the middle rotor
2. It didn't properly implement the double-stepping mechanism where the middle rotor steps when either:
   - The rightmost rotor is at its notch position
   - The middle rotor itself is at its notch position

## Fix Implementation

The fix implements the correct double-stepping mechanism:

```javascript
stepRotors() {
  // Check if middle rotor is at notch position
  const middleAtNotch = this.rotors[1].atNotch();
  // Check if rightmost rotor is at notch position
  const rightAtNotch = this.rotors[2].atNotch();

  // Double-stepping mechanism
  if (middleAtNotch) {
    this.rotors[0].step(); // Step left rotor
    this.rotors[1].step(); // Step middle rotor
  } else if (rightAtNotch) {
    this.rotors[1].step(); // Step middle rotor
  }

  this.rotors[2].step(); // Always step rightmost rotor
}
```

## Impact of the Fix

The fix ensures that:

1. The middle rotor steps when it's at its notch position
2. The middle rotor also steps when the rightmost rotor is at its notch position
3. The left rotor steps when the middle rotor is at its notch position
4. The rightmost rotor always steps

This matches the historical Enigma machine's behavior and ensures correct encryption/decryption of messages.

## Testing

The fix has been verified through comprehensive unit tests that cover:

- Basic encryption/decryption
- Rotor stepping mechanism
- Plugboard functionality
- Ring settings
- Special character handling

The test suite ensures that the Enigma machine now correctly implements all its core features and maintains the expected behavior of the historical device.
