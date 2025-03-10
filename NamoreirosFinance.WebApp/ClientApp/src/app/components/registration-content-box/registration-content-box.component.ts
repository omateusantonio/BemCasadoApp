import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-registration-content-box',
  standalone: true,
  imports: [],
  templateUrl: './registration-content-box.component.html',
  styleUrl: './registration-content-box.component.scss'
})
export class RegistrationContentBoxComponent {
  @Input({required: true, alias: 'box-title-text'}) titleText: string = "";
}
