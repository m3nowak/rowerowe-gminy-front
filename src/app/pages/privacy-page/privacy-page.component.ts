import { Component } from '@angular/core';
import { PageLayoutTextComponent } from '../../common-components/page-layout-text/page-layout-text.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-page',
  imports: [PageLayoutTextComponent, RouterLink],
  templateUrl: './privacy-page.component.html',
  styleUrl: './privacy-page.component.css',
})
export class PrivacyPageComponent {}
