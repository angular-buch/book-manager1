import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { delay, of } from 'rxjs';
import { Mock } from 'vitest';

import { BookStore } from '../shared/book-store';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let bookStoreSearchMock: Mock;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(async () => {
    bookStoreSearchMock = vi.fn().mockReturnValue(
      of([]).pipe(delay(100))
    );
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        {
          provide: BookStore,
          useValue: { search: bookStoreSearchMock }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    TestBed.tick();
    await fixture.whenStable();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter search terms shorter than 3 characters', () => {
    component['searchTerm$'].next('ab');
    vi.advanceTimersByTime(500);

    expect(bookStoreSearchMock).not.toHaveBeenCalled();
  });

  it('should search when term is 3 or more characters', () => {
    component['searchTerm$'].next('abc');
    vi.advanceTimersByTime(500);

    expect(bookStoreSearchMock).toHaveBeenCalledWith('abc');
  });

  it('should debounce search terms', () => {
    component['searchTerm$'].next('test1');
    vi.advanceTimersByTime(499);
    component['searchTerm$'].next('test2');
    vi.advanceTimersByTime(500);

    expect(bookStoreSearchMock).toHaveBeenCalledExactlyOnceWith('test2');
  });

  it('should not search for duplicate consecutive terms', () => {
    component['searchTerm$'].next('test');
    vi.advanceTimersByTime(500);
    component['searchTerm$'].next('test2');
    component['searchTerm$'].next('test');
    vi.advanceTimersByTime(500);

    expect(bookStoreSearchMock).toHaveBeenCalledTimes(1);
  });

  it('should set loading state during search', () => {
    component['searchTerm$'].next('test');
    vi.advanceTimersByTime(500);

    expect(component['isLoading']()).toBe(true);

    vi.advanceTimersByTime(100);

    expect(component['isLoading']()).toBe(false);
  });
});
