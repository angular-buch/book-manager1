import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksOverviewPage } from './books-overview-page';

describe('BooksOverviewPage', () => {
  let fixture: ComponentFixture<BooksOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksOverviewPage);
    await fixture.whenStable();
  });

  it('should render a BookCard component for each book', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const bookCardEls = compiledElement.querySelectorAll('app-book-card');
    expect(bookCardEls.length).toBe(2);
  });

  it('should correctly pass book data to BookCard components', () => {
    const compiledElement: HTMLElement = fixture.nativeElement;
    const bookCardEls = compiledElement.querySelectorAll('app-book-card');

    expect(bookCardEls[0].textContent).toContain('Tierisch gut kochen');
    expect(bookCardEls[1].textContent).toContain('Backen mit Affen');
  });
});
