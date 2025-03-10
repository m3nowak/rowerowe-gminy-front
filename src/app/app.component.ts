import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

import { initFlowbite } from 'flowbite';
import { filter, Observable, Subscription } from 'rxjs';
import posthog from 'posthog-js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, MainLayoutComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Rowerowe Gminy';

  navigationEnd!: Observable<NavigationEnd>;
  navigationSub!: Subscription;

  router = inject(Router);

  ngOnInit(): void {
    initFlowbite();

    this.navigationEnd = this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
    ) as Observable<NavigationEnd>;

    this.navigationSub = this.navigationEnd.subscribe(() => {
      posthog.capture('$pageview');
    });
  }

  ngOnDestroy(): void {
    this.navigationSub.unsubscribe();
    posthog.capture('$pageleave');
  }
}
