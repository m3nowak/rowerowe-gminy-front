import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, MainLayoutComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Rowerowe Gminy';

  ngOnInit(): void {
    initFlowbite();
  }
}
