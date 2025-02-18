import { Component } from '@angular/core';
import { RegistrationContentBoxComponent } from "../../components/registration-content-box/registration-content-box.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-financial-entry-registration',
  standalone: true,
  imports: [RegistrationContentBoxComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './financial-entry-registration.component.html',
  styleUrl: './financial-entry-registration.component.css'
})
export class FinancialEntryRegistrationComponent {
  financialEntryForm: FormGroup;
  teste: Date = new Date();

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
    this.financialEntryForm = this.formBuilder.group({
      transactionDescription: ["", Validators.required],
      transactionValue: ["", [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\,\d{1,2})?$/)]],
      transactionDate: ["", Validators.required],
      transactionType: ["Entrada", Validators.required]
    })
  }

  async onSubmit() {
    this.httpClient.get("http://localhost:5214/api/FinancialEntry/v1", {responseType: 'json'})
                  .subscribe((response) => {
                    debugger
                    console.log(response);
                  });
  }
  
}
