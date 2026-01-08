import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ProjectRequisition } from '@core/interfaces/project-requisition';
import { ReferenceRow } from '@core/interfaces/reference-row';
import { Store } from '@ngrx/store';
import { selectByCategory } from '../../../store/reference-data/reference-data.selectors';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-move-stage-dialog',
  imports: [AutoCompleteModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './move-stage-dialog.component.html'
})
export class MoveStageDialogComponent implements OnInit{
  @Input() requisition: ProjectRequisition | null = null;
  @Output() updated = new EventEmitter<{requisitionStageId: number, note: string | null}>();

  protected requisitionStages: string[] =[];
  protected selectedRequisition: string | null = null;
  protected noteText: string | null = null;

  private _stages: ReferenceRow[] = [];
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.select(selectByCategory('RequisitionStage')).subscribe((stages) => {
        this._stages = stages;
        this.requisitionStages = stages.map((stage) => stage.name);
        this.selectedRequisition = stages.find(stage => stage.id === this.requisition?.requisitionStageId)?.name || null;
    });
  }
  
  /**
   * Filters the dropdown options based on user input
   * @param event AutoCompleteCompleteEvent
   * @return void
   */
  filterDropdown(event: AutoCompleteCompleteEvent): void{
    this.requisitionStages = event.query
      ? this.requisitionStages.filter(item => item?.toString().toLowerCase().includes(event.query.toLowerCase()))
      : [...this.requisitionStages];
  }

  /**
   * Submits the updated requisition stage and note
   * @return void
   */
  submit(): void{
    if(this.requisition && this.selectedRequisition){
      const selectedStageId = this._stages.find(stage => stage.name === this.selectedRequisition)?.id || 0;
      this.updated.emit({requisitionStageId: selectedStageId, note: this.noteText});
    }
  }

  /**
   * Handles cancellation of the dialog
   * @return void
   */
  cancel(): void{
    this.updated.emit();
  }
}
