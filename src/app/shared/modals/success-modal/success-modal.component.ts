import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.sass']
})
export class SuccessModalComponent implements OnChanges {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  showCheck = false;
  showInfo = false;
  showButton = false;

  get nextBillingDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && changes['open'].currentValue) {
      // Resetear estados
      this.showCheck = false;
      this.showInfo = false;
      this.showButton = false;

      // Secuencia de animaciones
      setTimeout(() => {
        this.showCheck = true;
      }, 100);

      setTimeout(() => {
        this.showInfo = true;
      }, 600);

      setTimeout(() => {
        this.showButton = true;
      }, 1100);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.closed.emit();
    }
  }
}
