import { Component, Input } from '@angular/core';
import {MatInputModule} from '@angular/material/input'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 

@Component({
  selector: 'app-registration-content-box',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule],
  templateUrl: './registration-content-box.component.html',
  styleUrl: './registration-content-box.component.scss'
})
export class RegistrationContentBoxComponent {
  @Input({required: true, alias: 'box-title-text'}) titleText: string = "";
}
