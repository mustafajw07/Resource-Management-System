import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Store } from '@ngrx/store';
import { selectAll } from '../../../store/reference-data/reference-data.selectors';





@Component({
  selector: 'app-requisition-form',
  templateUrl: './requisition-form.component.html',
   standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, CommonModule,FormsModule,AutoCompleteModule],
})
export class RequisitionFormComponent implements OnInit {
  @Output() submitted = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private store=inject(Store);
  
  requisitionTypes: string[] = [];
  requisitionStages: string[] = [];
  urgencies: string[] = [];


  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      requisitionDate: [''],
      projectName: ['', Validators.required],
      requisitionType: [''],
      requisitionStage: [''],
      hiringPoc: [''],
      clientPoc: [''],
      fulfillmentMedium: [''],
      urgency: [''],
      requisitionStatus: [''],
      fteHeadCount: [0],
      fteTotalAllocation: [0],
      fulfilledAllocation: [0],
      notes: [''],
      tentativeOnboardingDate: [''],
      ageingDays: [0],
      capabilityArea: [''],
    }); 
  
  }

  ngOnInit(): void {
  
      this.store.select(selectAll).subscribe(rows => {
        console.log(rows)
        if(rows && rows.length > 0){
          
             this.requisitionTypes = rows.filter(r => r.categoryName === 'RequisitionType').map(r => r.name);
        
      this.requisitionStages = rows.filter(r => r.categoryName === 'RequisitionStage').map(r => r.name);

      this.urgencies = rows.filter(r => r.categoryName === 'Urgency').map(r => r.name);
        }
   
    });

  }
  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
