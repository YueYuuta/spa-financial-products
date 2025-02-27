import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: 'financial-products',
  //   loadComponent: () =>
  //     import('./views/financial-products/financial-products.component').then(
  //       (c) => c.FinancialProductsComponent
  //     ),
  //   children: [
  //     {
  //       path: 'list',
  //       loadComponent: () =>
  //         import('./pages/product-list/product-list.component').then(
  //           (c) => c.ProductListComponent
  //         ),
  //     },
  //     {
  //       path: 'create',
  //       loadComponent: () =>
  //         import('./pages/create-product/create-product.component').then(
  //           (c) => c.CreateProductComponent
  //         ),
  //     },
  //     {
  //       path: 'update',
  //       loadComponent: () =>
  //         import('./pages/update-product/update-product.component').then(
  //           (c) => c.UpdateProductComponent
  //         ),
  //     },
  //     { path: '', redirectTo: 'list', pathMatch: 'full' }, // ✅ Redirige a `list` por defecto
  //   ],
  // },
  // { path: '**', redirectTo: 'financial-products/list', pathMatch: 'full' },
];
