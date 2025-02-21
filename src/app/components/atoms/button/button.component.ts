import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
type btnType = 'secondary' | 'primary';
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() type: string = 'submit';
  @Input() label: string = 'Enviar';
  @Output() btnClick = new EventEmitter();
  @Input() btnType: btnType = 'secondary';

  ngOnInit(): void {
    console.log(
      '🚀 ~ ButtonComponent ~ ngOnInit ~ this.disabled:',
      this.disabled
    );
  }

  onBtnClick() {
    this.btnClick.emit();
  }
}
