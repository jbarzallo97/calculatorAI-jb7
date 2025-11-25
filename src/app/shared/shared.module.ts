import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Standalone component: se importa (no se declara) y se reexporta
import { SubscriptionModalComponent } from './modals/subscription-modal/subscription-modal.component';
import { GlobeSceneComponent } from './modals/globe-scene/globe-scene.component';
import { ProcessingCalculationComponent } from './modals/processing-calculation/processing-calculation.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SubscriptionModalComponent, GlobeSceneComponent, ProcessingCalculationComponent],
  exports: [SubscriptionModalComponent],
  declarations: []
})
export class SharedModule {}


