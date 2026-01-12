import { Component, inject, OnInit } from '@angular/core';
import { ProjectUtilizationTableComponent } from './project-utilization-table/project-utilization-table.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '@core/services/project.service';
import { toast } from 'ngx-sonner';
import { UtilizationData } from '@core/interfaces/project';

@Component({
  selector: 'app-project-utilization',
  templateUrl: './project-utilization.component.html',
  imports: [ProjectUtilizationTableComponent, SelectButtonModule, FormsModule],
})
export class ProjectUtilizationComponent implements OnInit{
  value!: number;
  filterOptions = [
    { icon: 'pi pi-user', name: 'User', value: 1 },
    { icon: 'pi pi-folder', name: 'Projects', value: 2 }
  ];
  protected projectUtilizationData: UtilizationData[] = [];
  protected filterByProject = false;
  protected filterByUser = false;
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


  protected handleSelectionChange(){
    if(this.value === 1){
      this.filterByUser = true;
      this.filterByProject = false;
    } else if(this.value === 2){
      this.filterByUser = false;
      this.filterByProject = true;
    }else{
      this.filterByUser = false;
      this.filterByProject = false;
    }
  }
}
