import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notes } from '@core/interfaces/notes';
import { RequisitionLog } from '@core/interfaces/requisition-audit-log';
import { ButtonModule } from 'primeng/button';


interface NoteTimelineItem {
  type: 'note';
  createdAt: Date;
  data: Notes;
}

interface LogTimelineItem {
  type: 'log';
  createdAt: Date;
  data: RequisitionLog;
}

@Component({
  selector: 'app-notes-drawer',
  imports: [ButtonModule, CommonModule],
  templateUrl: './notes-drawer.component.html'
})
export class NotesDrawerComponent {
  @Input() notes: Notes[] = [];
  @Input() requisitionId!: number;
  @Input() logs: RequisitionLog[] = [];
  @Output() isAddNoteVisible = new EventEmitter<boolean>();

  protected timeline: (NoteTimelineItem | LogTimelineItem)[] = [];

  ngOnChanges() {
    this.buildTimeline();
  }

  private buildTimeline() {
    const noteItems: NoteTimelineItem[] = this.notes.map(n => ({
      type: 'note',
      createdAt: new Date(n.createdAt),
      data: n
    }));

    const logItems: LogTimelineItem[] = this.logs.map(l => ({
      type: 'log',
      createdAt: new Date(l.changedAt),
      data: l
    }));

    this.timeline = [...noteItems, ...logItems]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  showAddNote() {
    this.isAddNoteVisible.emit(true);
  }

}