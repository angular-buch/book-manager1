import { inputBinding, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';

import { BooksOverviewPage } from './books-overview-page';
import { Book } from '../../shared/book';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;
  let httpTesting: HttpTestingController;

  const searchSignal = signal<string | undefined>(undefined);

  beforeEach(async () => {
    searchSignal.set(undefined);

    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage],
      providers: [
        provideRouter([]),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(BooksOverviewPage, {
      bindings: [
        inputBinding('search', searchSignal)
      ]
    });
    component = fixture.componentInstance;

    TestBed.tick();
    httpTesting.expectOne(() => true).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should update searchTerm when query param changes', async () => {
    searchSignal.set('Angular');
    TestBed.tick();
    httpTesting
      .expectOne(r => r.params.get('filter') === 'Angular')
      .flush([]);
    await fixture.whenStable();

    expect(component['searchTerm']()).toBe('Angular');
  });

  it('should sync searchTerm to URL via Router', async () => {
    const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate');

    component['searchTerm'].set('Angular');
    TestBed.tick();
    httpTesting
      .expectOne(r => r.params.get('filter') === 'Angular')
      .flush([]);

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: { search: 'Angular' }
    });
  });

  it('should integrate search, httpResource, and router sync', async () => {
    const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate');
    const testBook: Partial<Book> = { isbn: '123', title: 'Angular' };

    searchSignal.set('Angular');
    TestBed.tick();
    httpTesting
      .expectOne(r => r.params.get('filter') === 'Angular')
      .flush([testBook]);
    await fixture.whenStable();

    expect(component['books'].value()).toEqual([testBook]);
    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: { search: 'Angular' }
    });
  });
});

describe('BooksOverviewPage (with initial search)', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;
  let httpTesting: HttpTestingController;

  const searchSignal = signal<string | undefined>('Angular');
  const testBook: Partial<Book> = { isbn: '123', title: 'Angular' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage],
      providers: [
        provideRouter([]),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(BooksOverviewPage, {
      bindings: [
        inputBinding('search', searchSignal)
      ]
    });
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should load books with search term from URL', async () => {
    TestBed.tick();
    httpTesting
      .expectOne(r => r.params.get('filter') === 'Angular')
      .flush([testBook]);
    await fixture.whenStable();

    expect(component['books'].value()).toEqual([testBook]);
  });
});
