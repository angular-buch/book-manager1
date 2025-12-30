import { Injector, runInInjectionContext, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BookStore } from './book-store';

describe('BookStore', () => {
  let service: BookStore;
  let httpTesting: HttpTestingController;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(BookStore);
    httpTesting = TestBed.inject(HttpTestingController);
    injector = TestBed.inject(Injector);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should include search filter in HTTP request', () => {
    const searchTerm = signal('Angular');

    runInInjectionContext(injector, () => {
      service.getAll(searchTerm);
    });

    TestBed.tick();

    httpTesting
      .expectOne(r => r.params.get('filter') === 'Angular')
      .flush([]);
  });
});
