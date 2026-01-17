import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { BooksOverviewPage } from './books-overview-page';
import { booksPortalRoutes } from '../books-portal.routes';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage],
      providers: [provideRouter(booksPortalRoutes)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksOverviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of 2 books with correct titles', () => {
    const books = component['books']();

    expect(books).toHaveLength(2);
    expect(books[0].title).toBe('Tierisch gut kochen');
    expect(books[1].title).toBe('Backen mit Affen');
  });

  it('should render the correct book titles', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const articleEls = compiledElement.querySelectorAll('article');

    expect(articleEls).toHaveLength(2);
    expect(articleEls[0].textContent).toContain('Tierisch gut kochen');
    expect(articleEls[1].textContent).toContain('Backen mit Affen');
  });

  it('should render a BookCard component for each book', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const bookCardEls = compiledElement.querySelectorAll('app-book-card');
    expect(bookCardEls).toHaveLength(2);
  });

  it('should correctly pass book data to BookCard components', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const bookCardEls = compiledElement.querySelectorAll('app-book-card');

    expect(bookCardEls[0].textContent).toContain('Tierisch gut kochen');
    expect(bookCardEls[1].textContent).toContain('Backen mit Affen');
  });

  it('should display all books if the search term is empty', () => {
    component['searchTerm'].set('');

    const books = component['filteredBooks']();
    expect(books).toHaveLength(2);
  });

  it('should filter books based on the search term', () => {
    component['searchTerm'].set('Affe');

    const books = component['filteredBooks']();
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe('Backen mit Affen');
  });

  it('should filter books ignoring case sensitivity', () => {
    component['searchTerm'].set('AFFEN');

    const books = component['filteredBooks']();
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe('Backen mit Affen');
  });

  it('should return an empty array if no book matches the search term', () => {
    component['searchTerm'].set('unbekannter Titel');

    const books = component['filteredBooks']();
    expect(books).toHaveLength(0);
  });

  it('should load the BooksOverviewPage for /books', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/books', BooksOverviewPage);

    expect(component).toBeTruthy();
    expect(document.title).toBe('Books');
  });
});
