import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCard } from './book-card';
import { Book } from '../../shared/book';
import { signal, inputBinding } from '@angular/core';

describe('BookCard', () => {
  let fixture: ComponentFixture<BookCard>;
  const testBook = signal<Book>({
    isbn: '1111',
    title: 'Testbuch',
    subtitle: 'Test',
    authors: ['Author 1', 'Author 2'],
    imageUrl: 'https://cdn.ng-buch.de/test.png',
    description: 'Dies ist ein Testbuch',
    createdAt: new Date().toISOString()
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCard]
    })
    .compileComponents();


    fixture = TestBed.createComponent(BookCard, {
      bindings: [inputBinding('book', testBook)]
    });

    fixture.detectChanges();
  });

  it('should render book title, subtitle and isbn', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    expect(compiledElement.textContent).toContain(testBook().isbn);
    expect(compiledElement.textContent).toContain(testBook().subtitle);
    expect(compiledElement.textContent).toContain(testBook().isbn);
  });

  it('should display the correct image', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const imageEl = compiledElement.querySelector('img')!;
    expect(imageEl).toBeTruthy();
    expect(imageEl.src).toBe(testBook().imageUrl);
  });
});
