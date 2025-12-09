import { Component } from '@angular/core';
import { RequisitionTableComponent } from './requisition-table/requisition-table.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-project-requisition',
  templateUrl: './project-requisition.component.html',
  styleUrl: './project-requisition.component.scss',
  imports: [RequisitionTableComponent],
})
export class ProjectRequisitionComponent {

}
