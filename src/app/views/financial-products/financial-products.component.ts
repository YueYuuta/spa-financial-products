import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-financial-products',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './financial-products.component.html',
  styleUrl: './financial-products.component.scss',
})
export class FinancialProductsComponent {}
