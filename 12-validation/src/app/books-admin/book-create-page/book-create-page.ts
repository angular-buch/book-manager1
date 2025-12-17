import { Component, inject, signal } from '@angular/core';
import { customError, Field, FieldTree, form, maxLength, minLength, required, schema, submit, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';

type BookFormData = Required<Book>;

export const bookFormSchema = schema<BookFormData>((path) => {
  required(path.title);
  required(path.isbn);
  minLength(path.isbn, 13);
  maxLength(path.isbn, 13);
  validate(path.authors, (ctx) =>
    !ctx.value().some((a) => a)
      ? { kind: 'atLeastOneAuthor' }
      : undefined
  );
  required(path.description);
  required(path.imageUrl);
});

@Component({
  selector: 'app-book-create-page',
  imports: [Field],
  templateUrl: './book-create-page.html',
  styleUrl: './book-create-page.scss'
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
  protected readonly bookForm = form(this.#bookFormData, bookFormSchema);

  addAuthorField() {
    this.bookForm.authors().value.update((authors) => [...authors, '']);
  }

  isInvalid(field: FieldTree<unknown>): boolean | null {
    if (!field().touched()) {
      return null;
    }
    return field().invalid();
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
