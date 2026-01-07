import { Component, inject, signal } from '@angular/core';
import { Field, form, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';

type BookFormData = Required<Book>;

@Component({
  selector: 'app-book-create-page',
  imports: [Field],
  templateUrl: './book-create-page.html',
  styleUrl: './book-create-page.css'
})
export class BookCreatePage {
  #bookStore = inject(BookStore);
  #router = inject(Router);

  readonly #bookFormData = signal<BookFormData>({
    isbn: '',
    title: '',
    subtitle: '',
    authors: [''],
    description: '',
    imageUrl: '',
    createdAt: '',
  });
  protected readonly bookForm = form(this.#bookFormData);

  addAuthorField() {
    this.bookForm.authors().value.update((authors) => [...authors, '']);
  }

  submitForm() {
    const formValue = this.bookForm().value();
    const authors = formValue.authors.filter(author => !!author);

    const newBook: Book = {
      ...formValue,
      authors,
      createdAt: new Date().toISOString()
    };

    this.#bookStore.create(newBook).subscribe(createdBook => {
      this.#router.navigate(['/books', 'details', createdBook.isbn]);
    });

    return false; // prevent reload
  }
}
