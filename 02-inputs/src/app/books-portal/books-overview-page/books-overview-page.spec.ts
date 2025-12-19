import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksOverviewPage } from './books-overview-page';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksOverviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  
  it('should have a list of 2 books with correct titles', () => {
    // Act
    // Daten aus Signal auslesen, dieses wird bereits im Konstruktor gesetzt
    const books = component['books']();

    // Assert
    expect(books.length).toBe(2);
    expect(books[0].title).toBe('Tierisch gut kochen');
    expect(books[1].title).toBe('Backen mit Affen');
  });

  it('should render the correct book titles', () => {
    // Im gerenderten DOM nach dem Tag <article> suchen
    const compiledElement: HTMLElement = fixture.nativeElement;
    const articleEls = compiledElement.querySelectorAll('article');

    // Assert
    expect(articleEls.length).toBe(2);
    expect(articleEls[0].textContent).toContain('Tierisch gut kochen');
    expect(articleEls[1].textContent).toContain('Backen mit Affen');
  });
  

  it('should render a BookCard component for each book', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const bookCardEls = compiledElement.querySelectorAll('app-book-card');
    expect(bookCardEls.length).toBe(2);
  });

  it('should correctly pass book data to BookCard components', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const bookCardEls = compiledElement.querySelectorAll('app-book-card');

    expect(bookCardEls[0].textContent).toContain('Tierisch gut kochen');
    expect(bookCardEls[1].textContent).toContain('Backen mit Affen');
  });
});
