import { Component } from '@angular/core';
import { RegistrationContentBoxComponent } from "../../components/registration-content-box/registration-content-box.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-financial-entry-registration',
  standalone: true,
  imports: [RegistrationContentBoxComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './financial-entry-registration.component.html',
  styleUrl: './financial-entry-registration.component.css'
})
export class FinancialEntryRegistrationComponent {
  financialEntryForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.financialEntryForm = this.formBuilder.group({
      transactionDescription: ["", Validators.required],
      transactionValue: ["", [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\,\d{1,2})?$/)]],
      transactionDate: ["", Validators.required],
      transactionType: ["Entrada", Validators.required]
    })
  }
  
}
