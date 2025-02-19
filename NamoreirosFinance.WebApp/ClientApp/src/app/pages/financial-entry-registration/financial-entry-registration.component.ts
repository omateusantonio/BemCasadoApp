import { Component } from '@angular/core';
import { RegistrationContentBoxComponent } from "../../components/registration-content-box/registration-content-box.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FinancialEntryService } from '../../shared/services/financial-entry.service';
import { IFinancialEntry } from '../../shared/interfaces/financial-entry.interface';

@Component({
  selector: 'app-financial-entry-registration',
  standalone: true,
  imports: [RegistrationContentBoxComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './financial-entry-registration.component.html',
  styleUrl: './financial-entry-registration.component.css'
})

export class FinancialEntryRegistrationComponent {
  financialEntryForm: FormGroup;
  entriesList: IFinancialEntry[] = [];

  constructor(private formBuilder: FormBuilder, 
    private httpClient: HttpClient, 
    private financialEntryService: FinancialEntryService) {
    this.financialEntryForm = this.formBuilder.group({
      description: ["", Validators.required],
      value: ["", [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\,\d{1,2})?$/)]],
      transactionDate: ["", Validators.required],
      type: ["Entrada", Validators.required]
    })
  }

  ngOnInit(): void {
    this.financialEntryService.getEntries()
                              .subscribe((response) => this.entriesList = response);
  }

  onSubmit() {
    
  }
  
}
