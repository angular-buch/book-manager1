import { ComponentFixture, TestBed } from '@angular/core/testing';
import { inputBinding, resource, signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Mock } from 'vitest';

import { BooksOverviewPage } from './books-overview-page';
import { booksPortalRoutes } from '../books-portal.routes';
import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;
  let getAllFn: Mock;

  const searchSignal = signal<string | undefined>(undefined);
  const mockBooks: Partial<Book>[] = [
    { isbn: '1234', title: 'Tierisch gut kochen' },
    { isbn: '5678', title: 'Backen mit Affen' }
  ];

  beforeEach(async () => {
    searchSignal.set(undefined);
    getAllFn = vi.fn().mockResolvedValue(mockBooks);

    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage],
      providers: [
        provideRouter(booksPortalRoutes),
        {
          provide: BookStore,
          useFactory: () => ({
            getAll: (searchTerm: () => string) => resource({
              params: searchTerm,
              loader: getAllFn,
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

  it('should have 2 books with correct titles', () => {
    const books = component['books'].value();

    expect(books).toHaveLength(2);
    expect(books[0].title).toBe('Tierisch gut kochen');
    expect(books[1].title).toBe('Backen mit Affen');
  });

  it('should render the correct book titles', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const articleEls = hostEl.querySelectorAll('article');

    expect(articleEls).toHaveLength(2);
    expect(articleEls[0].textContent).toContain('Tierisch gut kochen');
    expect(articleEls[1].textContent).toContain('Backen mit Affen');
  });

  it('should render a BookCard component for each book', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const cardEls = hostEl.querySelectorAll('app-book-card');
    expect(cardEls).toHaveLength(2);
  });

  it('should correctly pass book data to BookCards', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const cardEls = hostEl.querySelectorAll('app-book-card');

    expect(cardEls[0].textContent).toContain('Tierisch gut kochen');
    expect(cardEls[1].textContent).toContain('Backen mit Affen');
  });

  it('should ask service initially for books', async () => {
    expect(getAllFn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: '' })
    );

    expect(component['searchTerm']()).toBe('');
  });

  it('should update term on query param change', async () => {
    searchSignal.set('Angular');
    await fixture.whenStable();

    expect(getAllFn).toHaveBeenLastCalledWith(
      expect.objectContaining({ params: 'Angular' })
    );

    expect(component['searchTerm']()).toBe('Angular');
  });

  it('should sync searchTerm to URL via Router', async () => {
    const navSpy = vi.spyOn(TestBed.inject(Router), 'navigate');

    component['searchTerm'].set('Angular');
    await fixture.whenStable();

    expect(navSpy).toHaveBeenCalledExactlyOnceWith([], {
      queryParams: { search: 'Angular' }
    });
  });

  it('should load BooksOverviewPage for /books', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/', BooksOverviewPage);

    expect(component).toBeTruthy();
    expect(document.title).toBe('Books');
  });
});
