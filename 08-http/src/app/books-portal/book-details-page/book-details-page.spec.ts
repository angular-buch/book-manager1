import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BookDetailsPage } from './book-details-page';

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailsPage],
      providers: [
        provideRouter([]),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsPage, {
      bindings: [
        inputBinding('isbn', () => '1234567890123')
      ]
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
