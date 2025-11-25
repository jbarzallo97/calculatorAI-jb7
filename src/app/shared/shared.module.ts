import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Standalone component: se importa (no se declara) y se reexporta
import { SubscriptionModalComponent } from './modals/subscription-modal/subscription-modal.component';
import { GlobeSceneComponent } from './modals/globe-scene/globe-scene.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SubscriptionModalComponent, GlobeSceneComponent],
  exports: [SubscriptionModalComponent],
  declarations: [
    // GlobeSceneComponent
  ]
})
export class SharedModule {}


