import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectRequisition } from '@core/interfaces/project-requisition';

@Component({
  selector: 'app-move-stage-dialog',
  imports: [],
  templateUrl: './move-stage-dialog.component.html'
})
export class MoveStageDialogComponent {
  @Input() requisition: ProjectRequisition | null = null;
  @Output() updated = new EventEmitter<any>();
}
