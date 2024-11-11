import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [],
  templateUrl: './btn.component.html',
})
export class BtnComponent {
  main = input(false);

  btnClass = computed(() => {
    const clasess = ['h-12', 'flex', 'flex-row', 'items-center', 'rounded-lg', 'px-5', 'py-2.5', 'text-sm', 'font-medium'];

    if (this.main()) {
      return clasess.concat(['bg-primary-700', 'text-white', 'hover:bg-primary-800', 'focus:ring-primary-300', 'dark:bg-primary-600', 'dark:hover:bg-primary-700']);
    } else {
      return clasess.concat([
        'border',
        'border-gray-200',
        'bg-white',
        'text-gray-900',
        'hover:bg-gray-100',
        'hover:text-primary-700',
        'dark:border-gray-600',
        'dark:bg-gray-800',
        'dark:text-gray-400',
        'dark:hover:bg-gray-700',
        'dark:hover:text-white',
      ]);
    }
  });
}
