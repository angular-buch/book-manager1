import { inputBinding, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BookDetailsPage } from './book-details-page';
import { BookStore } from '../../shared/book-store';

// TODO: Routing-Tests aus 06-routing übernehmen (RouterTestingHarness)

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;
  let bookStore: BookStore;

  const isbn = signal('12345');

  beforeEach(async () => {
    isbn.set('12345');

    await TestBed.configureTestingModule({
      imports: [BookDetailsPage],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsPage, {
      bindings: [
        inputBinding('isbn', isbn)
      ]
    });
    component = fixture.componentInstance;
    bookStore = TestBed.inject(BookStore);
    await fixture.whenStable();
  });

  it('should load the correct book for the given ISBN', () => {
    const expectedBook = bookStore.getSingle('12345');
    expect(component['book']()).toEqual(expectedBook);
  });

  it('should update the book when ISBN changes', async () => {
    isbn.set('67890');
    await fixture.whenStable();

    const expectedBook = bookStore.getSingle('67890');
    expect(component['book']()).toEqual(expectedBook);
  });

  it('should return undefined for an unknown ISBN', async () => {
    isbn.set('unknown');
    await fixture.whenStable();

    expect(component['book']()).toBeUndefined();
  });
});
