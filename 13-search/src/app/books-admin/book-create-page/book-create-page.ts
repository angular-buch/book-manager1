import { Component, inject, signal } from '@angular/core';
import { FormField, FieldTree, form, maxLength, minLength, required, schema, validate, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';

type BookFormData = Required<Book>;

export const bookFormSchema = schema<BookFormData>((path) => {
  required(path.title, { message: 'Title is required.' });
  required(path.isbn, { message: 'ISBN is required.' });
  minLength(path.isbn, 13, { message: 'ISBN must have 13 digits.' });
  maxLength(path.isbn, 13, { message: 'ISBN must have 13 digits.' });
  validate(path.authors, (ctx) =>
    !ctx.value().some((a) => a)
      ? {
        kind: 'atLeastOneAuthor',
        message: 'At least one author is required.'
      }
      : undefined
  );
  required(path.description, { message: 'Description is required.' });
  required(path.imageUrl, { message: 'URL is required.' });
});

@Component({
  selector: 'app-book-create-page',
  imports: [FormField],
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
    submit(this.bookForm, async (bookForm) => {
      const formValue = bookForm().value();
      const authors = formValue.authors.filter(author => !!author);

      const newBook: Book = {
        ...formValue,
        authors,
        createdAt: new Date().toISOString()
      };

      const createdBook = await this.#bookStore.create(newBook);
      await this.#router.navigate(['/books', 'details', createdBook.isbn]);
    });

    return false; // prevent reload
  }
}
