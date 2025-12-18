import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Mock } from 'vitest';

import { routes } from '../../app.routes';
import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';
import { BookCreatePage } from './book-create-page';

describe('BookCreatePage', () => {
  let component: BookCreatePage;
  let fixture: ComponentFixture<BookCreatePage>;
  let bookCreateMock: Mock;

  const validBook: Required<Book> = {
    isbn: '1234567890123',
    title: 'Test Book',
    subtitle: '',
    authors: ['Test Author'],
    description: 'Test description',
    imageUrl: 'https://example.org/img.jpg',
    createdAt: ''
  };

  beforeEach(async () => {
    bookCreateMock = vi.fn().mockReturnValue(of(validBook));

    await TestBed.configureTestingModule({
      imports: [BookCreatePage],
      providers: [
        { provide: BookStore, useValue: { create: bookCreateMock } },
        provideLocationMocks(),
        provideRouter(routes),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new author field', async () => {
    fixture.nativeElement.querySelector('fieldset button').click();
    await fixture.whenStable();

    const authorInputs = fixture.nativeElement.querySelectorAll('fieldset input[type="text"]');
    expect(authorInputs.length).toBe(2);
  });

  it('should submit form data', () => {
    component['bookForm']().value.set(validBook);
    component.submitForm();

    expect(bookCreateMock).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        ...validBook,
        createdAt: expect.stringContaining(new Date().toISOString().slice(0, 10))
      })
    );
  });

  it('should filter out empty author data', () => {
    component['bookForm'].authors().value.set(
      ['', 'Test Author', '']
    );

    component.submitForm();

    expect(bookCreateMock).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ authors: ['Test Author'] })
    );
  });

  it('should navigate to created book', async () => {
    const location = TestBed.inject(Location);

    component.submitForm();
    await fixture.whenStable();

    expect(location.path()).toEqual('/books/details/1234567890123');
  });
});
