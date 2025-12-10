import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksOverviewPage } from './books-overview-page';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;

  // Arrange
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksOverviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should have a list of 2 books', () => {
    // Act
    // Daten aus Signal auslesen, dieses wird bereits im Konstruktor gesetzt
    const books = component['books']();

    // Assert
    expect(books.length).toBe(2);
    expect(books[0].title).toContain('Tierisch gut kochen');
    expect(books[1].title).toContain('Backen mit Affen');
  });

  it('should render the correct book titles', () => {
    // Act
    // Durch detectChanges() wird das Template "gerendert"
    fixture.detectChanges();

    // Im gerenderten DOM nach dem Tag <article> suchen
    const compiledElement: HTMLElement = fixture.nativeElement;
    const articleEls = compiledElement.querySelectorAll('article');

    // Assert
    expect(articleEls.length).toBe(2);
    expect(articleEls[0].textContent).toContain('Tierisch gut kochen');
    expect(articleEls[1].textContent).toContain('Backen mit Affen');
  });
});
