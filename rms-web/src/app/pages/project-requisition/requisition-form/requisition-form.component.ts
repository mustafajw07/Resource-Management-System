import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-requisition-form',
  templateUrl: './requisition-form.component.html',
  imports: [ReactiveFormsModule, ButtonModule],
})
export class RequisitionFormComponent {
  @Output() submitted = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      requisitionDate: [''],
      projectId: ['', Validators.required],
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
