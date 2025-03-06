import { Component } from '@angular/core';
import { PageLayoutTextComponent } from '../../common-components/page-layout-text/page-layout-text.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gdpr-page',
  imports: [PageLayoutTextComponent, RouterLink],
  templateUrl: './gdpr-page.component.html',
  styleUrl: './gdpr-page.component.css',
})
export class GdprPageComponent {}
