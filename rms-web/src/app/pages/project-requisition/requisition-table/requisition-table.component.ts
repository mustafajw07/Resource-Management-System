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
import { ProgressBarModule } from 'primeng/progressbar';
import { ProjectRequisitionService } from '@core/services/project-requisition.service';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectRequisition, ProjectRequisitionCreate } from '@core/interfaces/project-requisition';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';
import { NotesService } from '@core/services/notes.service';
import { Notes } from '@core/interfaces/notes';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { SliderModule } from 'primeng/slider';
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-requisition-table',
    templateUrl: './requisition-table.component.html',
    styleUrls: ['./requisition-table.component.scss'],
    imports: [
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    CommonModule,
    ButtonModule,
    DialogModule,
    AutoCompleteModule,
    TooltipModule,
    ProgressBarModule,
    DatePickerModule,
    SliderModule,
    RequisitionFormComponent,
    RouterModule
],
})
export class RequisitionTableComponent implements OnInit {
    protected headers = [
        { field: 'requisitionDate', header: 'Requisition Date', filterType: 'date' },
        { field: 'projectName', header: 'Project', filterType: 'text' },
        { field: 'skill', header: 'Skill', filterType: 'dropdown' },
        { field: 'requisitionType', header: 'Requisition Type', filterType: 'dropdown' },
        { field: 'requisitionStage', header: 'Requisition Stage', filterType: 'dropdown' },
        { field: 'hiringPocName', header: 'Hiring POC', filterType: 'text' },
        { field: 'clientPocName', header: 'Client POC', filterType: 'text' },
        {
            field: 'urgency', header: 'Urgency', filterType: 'dropdown', options: [
                { label: 'Immediate', value: 'Open' },
                { label: 'Long Term', value: 'Closed' },
                { label: 'Over Due', value: 'Over Due' },
            ]
        },
        { field: 'fteHeadCount', header: 'FTE Head Count', filterType: null, },
        { field: 'ageingDays', header: 'Ageing Days', filterType: 'range' },
    ];
    protected requisitions: ProjectRequisition[] = [];
    protected popupHeader = '';
    protected loading = false;
    protected visible = false;
    protected globalFilterFields: string[] = [];
    protected expandedRows = {};
    protected selectedRequisition: ProjectRequisition | null = null;
    protected notesMap = new Map<number, Notes[]>();

    private readonly projectRequisitionService = inject(ProjectRequisitionService);
    private readonly notesService = inject(NotesService)
    private readonly notesLoaded = new Set<number>();

    ngOnInit(): void {
        this.globalFilterFields = this.headers.map(h => h.field);
        this.getRequisitions();
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
     * Return tailwind-style classes for urgency levels
     * @return string
     */
    protected urgencyClass(value: string): string {
        if (!value) return 'bg-gray-100 text-gray-800 px-2 py-0.5 rounded';
        switch ((value || '').toString().toLowerCase()) {
            case 'long term': return 'bg-green-100 text-green-800 px-2 py-0.5 rounded';
            case 'immediate': return 'bg-red-100 text-yellow-800 px-2 py-0.5 rounded';
            default: return 'bg-gray-100 text-gray-800 px-2 py-0.5 rounded';
        }
    }

    /**
     * Return tailwind-style classes for ageing
     * @return string
     */
    protected ageingClass(days?: number): string {
        if (!days) return '';
        if (days > 30) return 'text-red-600 font-bold';
        if (days > 20) return 'text-yellow-600 font-semibold';
        return 'text-green-600';
    }

    /**
     * Return tailwind-style classes for onboarding date
     * @return string
     */
    protected onboardingClass(date?: string | Date): string {
        if (!date) return '';

        const target = new Date(date).getTime();
        const today = Date.now();
        const diffDays = (target - today) / (1000 * 60 * 60 * 24);

        if (diffDays < 0) return 'text-red-600 font-bold';
        if (diffDays <= 7) return 'text-yellow-600 font-semibold';
        return 'text-green-600';
    }

    /**
     * Return progress for fte
     * @return number
     */
    protected fteProgress(row: ProjectRequisition): number {
        if (!row.fteHeadCount || !row.fulfilledAllocation) return 0;
        return Math.round((row.fulfilledAllocation / row.fteHeadCount) * 100);
    }

    /**
     * Return field values
     */
    protected getFieldValue(row: ProjectRequisition, field: string): any {
        return (row as any)[field] ?? 'N/A';
    }

    /**
     * returns Requisition Notes on row expansion
     * @return void
     */
    protected getRequisitionNotes(requisitionId: number): void {
        if (this.notesLoaded.has(requisitionId)) return;
        this.notesService.getAllNotesForRequisitionId(requisitionId).subscribe((notes) => {
            const list = Array.isArray(notes) ? notes : [];
            this.notesMap.set(requisitionId, list);
            const row = this.requisitions.find(r => r.requisitionId === requisitionId);
            if (row) {
                row.notes = list.map(n => n.noteText).join('\n\n');
                this.notesLoaded.add(requisitionId);
            }
        });
    }
}