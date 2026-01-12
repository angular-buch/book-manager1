import { inject, Injectable } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookStore {
  #http = inject(HttpClient);
  #apiUrl = 'https://api1.angular-buch.com';

  getAll(searchTerm: () => string): HttpResourceRef<Book[]> {
    return httpResource<Book[]>(
      () => ({
        url: `${this.#apiUrl}/books`,
        params: { filter: searchTerm() }
      }),
      { defaultValue: [] }
    );
  }

  getSingle(isbn: () => string): HttpResourceRef<Book | undefined> {
    return httpResource<Book>(
      () => `${this.#apiUrl}/books/${isbn()}`
    );
  }

  remove(isbn: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/books/${isbn}`);
  }

  create(book: Book): Promise<Book> {
    return firstValueFrom(
      this.#http.post<Book>(`${this.#apiUrl}/books`, book)
    );
  }

  search(searchTerm: string): Observable<Book[]> {
    return this.#http.get<Book[]>(
      `${this.#apiUrl}/books`,
      { params: { filter: searchTerm } }
    );
  }
}
