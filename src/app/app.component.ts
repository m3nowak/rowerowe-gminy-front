import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Rowerowe Gminy';

  ngOnInit(): void {
    initFlowbite();
  }
}
