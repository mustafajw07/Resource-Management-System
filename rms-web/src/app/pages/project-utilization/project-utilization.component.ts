import { Component } from '@angular/core';

import { ProjectUtilizationTableComponent } from './project-utilization-table/project-utilization-table.component';

@Component({
  selector: 'app-project-utilization',
  templateUrl: './project-utilization.component.html',
  imports: [ProjectUtilizationTableComponent],
})
export class ProjectUtilizationComponent {}
