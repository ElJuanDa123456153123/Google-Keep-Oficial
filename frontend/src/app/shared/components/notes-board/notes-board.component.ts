import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NoteService } from '../../../core/services';
import { Note } from '../../models';
import { NoteCardComponent } from '../note-card/note-card.component';

@Component({
  selector: 'app-notes-board',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, NoteCardComponent],
  templateUrl: './notes-board.component.html',
  styleUrls: ['./notes-board.component.scss']
})
export class NotesBoardComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  pinnedNotes: Note[] = [];
  otherNotes: Note[] = [];
  loading = true;
  error = false;
  currentView: string = 'notas';

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  ngOnDestroy() {}

  loadNotes() {
    this.loading = true;
    this.error = false;
    console.log('NotesBoard - Loading notes...');

    this.noteService.getAll().subscribe({
      next: (notes) => {
        console.log('NotesBoard - Notes loaded:', notes.length);
        this.notes = notes;
        this.separateNotes();
        this.loading = false;
        this.cdr.detectChanges();
        console.log('NotesBoard - Pinned:', this.pinnedNotes.length, 'Other:', this.otherNotes.length);
      },
      error: (err) => {
        console.error('NotesBoard - Error loading notes:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onEditNote(note: Note) {
    console.log('Edit note:', note);
    // TODO: Open edit modal
  }

  onDeleteNote(noteId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      this.noteService.delete(noteId).subscribe({
        next: () => {
          this.loadNotes();
        },
        error: (err) => {
          console.error('Error deleting note:', err);
        }
      });
    }
  }

  onPinNote(noteId: number) {
    this.noteService.togglePin(noteId).subscribe({
      next: () => {
        this.loadNotes();
      },
      error: (err) => {
        console.error('Error pinning note:', err);
      }
    });
  }

  onArchiveNote(noteId: number) {
    this.noteService.archive(noteId).subscribe({
      next: () => {
        this.loadNotes();
      },
      error: (err) => {
        console.error('Error archiving note:', err);
      }
    });
  }

  onToggleChecklist(data: { noteId: number; itemId: number }) {
    // TODO: Implement toggle checklist
    console.log('Toggle checklist:', data);
  }

  setCurrentView(view: string) {
    console.log('NotesBoard - setCurrentView:', view);
    console.log('Total notes loaded:', this.notes.length);
    this.currentView = view;
    this.separateNotes();
    this.cdr.detectChanges(); // Force change detection
    console.log('Pinned notes:', this.pinnedNotes.length);
    console.log('Other notes:', this.otherNotes.length);
  }

  private getFilteredNotes(): Note[] {
    let filtered = this.notes;

    // Filter by view
    if (this.currentView === 'notas') {
      filtered = filtered.filter(note => !note.is_archived && !note.is_deleted);
    } else if (this.currentView === 'recordatorios') {
      filtered = filtered.filter(note => note.reminder_date && !note.is_deleted);
    } else if (this.currentView === 'trash') {
      filtered = filtered.filter(note => note.is_deleted);
    } else if (this.currentView.startsWith('label:')) {
      const labelName = this.currentView.replace('label:', '');
      filtered = filtered.filter(note =>
        !note.is_deleted &&
        note.labels?.some(label => label.name === labelName)
      );
    }

    return filtered;
  }

  private separateNotes() {
    const filtered = this.getFilteredNotes();
    this.pinnedNotes = filtered.filter(note => note.is_pinned);
    this.otherNotes = filtered.filter(note => !note.is_pinned);
  }
}
