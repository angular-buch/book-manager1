import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { Location } from '@angular/common';

import { BookDetailsPage } from './book-details-page';
import { booksPortalRoutes } from '../books-portal.routes';
import { BookStore } from '../../shared/book-store';

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;
  let bookStore: BookStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailsPage],
      providers: [
        provideRouter(booksPortalRoutes),
        provideLocationMocks(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailsPage);
    component = fixture.componentInstance;
    bookStore = TestBed.inject(BookStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the correct book by ISBN', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/books/details/12345', BookDetailsPage);

    const expectedBook = bookStore.getSingle('12345');

    expect(component['book']()).toEqual(expectedBook);
    expect(document.title).toBe('Book Details');
  });

  it('should navigate to the details page', async () => {
    const location = TestBed.inject(Location);
    const router = TestBed.inject(Router);

    await router.navigate(['/books/details/12345']);

    expect(location.path()).toBe('/books/details/12345');
  });
});
