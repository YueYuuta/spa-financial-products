import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-overlay.component.html',
  styleUrl: './spinner-overlay.component.scss',
})
export class SpinnerOverlayComponent {
  @Input() show: boolean | null = false; // ✅ Controla si se muestra o no
}
