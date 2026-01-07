import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Book } from '../../shared/book';
import { IsbnFormatPipe } from '../../shared/isbn-format.pipe';

@Component({
  selector: 'app-book-card',
  imports: [RouterLink, IsbnFormatPipe],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  readonly book = input.required<Book>();
  readonly like = output<Book>();

  likeBook() {
    this.like.emit(this.book());
  }
}
