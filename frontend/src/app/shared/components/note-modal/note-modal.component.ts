import {
  Component, Input, Output, EventEmitter,
  ChangeDetectorRef, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  trigger, style, transition, animate
} from '@angular/animations';
import { NoteService } from '../../../core/services';
import { CreateNoteDto, Note, Collaborator } from '../../models';
import { ReminderModalComponent } from '../reminder-modal/reminder-modal.component';
// ✅ NUEVO: importar el modal de colaboradores
import { CollaboratorModalComponent } from '../collaborator-modal/collaborator-modal.component';

interface ChecklistItemLocal {
  content: string;
  is_checked: boolean;
  position: number;
}

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ReminderModalComponent,
    CollaboratorModalComponent  // ✅ NUEVO
  ],
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.scss'],
  animations: [
    trigger('overlayAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(-8px)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('140ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(-8px)' }))
      ])
    ])
  ]
})
export class NoteModalComponent implements OnInit {
  @Input() editNote: Note | null = null;

  @Output() close       = new EventEmitter<void>();
  @Output() noteCreated = new EventEmitter<void>();

  isCreating = false;
  isEditMode = false;

  showColorPicker   = false;
  isChecklistMode   = false;
  showImageUpload   = false;
  showCollaborators = false;  // ✅ Ahora controla el CollaboratorModalComponent
  showReminderModal = false;

  imagePreview: string | null = null;
  selectedFile: File | null   = null;
  reminderDate: Date | null   = null;

  // ✅ NUEVO: colaboradores de la nota actual
  noteCollaborators: Collaborator[] = [];

  colors = [
    { name: 'default',  class: 'note-bg-default'  },
    { name: 'red',      class: 'note-bg-red'      },
    { name: 'orange',   class: 'note-bg-orange'   },
    { name: 'yellow',   class: 'note-bg-yellow'   },
    { name: 'green',    class: 'note-bg-green'    },
    { name: 'teal',     class: 'note-bg-teal'     },
    { name: 'blue',     class: 'note-bg-blue'     },
    { name: 'darkblue', class: 'note-bg-darkblue' },
    { name: 'purple',   class: 'note-bg-purple'   },
    { name: 'pink',     class: 'note-bg-pink'     },
    { name: 'gray',     class: 'note-bg-gray'     }
  ];

  checklistItems: ChecklistItemLocal[] = [];

