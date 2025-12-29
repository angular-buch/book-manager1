import { Component, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Book } from '../../shared/book';
import { BookCard } from '../book-card/book-card';
import { BookStore } from '../../shared/book-store';

@Component({
  selector: 'app-books-overview-page',
  imports: [BookCard],
  templateUrl: './books-overview-page.html',
  styleUrl: './books-overview-page.scss',
})
export class BooksOverviewPage {
  #bookStore = inject(BookStore);
  #router = inject(Router);

  readonly search = input<string>();
  protected searchTerm = linkedSignal(() => this.search() || '');

  protected books = this.#bookStore.getAll(() => this.searchTerm());
  protected likedBooks = signal<Book[]>([]);

  constructor() {
    effect(() => {
      this.#router.navigate([], {
        queryParams: {
          search: this.searchTerm() || null
        }
      });
    });
  }

  addLikedBook(newLikedBook: Book) {
    const foundBook = this.likedBooks().find(
      (b) => b.isbn === newLikedBook.isbn
    );

    if (!foundBook) {
      this.likedBooks.update((likedBooks) => [...likedBooks, newLikedBook]);
    }
  }

  clearLikedBooks() {
    this.likedBooks.set([]);
  }
}
