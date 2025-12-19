import { inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Book } from '../../shared/book';
import { BookCard } from './book-card';

describe('BookCard', () => {
  let component: BookCard;
  let fixture: ComponentFixture<BookCard>;

  const testBook: Book = {
    isbn: '1234567890123',
    title: 'Test Book',
    authors: ['Test Author'],
    description: '',
    imageUrl: 'https://example.com/test.png',
    createdAt: '2026-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCard],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(BookCard, {
      bindings: [
        inputBinding('book', () => testBook)
      ]
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
});
