import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { UtilizationData } from '@core/interfaces/project';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-project-utilization-table',
  imports: [TableModule, CommonModule],
  templateUrl: './project-utilization-table.component.html',
  styleUrl: './project-utilization-table.component.scss',
})
export class ProjectUtilizationTableComponent {
  @ViewChild('dt') dt2!: Table;

  @Input() set globalSearch(value: string) {
    const term = (value || '').trim();
    if (this.dt2) {
        if (term) {
            this.dt2.filterGlobal(term, 'contains');
        } else {
            this.dt2.clear();
        }
    }
  }
  @Input() projectUtilizationData: UtilizationData[] = [];
  @Input() filterByUser: boolean = false;
  @Input() filterByProject: boolean = false;

  protected headers = [
    { field: 'userName', header: 'Full Name' },
    { field: 'locationName', header: 'Location' },
    { field: 'projectName', header: 'Project' },
    { field: 'utilizationPercentage', header: 'Utilization (%)' },
    {
      field: 'allocationEndDate', header: 'Estimated Release Date'
    },
    {
      field: 'isPrimaryProject', header: 'Primary Project'
    }
  ];
  protected globalFilterFields: string[] = this.headers.map(h => h.field);

  /**
   * Return field values
   */
  protected getFieldValue(row: UtilizationData, field: string): any {
      return (row as any)[field] ?? 'N/A';
  }
}
