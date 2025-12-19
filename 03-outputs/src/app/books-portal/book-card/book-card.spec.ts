import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCard } from './book-card';
import { Book } from '../../shared/book';
import { inputBinding, outputBinding } from '@angular/core';

describe('BookCard', () => {
  let fixture: ComponentFixture<BookCard>;
  let emittedBook: Book | undefined;

  const testBook: Book = {
    isbn: '1234567890123',
    title: 'Test Book',
    authors: ['Test Author'],
    description: '',
    imageUrl: 'https://example.com/test.png',
    createdAt: '2026-01-01'
  };

  beforeEach(async () => {
    emittedBook = undefined;

    await TestBed.configureTestingModule({
      imports: [BookCard]
    }).compileComponents();

    fixture = TestBed.createComponent(BookCard, {
      bindings: [
        inputBinding('book', () => testBook),
        outputBinding('like', (book: Book) => emittedBook = book)
      ]
    });

    await fixture.whenStable();
  });

  
  it('should render book title and isbn', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    expect(compiledElement.textContent).toContain(testBook.isbn);
    expect(compiledElement.textContent).toContain(testBook.title);
  });

  it('should display the correct image', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const imageEl = compiledElement.querySelector('img')!;
    expect(imageEl).toBeTruthy();
    expect(imageEl.src).toBe(testBook.imageUrl);
  });
  

  it('should emit the like event with the correct book', () => {
    // Event manuell auslösen
    fixture.componentInstance.likeBook();

    // Prüfen, ob das Event ausgelöst wurde
    expect(emittedBook).toBeDefined();
    expect(emittedBook).toEqual(testBook);
  });
});
