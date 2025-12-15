import { IsbnFormatPipe } from './isbn-format.pipe';

describe('IsbnFormatPipe', () => {
  let pipe: IsbnFormatPipe;

  beforeEach(() => {
    pipe = new IsbnFormatPipe();
  });

  it('should format a valid ISBN-13', () => {
    const result = pipe.transform('1234567890123');
    expect(result).toBe('123-4-5678-9012-3');
  });

  it('should return the original string if it is not 13 characters long', () => {
    const result = pipe.transform('123');
    expect(result).toBe('123');
  });
});
