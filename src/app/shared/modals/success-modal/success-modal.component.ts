import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.sass']
})
export class SuccessModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  get nextBillingDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.closed.emit();
    }
  }
}
