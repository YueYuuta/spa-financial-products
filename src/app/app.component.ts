import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductStateService } from './store/signal/test.signal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'spa-financial-products';
  private readonly store = inject(ProductStateService);
  error = this.store.get('error');
  sendError() {
    this.store.set('error', Math.random().toString());
  }
}
