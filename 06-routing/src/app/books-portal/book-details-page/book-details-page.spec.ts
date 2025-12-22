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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the correct book by ISBN', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/books/details/12345', BookDetailsPage);
    const bookStore = TestBed.inject(BookStore);

    const expectedBook = bookStore.getSingle('12345');

    expect(component['book']()).toEqual(expectedBook);
    expect(document.title).toBe('Book Details');
  });

  it('should navigate to the details page', async () => {
    const location = TestBed.inject(Location);
    const router = TestBed.inject(Router);

    // Hier wird später im produktiven Code eine Aktion stattfinden,
    // z. B. das Absenden eines Formulars und eine anschließende Navigation
    await router.navigate(['/books/details/12345']);

    // Prüfung, ob Navigation zur erwarteten Ziel-URL stattgefunden hat
    expect(location.path()).toBe('/books/details/12345');
  });
});
