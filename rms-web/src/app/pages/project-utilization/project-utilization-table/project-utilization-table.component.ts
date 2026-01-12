import { Component, Input } from '@angular/core';
import { UtilizationData } from '@core/interfaces/project';

@Component({
  selector: 'app-project-utilization-table',
  imports: [],
  templateUrl: './project-utilization-table.component.html',
  styleUrl: './project-utilization-table.component.scss',
})
export class ProjectUtilizationTableComponent {
  @Input() projectUtilizationData: UtilizationData[] = [];
  @Input() filterByUser: boolean = false;
  @Input() filterByProject: boolean = false;

  protected headers = [
    { field: 'locationName', header: 'Location' },
    { field: 'userName', header: 'Full Name' },
    { field: 'projectName', header: 'Project' },
    { field: 'utilizationPercentage', header: 'Utilization' },
    {
      field: 'allocationEndDate', header: 'Estimated Release Date'
    },
    {
      field: 'isPrimaryProject', header: 'Primary Project'
    }
  ];
}
