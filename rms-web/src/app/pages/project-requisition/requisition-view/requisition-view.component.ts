
import { Component, inject } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectRequisitionService } from '@core/services/project-requisition.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Store } from '@ngrx/store';
import { selectAllReferenceData } from '../../../store/reference-data/reference-data.selectors';
import { AutoComplete } from 'primeng/autocomplete';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-requisition-view',
  imports: [StepperModule, ButtonModule, CommonModule, FormsModule, AutoComplete, InputTextModule],
  templateUrl: './requisition-view.component.html',
  styleUrl: './requisition-view.component.scss',
})
export class RequisitionViewComponent {

  private requisitionService = inject(ProjectRequisitionService);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  protected requisition!: any;
  protected originalReq: any;
  private referenceLists: Record<string, string[]> = {};
  protected requisitionTypes: string[] = [];
  protected fulfillmentMedium: string[] = [];
  protected requisitionStatus: string[] = [];
  protected metaData: Record<string, any> = {};

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('requisitionId')!;
  this.requisitionService.getRequisitionById(id).pipe(map((res: any) => Array.isArray(res) ? res[0] : res)).subscribe(req => {
      this.requisition = req;
      this.originalReq=structuredClone(req);
    });
    this.getReferenceData();
  }

  /**
  * Returns the unsaved changes.
  * @returns void
  */
  onCancel(): void {
    this.requisition = structuredClone(this.originalReq);
  }

  /**
   * Log the payload data on saving.
   * @returns void
   */
  onSave(): void {
    console.log("Payload:", this.requisition);
  }

  /**
   * Fetch reference data from the store and populate local lists for dropdowns.
   * @returns void
   */
  private getReferenceData(): void {
    this.store.select(selectAllReferenceData).subscribe((data) => {
      if (!data || data.length === 0) return;

      this.metaData = { referenceData: data };

      const mapping: [category: string, key: keyof typeof this.referenceLists][] = [
        ['RequisitionType', 'requisitionTypes'],
        ['RequisitionStatus', 'requisitionStatus'],
        ['FulfillmentMedium', 'fulfillmentMedium'],
      ];

      mapping.forEach(([category, key]) => {
        const list = data
          .filter(item => item?.categoryName === category)
          .map(item => (item?.name || '').trim())
          .filter(Boolean);
        this.referenceLists[key] = list;
      });
    });
  }

  /**
  * Generic filter handler for multiple autocomplete dropdowns.
  * - `key` must match one of: 'requisitionTypes' | 'requisitionStages' | 'urgencies'
  * @returns void
  */
  filterDropdown(event: { query?: string; filter?: string }, key: 'requisitionTypes' | 'fulfillmentMedium' | 'requisitionStatus'): void {
    const source = this.referenceLists[key] ?? [];
    const q = (event?.query ?? event?.filter ?? '').toString().trim().toLowerCase();
    const filtered = q ? source.filter(item => (item || '').toLowerCase().includes(q)) : [...source];

    switch (key) {
      case 'requisitionTypes':
        this.requisitionTypes = filtered;
        break;
      case 'fulfillmentMedium':
        this.fulfillmentMedium = filtered;
        break;
      case 'requisitionStatus':
        this.requisitionStatus = filtered;
        break;
    }
  }
}
