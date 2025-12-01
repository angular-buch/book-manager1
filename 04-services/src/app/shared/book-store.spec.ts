import { TestBed } from '@angular/core/testing';
import { BookStore } from './book-store';

describe('BookStore', () => {
  let service: BookStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookStore]
    });
    service = TestBed.inject(BookStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of books', () => {
    const books = service.getAll();
    expect(books.length).toBeGreaterThan(0);

    // Optional: Wir können die Bücher auch noch intensiver prüfen
    // Zum Beispiel:
    // expect(books[0].isbn).toBe('12345');
    // expect(books[1].title).toBe('Backen mit Affen');
  });
});
