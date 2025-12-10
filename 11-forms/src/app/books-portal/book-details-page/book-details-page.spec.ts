import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsPage } from './book-details-page';

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
