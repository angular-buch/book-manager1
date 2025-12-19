import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BookStore } from './book-store';
import { Book } from './book';

describe('BookStore', () => {
  let service: BookStore;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(BookStore);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch all books from API', () => {
    const mockBooks: Book[] = [
      { isbn: '123', title: 'Book 1', authors: ['Author 1'], description: '', imageUrl: '', createdAt: '2025-01-01' },
      { isbn: '456', title: 'Book 2', authors: ['Author 2'], description: '', imageUrl: '', createdAt: '2025-01-02' }
    ];

    let receivedBooks: Book[] | undefined;
    service.getAll().subscribe(books => receivedBooks = books);

    const req = httpTesting.expectOne('https://api1.angular-buch.com/books');
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);

    expect(receivedBooks).toEqual(mockBooks);
  });

  it('should fetch a single book by ISBN', () => {
    const mockBook: Book = { isbn: '123', title: 'Test Book', authors: ['Author'], description: '', imageUrl: '', createdAt: '' };

    let receivedBook: Book | undefined;
    service.getSingle('123').subscribe(book => receivedBook = book);

    const req = httpTesting.expectOne('https://api1.angular-buch.com/books/123');
    expect(req.request.method).toBe('GET');
    req.flush(mockBook);

    expect(receivedBook).toEqual(mockBook);
  });

  it('should delete a book', () => {
    let completed = false;
    service.remove('123').subscribe(() => completed = true);

    const req = httpTesting.expectOne('https://api1.angular-buch.com/books/123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(completed).toBe(true);
  });

  it('should handle server errors', () => {
    let errorResponse: HttpErrorResponse | undefined;
    service.getAll().subscribe({
      error: (err: HttpErrorResponse) => errorResponse = err
    });

    const req = httpTesting.expectOne('https://api1.angular-buch.com/books');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorResponse?.status).toBe(500);
  });
});
