import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NoteService } from '../../../core/services';
import { SearchService } from '../../../core/services';
import { Note } from '../../models';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteModalComponent } from '../note-modal/note-modal.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notes-board',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, NoteCardComponent, NoteModalComponent, DialogModule, ButtonModule],
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
  searchQuery: string = '';
  private searchSubscription: Subscription = new Subscription();

  // ✅ NUEVO: Agrupación de recordatorios
  reminderGroups: {
    today: Note[];
    tomorrow: Note[];
    thisWeek: Note[];
    upcoming: Note[];
  } = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    upcoming: []
  };

  // Modal de edición
  showEditModal = false;
  selectedNote: Note | null = null;

  // Modal de eliminación
  showDeleteModal = false;
  noteToDelete: Note | null = null;

  constructor(
    private noteService: NoteService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadNotes();
    // Suscribirse a los cambios de búsqueda
    this.searchSubscription = this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.separateNotes();
    });
  }

  loadNotes() {
    console.log('📋 NotesBoard: Iniciando carga de notas...');
    this.loading = true;
    this.error = false;

    this.noteService.getAll().subscribe({
      next: (notes) => {
        console.log('✅ NotesBoard: Notas recibidas:', notes.length, 'notas');
        this.notes = notes;
        this.separateNotes();
        this.loading = false;
        this.cdr.detectChanges();
        console.log('✅ NotesBoard: Notas cargadas correctamente');
      },
      error: (err) => {
        console.error('❌ NotesBoard - Error loading notes:', err);
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
    console.log('✏️ NotesBoard: Modal de edición cerrado - Recargando notas...');
    this.showEditModal = false;
    this.selectedNote = null;
    this.loadNotes();
  }

  onDeleteNote(noteId: number) {
    this.noteToDelete = this.notes.find(n => n.id === noteId) || null;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.noteToDelete = null;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (this.noteToDelete) {
      this.noteService.delete(this.noteToDelete.id).subscribe({
        next: () => {
          this.loadNotes();
          this.showDeleteModal = false;
          this.noteToDelete = null;
        },
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

    // Filtrar por vista actual
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

    // Filtrar por búsqueda si hay una consulta
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(note => {
        // Buscar en el título
        if (note.title && note.title.toLowerCase().includes(query)) {
          return true;
        }
        // Buscar en el contenido
        if (note.content && note.content.toLowerCase().includes(query)) {
          return true;
        }
        // Buscar en las etiquetas
        if (note.labels && note.labels.some(label =>
          label.name && label.name.toLowerCase().includes(query)
        )) {
          return true;
        }
        // Buscar en los checklist_items
        if (note.checklist_items && note.checklist_items.some(item =>
          item.content && item.content.toLowerCase().includes(query)
        )) {
          return true;
        }
        return false;
      });
    }

    return filtered;
  }

  private separateNotes() {
    const filtered = this.getFilteredNotes();

    if (this.currentView === 'recordatorios') {
      // ✅ NUEVO: Agrupar recordatorios por temporalidad
      this.groupReminders(filtered);
      this.pinnedNotes = [];
      this.otherNotes = [];
    } else {
      // Comportamiento normal para otras vistas
      this.pinnedNotes = filtered.filter(n => n.is_pinned);
      this.otherNotes  = filtered.filter(n => !n.is_pinned);

      // Resetear grupos de recordatorios
      this.reminderGroups = {
        today: [],
        tomorrow: [],
        thisWeek: [],
        upcoming: []
      };
    }
  }

  // ✅ NUEVO: Agrupar recordatorios por temporalidad
  private groupReminders(notes: Note[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const thisWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    // Reset groups
    this.reminderGroups = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      upcoming: []
    };

    notes.forEach(note => {
      if (!note.reminder_date) return;

      const reminder = new Date(note.reminder_date);
      const reminderDate = new Date(reminder.getFullYear(), reminder.getMonth(), reminder.getDate());

      if (reminderDate.getTime() === today.getTime()) {
        this.reminderGroups.today.push(note);
      } else if (reminderDate.getTime() === tomorrow.getTime()) {
        this.reminderGroups.tomorrow.push(note);
      } else if (reminderDate < thisWeekEnd) {
        this.reminderGroups.thisWeek.push(note);
      } else {
        this.reminderGroups.upcoming.push(note);
      }
    });
  }

  // ✅ NUEVO: Verificar si un grupo tiene notas
  hasNotesInGroup(group: 'today' | 'tomorrow' | 'thisWeek' | 'upcoming'): boolean {
    return this.reminderGroups[group].length > 0;
  }

  // ✅ NUEVO: Obtener etiqueta para el grupo
  getGroupLabel(group: 'today' | 'tomorrow' | 'thisWeek' | 'upcoming'): string {
    const labels = {
      today: '📅 Hoy',
      tomorrow: '📅 Mañana',
      thisWeek: '📅 Esta semana',
      upcoming: '📅 Próximos'
    };
    return labels[group];
  }

  ngOnDestroy() {
    // Limpiar la suscripción al destruir el componente
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}