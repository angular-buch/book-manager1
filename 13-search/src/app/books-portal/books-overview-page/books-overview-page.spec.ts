import { inputBinding, resource, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Mock } from 'vitest';

import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';
import { booksPortalRoutes } from '../books-portal.routes';
import { BooksOverviewPage } from './books-overview-page';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;
  let getAllMock: Mock;

  const searchSignal = signal<string | undefined>(undefined);
  const mockBooks: Partial<Book>[] = [
    { isbn: '1234', title: 'Tierisch gut kochen' },
    { isbn: '5678', title: 'Backen mit Affen' }
  ];

  beforeEach(async () => {
    searchSignal.set(undefined);
    getAllMock = vi.fn().mockResolvedValue(mockBooks);

    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage],
      providers: [
        provideRouter(booksPortalRoutes),
        {
          provide: BookStore,
          useFactory: () => ({
            getAll: (searchTerm: () => string) => resource({
              params: searchTerm,
              loader: getAllMock,
            })
          })
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksOverviewPage, {
      bindings: [inputBinding('search', searchSignal)]
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of 2 books with correct titles', () => {
    const books = component['books'].value();

    expect(books).toHaveLength(2);
    expect(books[0].title).toBe('Tierisch gut kochen');
    expect(books[1].title).toBe('Backen mit Affen');
  });

  it('should render the correct book titles', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const articleEls = compiledElement.querySelectorAll('article');

    expect(articleEls).toHaveLength(2);
    expect(articleEls[0].textContent).toContain('Tierisch gut kochen');
    expect(articleEls[1].textContent).toContain('Backen mit Affen');
  });

  it('should render a BookCard component for each book', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const bookCardEls = compiledElement.querySelectorAll('app-book-card');
    expect(bookCardEls).toHaveLength(2);
  });

  it('should correctly pass book data to BookCard components', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const bookCardEls = compiledElement.querySelectorAll('app-book-card');

    expect(bookCardEls[0].textContent).toContain('Tierisch gut kochen');
    expect(bookCardEls[1].textContent).toContain('Backen mit Affen');
  });

  it('should load the BooksOverviewPage for /books', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/books', BooksOverviewPage);

    expect(component).toBeTruthy();
    expect(document.title).toBe('Books');
  });

  it('should ask service initially for books', async () => {
    expect(getAllMock).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: '' })
    );

    expect(component['searchTerm']()).toBe('');
  });

  it('should update searchTerm when query param changes', async () => {
    searchSignal.set('Angular');
    await fixture.whenStable();

    expect(getAllMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ params: 'Angular' })
    );

    expect(component['searchTerm']()).toBe('Angular');
  });

  it('should sync searchTerm to URL via Router', async () => {
    const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate');

    component['searchTerm'].set('Angular');
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: { search: 'Angular' }
    });
  });
});
