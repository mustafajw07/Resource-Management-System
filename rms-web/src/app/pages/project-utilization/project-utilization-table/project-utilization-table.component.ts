import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { UtilizationData } from '@core/interfaces/project';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from "primeng/multiselect";
import { DatePickerModule } from "primeng/datepicker";

@Component({
  selector: 'app-project-utilization-table',
  imports: [TableModule, CommonModule, ButtonModule, MultiSelectModule, DatePickerModule],
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

protected headers: {field: string; header: string; filterType?: 'text' | 'dropdown' | 'date';options?: { label: string; value: string }[]; } [] = [
  { field: 'userName', header: 'Full Name', filterType: 'text' },
  { field: 'locationName', header: 'Location', filterType: 'text' },
  { field: 'projectName', header: 'Project', filterType: 'dropdown', options: [] },
  { field: 'utilizationPercentage', header: 'Utilization (%)' },
  { field: 'allocationEndDate', header: 'Estimated Release Date', filterType: 'date' },
  { field: 'isPrimaryProject', header: 'Primary Project' }
];

  protected globalFilterFields: string[] = this.headers.map(h => h.field);
  
  ngOnChanges(changes: SimpleChanges): void {
    if ('projectUtilizationData' in changes) {
      this.headers.find(h => h.field === 'projectName')!.options =
      Array.from(new Set(this.projectUtilizationData.map(p => p.projectName).filter(Boolean))).map(name => ({ label: name, value: name }));
  }
}

  /**
   * Return field values
   */
  protected getFieldValue(row: UtilizationData, field: string): any {
      return (row as any)[field] ?? 'N/A';
  }

  /**
   * Calculate project total utilization percentage
   * @param projectUtilizationData
   * @return string
   */
  protected getProjectTotal(projectUtilizationData: UtilizationData): string {
      const total = this.projectUtilizationData
          .filter(p => p.projectId === projectUtilizationData.projectId)
          .reduce((sum, p) => sum + (p.utilizationPercentage || 0), 0);
      return total.toFixed(2);
  }
}
