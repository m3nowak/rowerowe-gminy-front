import { Component } from '@angular/core';
import { PageLayoutTextComponent } from '../../common-components/page-layout-text/page-layout-text.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  imports: [PageLayoutTextComponent, RouterLink],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css',
})
export class AboutPageComponent {}
