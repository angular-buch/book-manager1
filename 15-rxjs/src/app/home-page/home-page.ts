import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, debounceTime, distinctUntilChanged, switchMap, tap, Subject } from 'rxjs';

import { BookStore } from '../shared/book-store';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  #bookStore = inject(BookStore);

  protected searchTerm$ = new Subject<string>();
  protected isLoading = signal(false);

  protected results = toSignal(
    this.searchTerm$.pipe(
      filter(term => term.length >= 3),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.isLoading.set(true)),
      switchMap(term => this.#bookStore.search(term)),
      tap(() => this.isLoading.set(false)),
    ),
    { initialValue: [] }
  );
}
