import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Book } from '../../shared/book';
import { BookDetailsPage } from './book-details-page';

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;
  let httpMock: HttpTestingController;

  const testBook: Book = {
    isbn: '123',
    title: 'Test Book',
    authors: ['Test Author'],
    description: '',
    imageUrl: 'https://example.com/test.png',
    createdAt: '2026-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailsPage],
      providers: [
        provideRouter([]),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(BookDetailsPage, {
      bindings: [
        inputBinding('isbn', () => '123')
      ]
    });
    component = fixture.componentInstance;

    // Triggers the effect - see https://angular.dev/guide/http/http-resource#testing-an-httpresource
    TestBed.tick();

    // Respond to the HTTP request triggered by the Resource
    const req = httpMock.expectOne('https://api1.angular-buch.com/books/123');
    req.flush(testBook);

    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
