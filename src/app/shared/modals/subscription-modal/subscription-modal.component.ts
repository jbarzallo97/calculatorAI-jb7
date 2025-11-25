import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobeSceneComponent } from '../globe-scene/globe-scene.component';

@Component({
  selector: 'app-premium-modal',
  standalone: true,
  imports: [CommonModule, GlobeSceneComponent],
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.sass'],
})
export class SubscriptionModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() subscribed = new EventEmitter<void>();

  isProcessing = false;

  onOverlayClick(e: MouseEvent): void {
    const t = e.target as HTMLElement | null;
    if (t && t.classList.contains('fixed')) this.closed.emit();
  }

  onSubscribeClick(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;

    setTimeout(() => {
      this.subscribed.emit();
      this.isProcessing = false;
    }, 2000);
  }
}
