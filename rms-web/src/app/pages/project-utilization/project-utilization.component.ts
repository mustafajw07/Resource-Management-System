import { Component, inject, OnInit } from '@angular/core';
import { ProjectUtilizationTableComponent } from './project-utilization-table/project-utilization-table.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '@core/services/project.service';
import { toast } from 'ngx-sonner';
import { UtilizationData } from '@core/interfaces/project';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserUtilizationTableComponent } from "./user-utilization-table/user-utilization-table.component";

@Component({
  selector: 'app-project-utilization',
  templateUrl: './project-utilization.component.html',
  imports: [ProjectUtilizationTableComponent, SelectButtonModule, FormsModule, ButtonModule, InputTextModule, UserUtilizationTableComponent],
})
export class ProjectUtilizationComponent implements OnInit{
  protected value!: number;
  protected filterOptions = [
    { icon: 'pi pi-user', name: 'User', value: 1 },
    { icon: 'pi pi-folder', name: 'Projects', value: 2 }
  ];
  protected projectUtilizationData: UtilizationData[] = [];
  protected filterByProject = false;
  protected filterByUser = false;
  protected searchTerm = '';

  private readonly projectService = inject(ProjectService);
  
  ngOnInit(): void {
    this.projectService.getAllProjectUtilization().subscribe({
      next: (res) => {
        this.projectUtilizationData = res;
      },
      error: (err) => {
        toast.error('Failed to load project utilization data.');
      }
    });
  }

  /**
   * Handles the change in selection for filtering options.
   * @protected
   * @returns void
   */
  protected handleSelectionChange(): void {
    this.filterByUser = this.value === 1;
    this.filterByProject = this.value === 2;
  }
}
