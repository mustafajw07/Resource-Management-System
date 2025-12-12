import { Component } from '@angular/core';

import { RequisitionTableComponent } from './requisition-table/requisition-table.component';

@Component({
  selector: 'app-project-requisition',
  templateUrl: './project-requisition.component.html',
  imports: [RequisitionTableComponent],
})
export class ProjectRequisitionComponent {}
