import { Component, inject, OnInit } from '@angular/core';
import { RequisitionTableComponent } from './requisition-table/requisition-table.component';
import { StepperModule } from 'primeng/stepper';
import { ProjectRequisitionService } from '@core/services/project-requisition.service';
import { ProjectRequisition, ProjectRequisitionCreate } from '@core/interfaces/project-requisition';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RequisitionFormComponent } from './requisition-form/requisition-form.component';
import { MoveStageDialogComponent } from './move-stage-dialog/move-stage-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
    selector: 'app-project-requisition',
    templateUrl: './project-requisition.component.html',
    styleUrls: ['./project-requisition.component.scss'],
    imports: [
        RequisitionTableComponent,
        RequisitionFormComponent,
        MoveStageDialogComponent,
        CommonModule,
        StepperModule,
        ButtonModule,
        DialogModule,
        FormsModule,
        FloatLabel],
})
export class ProjectRequisitionComponent implements OnInit {
    protected loading = false;
    protected visible = false;
    protected stageDialogVisible = false;
    protected activeStep = 0;
    protected requisitions: ProjectRequisition[] = [];
    protected popupHeader = '';
    protected selectedRequisition: ProjectRequisition | null = null;
    protected searchTerm: string = '';

    private readonly projectRequisitionService = inject(ProjectRequisitionService);

    ngOnInit(): void { this.getAllRequisitions(); }

    /**
     * Handles the form cancellation from the requisition form
     * @return void
     */
    protected getAllRequisitions() {
        this.loading = true;
        this.projectRequisitionService.getAllRequisitions().subscribe({
            next: (data: ProjectRequisition[]) => {
                this.requisitions = data.map((r) => ({
                    ...r,
                    requisitionDate: new Date(r.requisitionDate)
                }));
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.loading = false;
                toast.error('Failed to load requisitions: ' + error.message);
            }
        });
    }

    /**
     * Opens the dialog to add a new requisition
     * @return void
     */
    protected addRequisition(): void {
        this.popupHeader = "New Project Requisition";
        this.selectedRequisition = null;
        this.visible = true;
    }

    /**
     * Handles the form submission from the requisition form
     * @param payload 
     * @return void
     */
    protected handleFormSubmitted(payload: ProjectRequisitionCreate): void {
        this.projectRequisitionService.createRequisition(payload).subscribe({
            next: () => {
                toast.success('Requisition created successfully');
                this.getAllRequisitions();
            },
            error: (error: HttpErrorResponse) => {
                toast.error('Failed to create requisition: ' + error.message);
            },
        });
        this.visible = false;
    }

    /**
     * Handles the stage update dialog close and refreshes the requisition list
     * @return void
     */
    protected handleStageUpdated(updated: boolean): void {
        this.stageDialogVisible = false;
        this.getAllRequisitions();
    }

    /**
     * Open move stage dialog
     * @returns void
     * @param requisition 
     */
    protected openMoveDialog(requisition: ProjectRequisition): void {
        console.log('Opening move dialog for requisition:', requisition);
        this.selectedRequisition = requisition;
        this.stageDialogVisible = true;
    }

    /**
     * Get requisitions by stage
     * @returns ProjectRequisition[]
     * @param stage 
     */
    protected getByStage(stage: string): ProjectRequisition[] {
        return this.requisitions.filter(r => r.requisitionStage === stage);
    }
    
}
