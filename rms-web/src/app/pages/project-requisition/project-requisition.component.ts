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
import { Store } from '@ngrx/store';
import { selectByCategory } from '../../store/reference-data/reference-data.selectors';
import { ReferenceRow } from '@core/interfaces/reference-row';
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
        DialogModule
    ,
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
    protected requisitionStages: ReferenceRow[] = [];
    protected selectedRequisition: ProjectRequisition | null = null;
    protected searchTerm: string = '';

    private readonly projectRequisitionService = inject(ProjectRequisitionService);
    private readonly store = inject(Store);

    ngOnInit(): void {
        this.getAllRequisitions();
        this.getReferenceData();
    }

    /**
     * Fetches reference data for requisition stages
     * @return void
     */
    protected getReferenceData(): void {
        this.store.select(selectByCategory('RequisitionStage')).subscribe((data) => {
            this.requisitionStages = data;
        });
    }

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
    protected handleStageUpdated(requisitionStageId: number): void {
        this.stageDialogVisible = false;
        this.projectRequisitionService.updateRequisitionStage(this.selectedRequisition?.requisitionId || 0, requisitionStageId).subscribe({
            next: () => {
                toast.success('Requisition stage updated successfully');
            },
            error: (error: HttpErrorResponse) => {
                toast.error('Failed to update requisition stage: ' + error.message);
            }
        });
        this.getAllRequisitions();
        this.activeStep += 1;
    }

    /**
     * Open move stage dialog
     * @returns void
     * @param requisition 
     */
    protected openMoveDialog(requisition: ProjectRequisition): void {
        const currentStage = requisition.requisitionStage;
        this.selectedRequisition = requisition;
        this.popupHeader = `Move Requisition to next stage: ${currentStage})`;
        let nextStage = '';
        if (currentStage === 'Approval') {
            nextStage = 'Planning';
        }
        if (currentStage === 'Planning') {
            nextStage = 'Fulfillment';
        }
        if (currentStage === 'Fulfillment') {
            nextStage = 'Closure';
        }
        const requisitionStageId = this.requisitionStages.find(rs => rs.name === nextStage)?.id || 0;
        this.handleStageUpdated(requisitionStageId);
        // this.stageDialogVisible = true;
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
