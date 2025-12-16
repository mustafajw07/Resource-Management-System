import { Component, inject, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RequisitionFormComponent } from '../requisition-form/requisition-form.component';
import { DialogModule } from 'primeng/dialog';
import { ProjectRequisitionService } from '@core/services/project-requisition.service';
import { ProjectRequisition, ProjectRequisitionCreate } from '@core/interfaces/project-requisition';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-requisition-table',
    templateUrl: './requisition-table.component.html',
    styleUrls: ['./requisition-table.component.scss'],
    imports: [TableModule,TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ButtonModule, DialogModule, RequisitionFormComponent],
})
export class RequisitionTableComponent implements OnInit {
    protected headers = [
        { field: 'requisitionDate', header: 'Requisition Date' },
        { field: 'projectName', header: 'Project' },
        { field: 'skill', header: 'Skill' },
        { field: 'requisitionType', header: 'Requisition Type' },
        { field: 'requisitionStage', header: 'Requisition Stage' },
        { field: 'hiringPocName', header: 'Hiring POC' },
        { field: 'clientPocName', header: 'Client POC' },
        { field: 'urgency', header: 'Urgency' },
        { field: 'fteHeadCount', header: 'FTE Head Count' },
        { field: 'ageingDays', header: 'Ageing Days' },
    ];
    protected requisitions: ProjectRequisition[] = [];
    protected popupHeader = '';
    protected loading = false;
    protected visible = false;
    protected globalFilterFields: string[] = [];
    protected expandedRows = {};
    protected selectedRequisition: ProjectRequisition | null = null;
    private readonly projectRequisitionService = inject(ProjectRequisitionService);

    ngOnInit(): void {
        this.globalFilterFields = this.headers.map(h => h.field);
        this.getRequisitions();
    }
    
    /**
     * Utility to safely get nested field values
     * @param obj The object to retrieve the value from
     * @param path The dot-separated path string
     * @returns The value at the specified path or an empty string if not found
    */
    protected getFieldValue(obj: any, path: string): any {
        if (!obj || !path) return '';
        return path.split('.').reduce((acc: any, key: string) => {
            if (acc === null || acc === undefined) return '';
            return acc[key];
        }, obj) ?? '';
    }

    /**
     * Opens the dialog to add a new requisition
     * @return void
     */
    protected addRequisition(): void{
        this.popupHeader = "New Project Requisition";
        this.selectedRequisition = null;
        this.visible = true;
    }

    /**
     * Opens the dialog to edit a new requisition
     * @return void
     */
    protected editRequisition(item:ProjectRequisition): void{
        this.popupHeader = "Edit Project Requisition";
        this.selectedRequisition = item;
        this.visible = true;
    }

    /**
     * Handles the form submission from the requisition form
     * @param payload 
     * @return void
     */
    protected handleFormSubmitted(payload: ProjectRequisitionCreate): void {
        this.projectRequisitionService.createRequisition(payload).subscribe({
            next: (data) => {
                toast.success('Requisition created successfully');
                this.getRequisitions();
            },
            error: (error: HttpErrorResponse) => {
                toast.error('Failed to create requisition: ' + error.message);
            },
        });
        this.visible = false;
    }

    /**
     * Handles the form cancellation from the requisition form
     * @return void
     */
    protected getRequisitions() {
        this.loading = true;
        this.projectRequisitionService.getAllRequisitions().subscribe({
            next: (data: ProjectRequisition[]) => {
                this.requisitions = data;
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.loading = false;
                toast.error('Failed to load requisitions: ' + error.message);
            }
        });
    }

    /**
     * Return tailwind-style classes for urgency levels
     */
    protected urgencyClass(value: string): string {
        if (!value) return 'bg-gray-100 text-gray-800 px-2 py-0.5 rounded';
        switch ((value || '').toString().toLowerCase()) {
            case 'long term': return 'bg-green-100 text-green-800 px-2 py-0.5 rounded';
            case 'immediate': return 'bg-red-100 text-yellow-800 px-2 py-0.5 rounded';
            default: return 'bg-gray-100 text-gray-800 px-2 py-0.5 rounded';
        }
    }
}
