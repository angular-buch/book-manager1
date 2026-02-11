import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Mock } from 'vitest';

import { routes } from '../../app.routes';
import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';
import { BookCreatePage } from './book-create-page';

describe('BookCreatePage', () => {
  let component: BookCreatePage;
  let fixture: ComponentFixture<BookCreatePage>;
  let createFn: Mock;

  const validBook = {
    isbn: '1234567890123',
    title: 'Test Book',
    subtitle: '',
    authors: ['Test Author'],
    description: 'Test description',
    imageUrl: 'https://example.org/img.jpg',
    createdAt: '',
  };

  beforeEach(async () => {
    createFn = vi.fn().mockResolvedValue(validBook);

    await TestBed.configureTestingModule({
      imports: [BookCreatePage],
      providers: [
        { provide: BookStore, useValue: { create: createFn } },
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
    expect(authorInputs).toHaveLength(2);
  });

  it('should submit form data', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15'));

    component['bookForm']().value.set(validBook);
    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));

    expect(createFn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        ...validBook,
        createdAt: '2026-01-15T00:00:00.000Z'
      })
    );

    vi.useRealTimers();
  });

  it('should not submit form data when form is invalid', () => {
    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));
    expect(createFn).not.toHaveBeenCalled();
  });

  it('should filter out empty author data', () => {
    component['bookForm']().value.set(validBook);
    component['bookForm'].authors().value.set(
      ['', 'Test Author', '']
    );

    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));

    expect(createFn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ authors: ['Test Author'] })
    );
  });

  it('should navigate to created book', async () => {
    const location = TestBed.inject(Location);

    component['bookForm']().value.set(validBook);
    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(location.path()).toBe('/books/details/1234567890123');
  });

  it('should validate ISBN field', () => {
    const isbnState = component['bookForm'].isbn();

    // Prüfung: required
    isbnState.markAsTouched();
    expect(isbnState.errors()).toHaveLength(1);
    expect(isbnState.errors()[0].kind).toBe('required');

    // Prüfung: minLength
    isbnState.value.set('123456789012');
    expect(isbnState.errors()).toHaveLength(1);
    expect(isbnState.errors()[0].kind).toBe('minLength');

    // Prüfung: maxLength
    isbnState.value.set('12345678901234');
    expect(isbnState.errors()).toHaveLength(1);
    expect(isbnState.errors()[0].kind).toBe('maxLength');

    // Prüfung: gültiger Wert
    isbnState.value.set('1234567890123');
    expect(isbnState.errors()).toEqual([]);
  });

  it('should display an error message for a field and mark it as invalid', async () => {
    const descriptionState = component['bookForm'].description();
    const textareaEl = fixture.nativeElement.querySelector('textarea');
    let textareaMessageEl = fixture.nativeElement.querySelector('#description-error');

    expect(textareaEl.hasAttribute('aria-errormessage')).toBe(false);
    expect(textareaEl.hasAttribute('aria-invalid')).toBe(false);
    expect(textareaMessageEl).toBeNull();

    descriptionState.markAsTouched();
    await fixture.whenStable();

    textareaMessageEl = fixture.nativeElement.querySelector('#description-error');
    expect(textareaEl.getAttribute('aria-errormessage')).toBe('description-error');
    expect(textareaEl.getAttribute('aria-invalid')).toBe('true');
    expect(textareaMessageEl.textContent).toBe('Description is required.');

    descriptionState.value.set('my description');
    await fixture.whenStable();

    textareaMessageEl = fixture.nativeElement.querySelector('#description-error');
    expect(textareaEl.hasAttribute('aria-errormessage')).toBe(false);
    expect(textareaEl.getAttribute('aria-invalid')).toBe('false');
    expect(textareaMessageEl).toBeNull();
  });
});
