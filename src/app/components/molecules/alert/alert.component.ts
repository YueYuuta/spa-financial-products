import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  imports: [CommonModule],
})
export class AlertComponent implements OnInit {
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() message: string = '';
  @Input() dismissible: boolean = false; // ✅ Para permitir cerrar manualmente
  @Input() autoCloseTime?: number; // ✅ Tiempo en ms para cerrar automáticamente

  show: boolean = true; // ✅ Controla la visibilidad del alerta

  ngOnInit(): void {
    if (this.autoCloseTime) {
      setTimeout(() => this.closeAlert(), this.autoCloseTime);
    }
  }

  closeAlert(): void {
    this.show = false;
  }
}
