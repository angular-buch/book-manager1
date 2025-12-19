import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';

import { BookDetailsPage } from './book-details-page';
import { booksPortalRoutes } from '../books-portal.routes';
import { BookStore } from '../../shared/book-store';

describe('BookDetailsPage Routing', () => {
  it('should load the correct book by ISBN', async () => {
    TestBed.configureTestingModule({
      imports: [BookDetailsPage],
      providers: [provideRouter(booksPortalRoutes)]
    });

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/books/details/12345', BookDetailsPage);
    const bookStore = TestBed.inject(BookStore);

    const expectedBook = bookStore.getSingle('12345');

    expect(component['book']()).toEqual(expectedBook);
    expect(document.title).toBe('Book Details');
  });
});
