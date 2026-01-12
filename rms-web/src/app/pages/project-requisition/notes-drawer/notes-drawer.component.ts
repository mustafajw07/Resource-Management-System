import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notes } from '@core/interfaces/notes';
import { RequisitionLog } from '@core/interfaces/requisition-audit-log';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notes-drawer',
  imports: [ButtonModule, CommonModule],
  templateUrl: './notes-drawer.component.html'
})
export class NotesDrawerComponent {
  @Input() notes: Notes[] = [];
  @Input() requisitionId!: number;
  @Output() isAddNoteVisible = new EventEmitter<boolean>();
  @Input() logs: RequisitionLog[] = []; 
}