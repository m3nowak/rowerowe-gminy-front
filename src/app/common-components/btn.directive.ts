import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: 'button[appBtn][main], a[appBtn][main], button[appBtn]:not([main]), a[appBtn]:not([main])',
  standalone: true,
})
export class BtnDirective implements OnInit {
  private readonly baseClasses = ['h-12', 'inline-flex', 'items-center', 'rounded-lg', 'px-5', 'py-2.5', 'gap-2', 'text-sm', 'font-medium', 'justify-center'];

  private readonly mainClasses = ['bg-primary-700', 'text-white', 'hover:bg-primary-800', 'focus:ring-primary-300', 'dark:bg-primary-600', 'dark:hover:bg-primary-700'];

  private readonly defaultClasses = [
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
  ];

  private readonly disabledClasses = ['opacity-50', 'cursor-not-allowed'];

  constructor(private el: ElementRef<HTMLButtonElement | HTMLAnchorElement>) {}

  get main(): boolean {
    return this.el.nativeElement.hasAttribute('main');
  }

  get disabled(): boolean {
    return this.el.nativeElement.hasAttribute('disabled');
  }

  ngOnInit() {
    const element = this.el.nativeElement;

    element.setAttribute('type', 'button');

    this.baseClasses.forEach((cls) => element.classList.add(cls));

    const variantClasses = this.main ? this.mainClasses : this.defaultClasses;
    variantClasses.forEach((cls) => element.classList.add(cls));

    if (this.disabled) {
      this.disabledClasses.forEach((cls) => element.classList.add(cls));
    }
  }
}
