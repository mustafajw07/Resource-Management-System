import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Store, StoreModule } from '@ngrx/store';
import { selectAllReferenceData } from '../../../store/reference-data/reference-data.selectors';


@Component({
  selector: 'app-requisition-form',
  templateUrl: './requisition-form.component.html',
   standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, CommonModule,FormsModule,AutoCompleteModule, StoreModule],
})
export class RequisitionFormComponent implements OnInit {
  @Output() submitted = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  private store=inject(Store);
  private referenceLists: Record<string, string[]> = {};
  protected requisitionTypes: string[] = [""];
  protected requisitionStages: string[] = [];
  protected urgencies: string[] = [];
  protected form: FormGroup;

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
    this.getReferenceData();
  }

  /**
   * Fetch reference data from the store and populate local lists for dropdowns.
   * @returns void
   */
  getReferenceData(): void {
    this.store.select(selectAllReferenceData).subscribe((data) => {
      if(data && data.length > 0){
        const types = data.filter(item => item.categoryName === 'RequisitionType').map(item => item.name);
        const stages = data.filter(item => item.categoryName === 'RequisitionStage').map(item => item.name);
        const urg = data.filter(item => item.categoryName === 'Urgency').map(item => item.name);

        this.referenceLists['requisitionTypes'] = types;
        this.referenceLists['requisitionStages'] = stages;
        this.referenceLists['urgencies'] = urg;

        this.requisitionTypes = [...types];
        this.requisitionStages = [...stages];
        this.urgencies = [...urg];
      }
    });
  }

  /**
   * Generic filter handler for multiple autocomplete dropdowns.
   * - `key` must match one of: 'requisitionTypes' | 'requisitionStages' | 'urgencies'
   */
  filterDropdown(event: AutoCompleteCompleteEvent, key: string): void {
    const source = this.referenceLists[key] ?? [];
    const query = (event?.query ?? '').toString().trim();

    const filtered = query
      ? source.filter(item => item?.toString().toLowerCase().includes(query.toLowerCase()))
      : [...source];

    switch (key) {
      case 'requisitionTypes':
        this.requisitionTypes = filtered;
        break;
      case 'requisitionStages':
        this.requisitionStages = filtered;
        break;
      case 'urgencies':
        this.urgencies = filtered;
        break;
      default:
        break;
    }
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
