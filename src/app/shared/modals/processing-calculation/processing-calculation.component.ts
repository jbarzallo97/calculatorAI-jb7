import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-processing-calculation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './processing-calculation.component.html',
  styleUrls: ['./processing-calculation.component.sass']
})
export class ProcessingCalculationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  progress = 0;
  currentMessage = 'Connecting to quantum computing cluster...';
  private progressInterval?: any;
  private messageTimeout?: any;

  messages = [
    // 'Connecting to quantum computing cluster...',
    'Analyzing input data',
    // 'Processing calculation',
    'Finalizing results...'
  ];
  currentMessageIndex = 0;

  ngOnInit(): void {
    if (this.open) {
      this.startProcessing();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (changes['open'].currentValue) {
        this.startProcessing();
      } else {
        this.stopProcessing();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopProcessing();
  }

  startProcessing(): void {
    this.progress = 0;
    this.currentMessageIndex = 0;
    this.currentMessage = this.messages[0];

    // Simular progreso
    this.progressInterval = setInterval(() => {
      this.progress += 2;
      if (this.progress >= 100) {
        this.progress = 100;
        this.stopProcessing();
        setTimeout(() => {
          this.completed.emit();
        }, 500);
      }
    }, 60);

    // Cambiar mensajes
    this.messageTimeout = setTimeout(() => {
      this.currentMessageIndex = 1;
      this.currentMessage = this.messages[1];
    }, 2000);
  }

  stopProcessing(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
      this.messageTimeout = undefined;
    }
  }
}
