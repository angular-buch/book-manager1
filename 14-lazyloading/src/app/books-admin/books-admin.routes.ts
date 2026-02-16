import { Routes } from '@angular/router';

import { BookCreatePage } from './book-create-page/book-create-page';

export const booksAdminRoutes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full' },
  {
    path: 'create',
    component: BookCreatePage,
    title: 'Create Book'
  },
];
