import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { TreeTable, TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { UtilizationData } from '@core/interfaces/project';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from "primeng/table";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-utilization-table',
  standalone: true,
  imports: [CommonModule, ButtonModule, MultiSelectModule, DatePickerModule, TreeTableModule, TableModule, InputTextModule, FormsModule],
  templateUrl: './user-utilization-table.component.html',
})
export class UserUtilizationTableComponent implements OnChanges {

  @ViewChild('tt') tt!: TreeTable;
  @Input() projectUtilizationData: UtilizationData[] = [];
  @Input() set globalSearch(value: string) {
    const term = (value || '').trim();
    if (this.tt) {
      if (term) {
        this.tt.filterGlobal(term, 'contains');
      }
    }
  }

  protected headers: { field: string; header: string; filterType?: 'text' | 'dropdown' | 'date'; options?: { label: string; value: string }[]; }[] = [
    { field: 'userName', header: 'Full Name', filterType: 'text' },
    { field: 'locationName', header: 'Location', filterType: 'text' },
    { field: 'projectName', header: 'Project', filterType: 'dropdown', options: [] },
    { field: 'utilizationPercentage', header: 'Utilization (%)' },
    { field: 'allocationEndDate', header: 'Estimated Release Date', filterType: 'date' },
    { field: 'isPrimaryProject', header: 'Primary Project' }
  ];

  protected globalFilterFields: string[] = this.headers.map(h => h.field);
  protected userHierarchy: TreeNode<UtilizationData>[] = [];
  protected dateRange: any


  ngOnChanges(): void {
    const projectHeader = this.headers.find(h => h.field === 'projectName');
    if (projectHeader) {
      projectHeader.options = Array.from(
        new Set(this.projectUtilizationData.map(p => p.projectName).filter(Boolean))
      ).map(name => ({ label: name!, value: name! }));
    }
    this.userHierarchy = this.buildHierarchy(this.projectUtilizationData || []);
  }

  /** 
   * Build TreeTable hierarchy using managerId (null => root) 
   * 
   * */
  protected buildHierarchy(rows: UtilizationData[]): TreeNode<UtilizationData>[] {
    if (!rows?.length) return [];
    const nodes = new Map<number, TreeNode<UtilizationData>>();
    const roots: TreeNode<UtilizationData>[] = [];
    for (const r of rows) {
      if (!nodes.has(r.userId)) {
        nodes.set(r.userId, {
          key: String(r.userId),
          data: r,
          children: [],
          expanded: false
        });
      }
    }
    for (const r of rows) {
      const node = nodes.get(r.userId);
      if (!node) continue;
      const mgrId = (r as any).managerId as number | null | undefined;
      if (mgrId == null) {
        roots.push(node);
        continue;
      }
      const managerNode = nodes.get(mgrId);
      if (managerNode) {
        if (!managerNode.children!.some(ch => ch.key === node.key)) {
          managerNode.children!.push(node);
        }
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  /** 
   * Filters the table according to date range
   * 
   * */
  protected applyDateFilter(range: Date[] | null) {
    if (!range || range.length < 2 || !range[0] || !range[1]) {
      this.userHierarchy = this.buildHierarchy(this.projectUtilizationData);
      return;
    }
    const start = new Date(range[0].getFullYear(), range[0].getMonth(), range[0].getDate());
    const end = new Date(range[1].getFullYear(), range[1].getMonth(), range[1].getDate(), 23, 59, 59, 999);
    const filtered = (this.projectUtilizationData ?? []).filter(r => {
      const d = new Date(r.allocationEndDate);
      return d >= start && d <= end;
    });
    this.userHierarchy = this.buildHierarchy(filtered);
  }
}
