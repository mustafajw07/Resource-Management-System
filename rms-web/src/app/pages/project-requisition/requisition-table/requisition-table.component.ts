import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectRequisition, ProjectRequisitionCreate } from '@core/interfaces/project-requisition';
import { NotesService } from '@core/services/notes.service';
import { Notes } from '@core/interfaces/notes';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { SliderModule } from 'primeng/slider';
import { RouterModule } from "@angular/router";
import { ButtonModule } from 'primeng/button';

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
    ButtonModule,
    CommonModule,
    AutoCompleteModule,
    TooltipModule,
    ProgressBarModule,
    DatePickerModule,
    SliderModule,
    RouterModule
],
})
export class RequisitionTableComponent implements OnInit {
    @Input() requisitions: ProjectRequisition[] = [];
    @Input() loading: boolean = false;
    @Input() currentStage: number = 0;

    @Output() move = new EventEmitter<ProjectRequisition>();

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
    protected globalFilterFields: string[] = [];
    protected expandedRows = {};

    protected notesMap = new Map<number, Notes[]>();
    private readonly notesService = inject(NotesService)
    private readonly notesLoaded = new Set<number>();

    ngOnInit(): void {
        this.globalFilterFields = this.headers.map(h => h.field);
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

    /**
     * Move to next stage
     * @returns void
     * @param row 
     */
    protected moveToNextStage(row: ProjectRequisition): void {
        this.move.emit(row);
    }
}