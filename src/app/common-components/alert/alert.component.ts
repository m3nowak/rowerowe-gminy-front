import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

type AlertType = 'success' | 'info' | 'warning' | 'danger' | 'standard';
@Component({
  selector: 'app-alert',
  imports: [NgClass],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  type = input.required<AlertType>();

  classes = computed(() => ['mb-4', 'rounded-lg', 'p-4', 'text-sm', 'border', this.type()]);
}
