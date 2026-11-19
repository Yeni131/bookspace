import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'libro/:id',
    loadComponent: () => import('./pages/book-detail/book-detail.page').then((m) => m.BookDetailPage),
  },
];
