import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCreatePage } from './book-create-page';

describe('BookCreatePage', () => {
  let component: BookCreatePage;
  let fixture: ComponentFixture<BookCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCreatePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
