import { Component, input } from '@angular/core';
import { ColorType } from '../params';

@Component({
  selector: 'app-cmn-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  color = input<ColorType>('primary');
  content = input<string>('Button');
}
