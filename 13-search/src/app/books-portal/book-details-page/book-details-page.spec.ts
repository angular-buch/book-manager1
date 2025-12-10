import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BookDetailsPage } from './book-details-page';

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;
  let httpMock: HttpTestingController;

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
    req.flush({
      isbn: '123',
      title: 'Test Book',
      authors: ['Test Author'],
      published: '2026-01-01',
      subtitle: '',
      rating: 5,
      thumbnails: [{ url: '', title: '' }],
      description: ''
    });

    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
