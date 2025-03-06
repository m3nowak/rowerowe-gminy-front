import { Component } from '@angular/core';
import { PageLayoutTextComponent } from '../../common-components/page-layout-text/page-layout-text.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tos-page',
  imports: [PageLayoutTextComponent, RouterLink],
  templateUrl: './tos-page.component.html',
  styleUrl: './tos-page.component.css',
})
export class TosPageComponent {}
