// Versión mejorada de la calculadora basada en la lógica React original
// Reemplaza tu CalculatorComponent con este código

import { Component, ChangeDetectorRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionModalComponent } from '../../shared/modals/subscription-modal/subscription-modal.component';
import { SuccessModalComponent } from '../../shared/modals/success-modal/success-modal.component';
import { ProcessingCalculationComponent } from '../../shared/modals/processing-calculation/processing-calculation.component';

type Operator = '+' | '-' | '×' | '÷';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule,
    SubscriptionModalComponent,
    SuccessModalComponent,
    ProcessingCalculationComponent
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.sass']
})
export class CalculatorComponent implements OnInit, OnDestroy {
  display = '0';
  equation = '';
  waitingForOperand = false;
  justCalculated = false;
  isPremium = false;

  // Modales
  processingOpen = false;
  premiumOpen = false;
  successOpen = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // El listener se maneja con @HostListener
  }

  ngOnDestroy(): void {
    // Limpieza si es necesaria
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Prevenir comportamiento por defecto solo para teclas que usamos
    const key = event.key;

    // Mapeo de teclas del teclado a funciones de la calculadora
    if (key >= '0' && key <= '9') {
      event.preventDefault();
      this.handleNumber(key);
      return;
    }

    if (key === '.') {
      event.preventDefault();
      this.handleNumber('.');
      return;
    }

    if (key === '+' || key === '-') {
      event.preventDefault();
      this.handleOperator(key as Operator);
      return;
    }

    if (key === '*') {
      event.preventDefault();
      this.handleOperator('×' as Operator);
      return;
    }

    if (key === '/') {
      event.preventDefault();
      this.handleOperator('÷' as Operator);
      return;
    }

    if (key === 'Enter' || key === '=') {
      event.preventDefault();
      this.handleEquals();
      return;
    }

    if (key === 'Escape' || key === 'c' || key === 'C') {
      event.preventDefault();
      this.clearAll();
      return;
    }

    if (key === 'Backspace') {
      event.preventDefault();
      this.handleBackspace();
      return;
    }
  }

  // Propiedad computada para mostrar la ecuación completa
  get fullExpression(): string {
    return this.equation;
  }

  handleButtonClick(value: string): void {
    if (value === '=') {
      this.handleEquals();
      return;
    }

    if (value === 'C') {
      this.clearAll();
      return;
    }

    if (value === '±') {
      this.negate();
      return;
    }

    if (value === '%') {
      this.percent();
      return;
    }

    if (['+', '-', '×', '÷'].includes(value)) {
      this.handleOperator(value as Operator);
      return;
    }

    // Números y punto decimal
    this.handleNumber(value);
  }

  private handleEquals(): void {
    if (this.justCalculated || !this.equation) {
      return;
    }

    // Llamar al callback de cálculo (mostrar modal de procesamiento)
    this.onCalculate();

    // Si no es premium, no calcular (ya se mostró el modal)
    if (!this.isPremium) {
      return;
    }

    // Construir expresión completa
    const fullExpression = this.equation + this.display;

    // Calcular resultado
    const calculatedResult = this.calculateResult(fullExpression);

    if (calculatedResult !== null && calculatedResult !== undefined) {
      this.equation = fullExpression + ' =';
      this.display = this.formatNumber(calculatedResult);
    } else {
      this.equation = fullExpression;
    }

    this.waitingForOperand = true;
    this.justCalculated = true;
  }

  private handleOperator(op: Operator): void {
    if (this.justCalculated) {
      // Si acabamos de calcular, usar el resultado como primer operando
      this.equation = this.display + ' ' + op + ' ';
      this.waitingForOperand = true;
      this.justCalculated = false;
      return;
    }

    if (this.waitingForOperand) {
      // Si estamos esperando un operando, solo cambiar el operador
      this.equation = this.equation.slice(0, -2) + op + ' ';
      return;
    }

    // Agregar el número actual y el operador a la ecuación
    this.equation = this.equation + this.display + ' ' + op + ' ';
    this.waitingForOperand = true;
  }

  private handleNumber(value: string): void {
    if (this.justCalculated) {
      // Si acabamos de calcular, empezar nueva operación
      this.display = value === '.' ? '0.' : value;
      this.equation = '';
      this.waitingForOperand = false;
      this.justCalculated = false;
      return;
    }

    if (this.waitingForOperand || this.display === '0') {
      // Si estamos esperando un operando o el display es 0, reemplazar
      if (value === '.' && this.display === '0') {
        this.display = '0.';
      } else {
        this.display = value;
      }
      this.waitingForOperand = false;
    } else {
      // Agregar al número actual
      if (value === '.' && this.display.includes('.')) {
        return; // No permitir múltiples puntos decimales
      }
      this.display = this.display + value;
    }
  }

   clearAll(): void {
     this.display = '0';
     this.equation = '';
     this.waitingForOperand = false;
     this.justCalculated = false;
   }

   negate(): void {
     const num = parseFloat(this.display);
     if (!isNaN(num)) {
       this.display = (-num).toString();
     }
   }

   percent(): void {
     const num = parseFloat(this.display);
     if (!isNaN(num)) {
       this.display = (num / 100).toString();
     }
   }

   private handleBackspace(): void {
     if (this.display.length > 1 && this.display !== '0') {
       this.display = this.display.slice(0, -1);
     } else {
       this.display = '0';
     }
   }

  private calculateResult(expr: string): number | null {
    try {
      // Reemplazar símbolos de calculadora con operadores JavaScript
      const jsExpression = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s/g, ''); // Eliminar espacios

      if (!jsExpression) {
        return null;
      }

      // Validar que solo contenga números, operadores y paréntesis
      if (!/^[0-9+\-*/().]+$/.test(jsExpression)) {
        throw new Error('Invalid expression');
      }

      // Usar Function constructor para evaluación segura
      const result = new Function(`'use strict'; return (${jsExpression})`)();

      if (!isFinite(result)) {
        throw new Error('Invalid result');
      }

      return result;
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }

  private formatNumber(n: number): string {
    if (!isFinite(n)) {
      return 'Error';
    }

    const s = n.toString();

    // Si el número es muy largo, usar notación científica
    if (s.length > 12) {
      return n.toExponential(6);
    }

    // Limitar decimales si es necesario
    if (s.includes('.')) {
      const parts = s.split('.');
      if (parts[1] && parts[1].length > 8) {
        return n.toFixed(8).replace(/\.?0+$/, '');
      }
    }

    return s;
  }

  // Métodos públicos para el template (mantener compatibilidad)
  pressNumber(n: string): void {
    this.handleButtonClick(n);
  }

  pressOperator(op: string): void {
    // Convertir 'x' a '×' y '÷' si es necesario
    const operator = op === 'x' ? '×' : op === '÷' ? '÷' : op as Operator;
    this.handleButtonClick(operator);
  }

  equals(): void {
    this.handleButtonClick('=');
  }

  // Callback cuando se presiona "=" (mostrar modal de procesamiento)
  private onCalculate(): void {
    if (!this.isPremium) {
      this.processingOpen = true;
      this.cdr.detectChanges();
    }
  }

  onProcessingCompleted(): void {
    this.processingOpen = false;
    this.premiumOpen = true;
  }

  onSubscribed(): void {
    this.premiumOpen = false;
    this.successOpen = true;
    this.isPremium = true; // Activar premium después de suscripción
  }
}

