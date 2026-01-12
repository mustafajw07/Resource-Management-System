import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectRequisition } from '@core/interfaces/project-requisition';
import { NotesService } from '@core/services/notes.service';
import { Notes } from '@core/interfaces/notes';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { SliderModule } from 'primeng/slider';
import { RouterModule } from "@angular/router";
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { NotesDrawerComponent } from "../notes-drawer/notes-drawer.component";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { Dialog } from "primeng/dialog";
import { toast } from 'ngx-sonner';
import { FormsModule } from '@angular/forms';
import { RequisitionAuditLogService } from '@core/services/requisition-audit-log.service';
import { RequisitionLog } from '@core/interfaces/requisition-audit-log';

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
        RouterModule,
        DrawerModule,
        NotesDrawerComponent,
        NotesDialogComponent,
        Dialog,
        FormsModule,
    ],
})
export class RequisitionTableComponent implements OnInit {
    @ViewChild('dt2') dt2!: Table;

    @Input() requisitions: ProjectRequisition[] = [];
    @Input() loading: boolean = false;
    @Input() currentStage: number = 0;
    @Input() globalSearch: string = '';
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
    protected globalFilterFields: string[] = this.headers.map(h => h.field);
    protected expandedRows = {};
    protected isNotesVisible: boolean = false;
    protected isAddNoteVisible: boolean = false;
    protected selectedRequisitionId: number | null = null;
    protected logs: RequisitionLog[] = [];
    protected notesMap = new Map<number, Notes[]>();
    private readonly notesService = inject(NotesService)
    private readonly logsService = inject(RequisitionAuditLogService)
    private readonly notesLoaded = new Set<number>();

    ngOnInit(): void {
        this.populateDropdownOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['requisitions']) {
            this.populateDropdownOptions();
        }
        if (changes['globalSearch']) {
            const term = (this.globalSearch || '').trim();
            if (this.dt2) {
                if (term) {
                    this.dt2.filterGlobal(term, 'contains');
                } else {
                    this.dt2.clear();
                }
            }
        }
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
    protected getRequisitionNotes(requisitionId: number, refresh: boolean = false): void {
        if (this.notesLoaded.has(requisitionId) && !refresh) return;
        this.notesService.getAllNotesForRequisitionId(requisitionId).subscribe((notes) => {
            this.notesMap.set(requisitionId, notes);
            this.notesLoaded.add(requisitionId);
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

    /**
     * Open notes drawer
     * @returns void
     * @param row 
     */
    protected openNotes(row: ProjectRequisition): void {
        this.selectedRequisitionId = row.requisitionId;
        this.getRequisitionNotes(row.requisitionId);
        this.isNotesVisible = true;
        this.loadRequisitionLogs(row.requisitionId);
        this.isNotesVisible = true;
    }

    /**
     * Open add notes drawer
     * @returns void
     * @param isAddNoteVisible 
     */
    protected openAddNotes(isAddNoteVisible: boolean): void {
        this.isAddNoteVisible = isAddNoteVisible;
    }

    /**
     * Handle added note
     * @returns void
     * @param noteText
     * @param requisitionId
     */
    protected handleAddNote(noteText: string): void {
        this.isAddNoteVisible = false;
        if (!noteText || !this.selectedRequisitionId) return;
        this.notesService.createNote(this.selectedRequisitionId, noteText).subscribe({
            next: () => {
                toast.success('Note added successfully.');
                this.getRequisitionNotes(this.selectedRequisitionId!, true);
            },
            error: (err) => {
                toast.error('Failed to add note. Please try again.');
            }
        });
    }

    /**
     * Maps each value for dropdown filteration
     * @returns void
     */
    protected populateDropdownOptions(): void {
        if (!Array.isArray(this.requisitions) || this.requisitions.length === 0) return;
        const dropdownFields = ['skill', 'requisitionType', 'requisitionStage'];
        dropdownFields.forEach(field => {
            const header = this.headers.find(h => h.field === field);
            if (header) {
                const uniqueValues = Array.from(
                    new Set(this.requisitions.map(r => (r as any)[field]).filter(v => v))
                );
                header.options = uniqueValues.map(v => ({ label: v, value: v }));
            }
        });
    }
    
    /**
     * loads log for each requisition.
     * @returns void
     */
    protected loadRequisitionLogs(requisitionId: number): void {
        this.logsService.getLogsByRequisitionId(requisitionId).subscribe((logs) => {
            this.logs = logs;
    });
  }
}