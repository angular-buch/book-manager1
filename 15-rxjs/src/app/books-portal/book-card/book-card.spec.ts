import { inputBinding, outputBinding, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Mock } from 'vitest';

import { Book } from '../../shared/book';
import { BookCard } from './book-card';

describe('BookCard', () => {
  let component: BookCard;
  let fixture: ComponentFixture<BookCard>;
  const testBook = signal<Book>({
    isbn: '1234567890123',
    title: 'Test Book',
    authors: ['Test Author'],
    description: '',
    imageUrl: 'https://example.com/test.png',
    createdAt: '2026-01-01'
  });
  let likeFn: Mock;

  beforeEach(async () => {
    likeFn = vi.fn();

    await TestBed.configureTestingModule({
      imports: [BookCard],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCard, {
      bindings: [
        inputBinding('book', testBook),
        outputBinding('like', likeFn)
      ]
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render book title and isbn', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const titleEl = hostEl.querySelector('h2');
    const isbnEl = hostEl.querySelector('article > div');
    expect(isbnEl?.textContent).toContain('123-4-5678-9012-3');
    expect(titleEl?.textContent).toContain(testBook().title);
  });

  it('should display the correct image', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const imageEl = hostEl.querySelector('img');
    expect(imageEl).toBeTruthy();
    expect(imageEl?.src).toBe(testBook().imageUrl);
  });

  it('should emit the like event with a book', () => {
    component.likeBook();
    expect(likeFn).toHaveBeenCalledExactlyOnceWith(testBook());
  });
});
