import { Component } from '@angular/core';
import { AppMainbackgroundComponent } from "../../components/app-main-layout/app-main-background.component";
import { RegistrationContentBoxComponent } from "../../components/registration-content-box/registration-content-box.component";

@Component({
  selector: 'app-financial-entry-registration',
  standalone: true,
  imports: [AppMainbackgroundComponent, RegistrationContentBoxComponent],
  templateUrl: './financial-entry-registration.component.html',
  styleUrl: './financial-entry-registration.component.scss'
})
export class FinancialEntryRegistrationComponent {

}
