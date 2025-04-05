import { Component, inject, signal, OnDestroy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerX } from '@ng-icons/tabler-icons';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-host',
  imports: [NgIcon],
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.css',
  providers: [provideIcons({ tablerX })],
})
export class ToastHostComponent implements OnDestroy {
  toastSvc = inject(ToastService);

  toastVisible = signal(false);

  toastSub = this.toastSvc.logoutToast$.subscribe(() => {
    this.toastVisible.set(true);
  });

  hideToast() {
    this.toastVisible.set(false);
  }
  ngOnDestroy() {
    this.toastSub.unsubscribe();
  }
}
