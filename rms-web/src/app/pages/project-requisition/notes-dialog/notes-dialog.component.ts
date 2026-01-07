import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notes-dialog',
  imports: [ReactiveFormsModule, ButtonModule],
  templateUrl: './notes-dialog.component.html'
})
export class NotesDialogComponent {
  @Output() addNote = new EventEmitter<string>();

  protected noteForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      noteText: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  /**
   * Cancel adding note
   * Emits without any value
   * @returns void
   */
  protected cancel(): void{
    this.addNote.emit();
    this.noteForm.reset();
  }

  /**
   * Submit the note form
   * Emits the note text if valid
   * @returns void
   */
  protected submit() {
    if (this.noteForm.invalid) return;
    this.addNote.emit(this.noteForm.value.noteText);
    this.noteForm.reset();
  }
}