  noteData: CreateNoteDto = {
    title:     '',
    content:   '',
    color:     'default',
    is_pinned: false
  };

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.editNote) {
      this.isEditMode = true;
      this.noteData = {
        title:     this.editNote.title     || '',
        content:   this.editNote.content   || '',
        color:     this.editNote.color     || 'default',
        is_pinned: this.editNote.is_pinned || false
      };

      if (this.editNote.reminder_date) {
        this.reminderDate = new Date(this.editNote.reminder_date);
      }

      if (this.editNote.checklist_items?.length) {
        this.isChecklistMode = true;
        this.checklistItems = this.editNote.checklist_items.map(item => ({
          content:    item.content,
          is_checked: item.is_checked,
          position:   item.position
        }));
      }

      if (this.editNote.image_url) {
        this.imagePreview    = this.editNote.image_url;
        this.showImageUpload = true;
      }

      // ✅ NUEVO: cargar colaboradores existentes de la nota
      if (this.editNote.collaborators?.length) {
        this.noteCollaborators = [...this.editNote.collaborators];
      }
    }
  }

  getModalColorClass(): string {
    return 'note-bg-' + (this.noteData.color || 'default');
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    const hasContent        = this.noteData.title?.trim() || this.noteData.content?.trim();
    const hasChecklistItems = this.checklistItems.some(item => item.content.trim());

    if (!hasContent && !hasChecklistItems) {
      this.onClose();
      return;
    }

    this.isCreating = true;

    if (this.selectedFile) {
      this.noteService.uploadImage(this.selectedFile).subscribe({
        next:  (res) => {
          console.log('✅ Imagen subida:', res.url);
          this.saveNote(res.url);
        },
        error: (err) => {
          console.error('❌ Error uploading image:', err);
          this.isCreating = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      const existingUrl = this.isEditMode ? (this.imagePreview || undefined) : undefined;
      this.saveNote(existingUrl);
    }
  }

  private saveNote(imageUrl?: string) {
    const noteToSave: CreateNoteDto = {
      title:     this.noteData.title    || '',
      color:     this.noteData.color    || 'default',
      is_pinned: this.noteData.is_pinned ?? false,
      image_url: imageUrl,
      reminder_date: this.reminderDate
        ? (this.reminderDate.toISOString() as unknown as Date)
        : undefined
    };

    if (this.isChecklistMode) {
      noteToSave.checklist_items = this.checklistItems
        .filter(item => item.content.trim())
        .map((item, i) => ({
          content:    item.content,
          is_checked: item.is_checked,
          position:   item.position ?? i
        }));
    } else {
      noteToSave.content = this.noteData.content || '';
    }

    console.log('💾 Guardando nota:', noteToSave);

    if (this.isEditMode && this.editNote) {
      console.log('✏️ Modo edición - ID:', this.editNote.id);
      this.noteService.update(this.editNote.id, noteToSave).subscribe({
        next: (response) => {
          console.log('✅ Nota actualizada:', response);
          this.isCreating = false;

          // ✅ Primero emitir noteCreated para recargar
          this.noteCreated.emit();

          // ✅ Luego cerrar el modal con un pequeño delay
          setTimeout(() => {
            this.close.emit();
          }, 50);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error updating note:', err);
          this.isCreating = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.log('➕ Modo creación - Nueva nota');
      this.noteService.create(noteToSave).subscribe({
        next: (response) => {
          console.log('✅ Nota creada:', response);
          this.isCreating = false;

          // ✅ Emitir close primero para cerrar el modal
          this.close.emit();

          // ✅ Luego emitir noteCreated para recargar notas
          this.noteCreated.emit();

          // Resetear el formulario
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error creating note:', err);
          this.isCreating = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  getReminderChipLabel(): string {
    if (!this.reminderDate) return '';
    const d        = this.reminderDate;
    const now      = new Date();
    const today    = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const target   = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const timeStr = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    if (target.getTime() === today.getTime())    return `Hoy, ${timeStr}`;
    if (target.getTime() === tomorrow.getTime()) return `Mañana, ${timeStr}`;

    return d.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric'
    }) + `, ${timeStr}`;
  }

  onOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      setTimeout(() => this.onSave(), 10);
    }
  }

  // ── Color ──────────────────────────────────────────────────────
  onToggleColorPicker(event: Event) {
    event.stopPropagation();
    this.showColorPicker   = !this.showColorPicker;
    this.showCollaborators = false;
    this.showReminderModal = false;
  }

  onColorSelect(color: string) {
    this.noteData.color  = color;
    this.showColorPicker = false;
    this.cdr.detectChanges();
  }

  // ── Pin ────────────────────────────────────────────────────────
  onTogglePin() {
    this.noteData.is_pinned = !this.noteData.is_pinned;
  }

  // ── Recordatorio ───────────────────────────────────────────────
  onToggleReminder() {
    this.showReminderModal = true;
    this.showColorPicker   = false;
    this.showCollaborators = false;
  }

  onReminderSaved(date: Date) {
    this.reminderDate      = date;
    this.showReminderModal = false;
  }

  onReminderCleared() {
    this.reminderDate      = null;
    this.showReminderModal = false;
  }

  onReminderCancelled() {
    this.showReminderModal = false;
  }

  // ── Colaboradores ──────────────────────────────────────────────
  onToggleCollaborators() {
    this.showCollaborators = !this.showCollaborators;
    this.showColorPicker   = false;
    this.showReminderModal = false;
  }

  // ✅ NUEVO: recibe la lista final cuando el modal de colaboradores cierra
  onCollaboratorsClosed(updatedList: Collaborator[]) {
    this.noteCollaborators = updatedList;
    this.showCollaborators = false;
    this.cdr.detectChanges();
  }

  // ── Checklist ──────────────────────────────────────────────────
  onToggleChecklist() {
    this.isChecklistMode = !this.isChecklistMode;
    if (this.isChecklistMode && this.checklistItems.length === 0) {
      this.addChecklistItem();
    }
    this.showColorPicker   = false;
    this.showCollaborators = false;
    this.showReminderModal = false;
    this.cdr.detectChanges();
  }

  // ── Imagen ─────────────────────────────────────────────────────
  onToggleImageUpload() {
    this.showImageUpload   = !this.showImageUpload;
    this.showColorPicker   = false;
    this.showCollaborators = false;
    this.showReminderModal = false;
    this.cdr.detectChanges();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage() {
    this.selectedFile    = null;
    this.imagePreview    = null;
    this.showImageUpload = false;
  }

  addChecklistItem() {
    this.checklistItems.push({
      content:    '',
      is_checked: false,
      position:   this.checklistItems.length
    });
  }

  removeChecklistItem(index: number) {
    this.checklistItems.splice(index, 1);
    this.checklistItems.forEach((item, i) => { item.position = i; });
  }

  onChecklistItemCheckChange(index: number, checked: boolean) {
    this.checklistItems[index].is_checked = checked;
  }

  // ✅ NUEVO: helper para obtener iniciales del colaborador (usado en chips del modal)
  getCollaboratorInitials(collab: Collaborator): string {
    const name = collab.user?.name;
    if (!name) return '?';
    return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  }

  private resetForm() {
    this.noteData = { title: '', content: '', color: 'default', is_pinned: false };
    this.checklistItems    = [];
    this.isChecklistMode   = false;
    this.showImageUpload   = false;
    this.showColorPicker   = false;
    this.showCollaborators = false;
    this.showReminderModal = false;
    this.reminderDate      = null;
    this.imagePreview      = null;
    this.selectedFile      = null;
    this.noteCollaborators = [];  // ✅ NUEVO
  }
}