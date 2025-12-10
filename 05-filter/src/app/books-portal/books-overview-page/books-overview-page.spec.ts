import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksOverviewPage } from './books-overview-page';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksOverviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should display all books if the search term is empty', () => {
    component['searchTerm'].set('');

    const books = component['filteredBooks']();
    expect(books.length).toBe(2);
  });

  it('should filter books based on the search term', () => {
    component['searchTerm'].set('Affe');

    const books = component['filteredBooks']();
    expect(books.length).toBe(1);
    expect(books[0].title).toBe('Backen mit Affen');
  });

  it('should filter books ignoring case sensitivity', () => {
    component['searchTerm'].set('AFFEN');

    const books = component['filteredBooks']();
    expect(books.length).toBe(1);
    expect(books[0].title).toBe('Backen mit Affen');
  });

  it('should return an empty array if no book matches the search term', () => {
    component['searchTerm'].set('unbekannter Titel');

    const books = component['filteredBooks']();
    expect(books.length).toBe(0);
  });
});
