import { capitalizeFirstLetter } from './capitalize-first-letter';

describe('capitalizeFirstLetter', () => {
  it('should return text with capitalized first letter', () => {
    expect(capitalizeFirstLetter('test')).toBe('Test');
  });

  it('should return an empty string when input is empty', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('should work correctly for a single character', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('should keep the rest of the text unchanged', () => {
    expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
  });

  it('should work correctly for text starting with a space', () => {
    expect(capitalizeFirstLetter(' hello')).toBe('Hello');
  });

  it('should work correctly for text starting with a digit', () => {
    expect(capitalizeFirstLetter('123abc')).toBe('123abc');
  });
});
