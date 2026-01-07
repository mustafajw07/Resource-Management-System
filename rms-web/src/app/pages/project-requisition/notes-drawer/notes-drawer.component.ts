import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notes } from '@core/interfaces/notes';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notes-drawer',
  imports: [ButtonModule, CommonModule],
  templateUrl: './notes-drawer.component.html'
})
export class NotesDrawerComponent {
  @Input() notes: Notes[] = [];
  @Output() isAddNoteVisible = new EventEmitter<boolean>();
}
