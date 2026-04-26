import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NoteService } from '../../../core/services';
import { Note } from '../../models';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteModalComponent } from '../note-modal/note-modal.component';

@Component({
  selector: 'app-notes-board',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, NoteCardComponent, NoteModalComponent],
  templateUrl: './notes-board.component.html',
  styleUrls: ['./notes-board.component.scss']
})
export class NotesBoardComponent implements OnInit {
  notes: Note[] = [];
  pinnedNotes: Note[] = [];
  otherNotes: Note[] = [];
  loading = true;
  error = false;
  currentView: string = 'notas';

  // Modal de edición
  showEditModal = false;
  selectedNote: Note | null = null;

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.loading = true;
    this.error = false;

    this.noteService.getAll().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.separateNotes();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('NotesBoard - Error loading notes:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Abre el modal de edición con la nota seleccionada
  onEditNote(note: Note) {
    this.selectedNote = note;
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  onEditModalClose() {
    this.showEditModal = false;
    this.selectedNote = null;
    this.cdr.detectChanges();
  }

  onEditModalSaved() {
    this.showEditModal = false;
    this.selectedNote = null;
    this.loadNotes();
  }

  onDeleteNote(noteId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      this.noteService.delete(noteId).subscribe({
        next: () => this.loadNotes(),
        error: (err) => console.error('Error deleting note:', err)
      });
    }
  }

  onPinNote(noteId: number) {
    this.noteService.togglePin(noteId).subscribe({
      next: () => this.loadNotes(),
      error: (err) => console.error('Error pinning note:', err)
    });
  }

  onArchiveNote(noteId: number) {
    this.noteService.archive(noteId).subscribe({
      next: () => this.loadNotes(),
      error: (err) => console.error('Error archiving note:', err)
    });
  }

  onToggleChecklist(data: { noteId: number; itemId: number }) {
    this.noteService.toggleChecklistItem(data.itemId).subscribe({
      next: () => this.loadNotes(),
      error: (err) => console.error('Error toggling checklist item:', err)
    });
  }

  setCurrentView(view: string) {
    this.currentView = view;
    this.separateNotes();
    this.cdr.detectChanges();
  }

  private getFilteredNotes(): Note[] {
    let filtered = this.notes;
    if (this.currentView === 'notas') {
      filtered = filtered.filter(n => !n.is_archived && !n.is_deleted);
    } else if (this.currentView === 'recordatorios') {
      filtered = filtered.filter(n => n.reminder_date && !n.is_deleted);
    } else if (this.currentView === 'trash') {
      filtered = filtered.filter(n => n.is_deleted);
    } else if (this.currentView.startsWith('label:')) {
      const labelName = this.currentView.replace('label:', '');
      filtered = filtered.filter(n =>
        !n.is_deleted && n.labels?.some(l => l.name === labelName)
      );
    }
    return filtered;
  }

  private separateNotes() {
    const filtered = this.getFilteredNotes();
    this.pinnedNotes = filtered.filter(n => n.is_pinned);
    this.otherNotes  = filtered.filter(n => !n.is_pinned);
  }
}