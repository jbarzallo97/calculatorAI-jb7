import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SubscriptionModalComponent } from '../../shared/modals/subscription-modal/subscription-modal.component';
import { SuccessModalComponent } from '../../shared/modals/success-modal/success-modal.component';

type Operator = '+' | '-' | 'x' | '÷' | '%';


@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, SharedModule, SubscriptionModalComponent, SuccessModalComponent],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.sass']
})
export class CalculatorComponent {
  expression = '';
  display = '0';
  premiumOpen = false;
  successOpen = false;

  constructor(private cdr: ChangeDetectorRef) {}

  pressNumber(n: string) {
    if (this.display === '0' && n !== '.') this.display = n;
    else if (n === '.' && this.display.includes('.')) return;
    else this.display += n;
  }

  pressOperator(op: Operator) {
    this.premiumOpen = true;
    this.commitCurrent();
    if (this.expression.endsWith(' ')) {
      this.expression = this.expression.slice(0, -3);
    }
    this.expression = `${this.expression} ${op} `;
  }

  clearAll() {
    this.expression = '';
    this.display = '0';
  }

  negate() {
    this.premiumOpen = true;
    if (this.display === '0') return;
    this.display = this.display.startsWith('-') ? this.display.slice(1) : `-${this.display}`;
  }

  percent() {
    this.premiumOpen = true;
    const val = parseFloat(this.display || '0') / 100;
    this.display = this.toDisplay(val);
  }

  openModal() {
    this.premiumOpen = true;
    this.cdr.detectChanges();
  }

  equals() {
    this.premiumOpen = true;
    this.cdr.detectChanges();
    // La operación se desactiva - solo se abre el modal premium
  }

  onSubscribed() {
    this.premiumOpen = false;
    this.successOpen = true;
  }

  private commitCurrent() {
    if (this.display !== '') {
      if (this.expression.endsWith(' ')) this.expression += this.display;
      else this.expression += (this.expression ? '' : '') + this.display;
      this.display = '';
    }
  }

  private toDisplay(n: number) {
    if (!isFinite(n)) return 'Error';
    const s = n.toString();
    return s.length > 12 ? n.toExponential(6) : s;
  }
}
