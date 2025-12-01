import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { booksPortalRoutes } from '../books-portal.routes';

describe('BookDetailsPage Routing', () => {
  it('should navigate to the details page', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(booksPortalRoutes),
        provideLocationMocks()
      ]
    });

    const location = TestBed.inject(Location);
    const router = TestBed.inject(Router);

    // Hier wird später im produktiven Code eine Aktion stattfinden,
    // z.B. das Absenden eines Formulars und eine anschließende Navigation
    await router.navigate(['/books/details/12345']);

    // Prüfung, ob Navigation zur erwarteten Ziel-URL stattgefunden hat
    expect(location.path()).toBe('/books/details/12345');
  });
});
