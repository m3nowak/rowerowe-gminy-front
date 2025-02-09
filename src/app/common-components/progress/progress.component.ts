import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'app-progress',
    imports: [],
    templateUrl: './progress.component.html'
})
export class ProgressComponent {
  progress = input<number | undefined>(undefined);
  isIndeterminate = computed(() => this.progress() === undefined);
  barStyle = computed(() => {
    if (this.progress() === undefined) {
      return {};
    }
    const percent = Math.max(0, Math.min(100, this.progress() || 0));
    return { width: `${percent}%` };
  });
}
