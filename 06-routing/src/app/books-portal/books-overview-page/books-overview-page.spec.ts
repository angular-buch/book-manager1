import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { booksPortalRoutes } from '../books-portal.routes';
import { BooksOverviewPage } from './books-overview-page';


// Tests für Filter-Funktionalität aus vorherigem Kapitel
// Für eine kompakte Darstellung im Buch nicht abgedruckt
describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
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


describe('BooksOverviewPage Routing', () => {
  it('should load the BooksOverviewPage for /books', async () => {
    TestBed.configureTestingModule({
      imports: [BooksOverviewPage],
      providers: [provideRouter(booksPortalRoutes)]
    });

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/books', BooksOverviewPage);

    expect(component).toBeTruthy();
    expect(document.title).toBe('Books');
  });
});
