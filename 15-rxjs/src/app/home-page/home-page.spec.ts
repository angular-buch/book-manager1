import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { delay, of } from 'rxjs';
import { Mock } from 'vitest';

import { HomePage } from './home-page';
import { routes } from '../app.routes';
import { BookStore } from '../shared/book-store';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let searchFn: Mock;

  beforeAll(() => vi.useFakeTimers());

  beforeEach(async () => {
    searchFn = vi.fn().mockReturnValue(
      of([]).pipe(delay(100))
    );
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter(routes),
        {
          provide: BookStore,
          useValue: { search: searchFn }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    TestBed.tick();
    await fixture.whenStable();
  });

  afterAll(() => vi.useRealTimers());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the HomePage component for /home', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/home', HomePage);

    expect(component).toBeTruthy();
    expect(document.title).toBe('BookManager');
  });

  it('should filter search terms shorter than 3 characters', () => {
    component['searchTerm$'].next('ab');
    vi.advanceTimersByTime(500);

    expect(searchFn).not.toHaveBeenCalled();
  });

  it('should search when term is 3 or more characters', () => {
    component['searchTerm$'].next('abc');
    vi.advanceTimersByTime(500);

    expect(searchFn).toHaveBeenCalledWith('abc');
  });

  it('should debounce search terms', () => {
    component['searchTerm$'].next('test1');
    vi.advanceTimersByTime(300);
    component['searchTerm$'].next('test2');
    vi.advanceTimersByTime(500);

    expect(searchFn).toHaveBeenCalledExactlyOnceWith('test2');
  });

  it('should not search for duplicate consecutive terms', () => {
    component['searchTerm$'].next('test');
    vi.advanceTimersByTime(500);
    component['searchTerm$'].next('test2');
    component['searchTerm$'].next('test');
    vi.advanceTimersByTime(500);

    expect(searchFn).toHaveBeenCalledTimes(1);
  });

  it('should set loading state during search', () => {
    component['searchTerm$'].next('test');
    vi.advanceTimersByTime(500);

    expect(component['isLoading']()).toBe(true);

    vi.advanceTimersByTime(100);

    expect(component['isLoading']()).toBe(false);
  });
});
