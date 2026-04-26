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
import { CreateNoteDto, Note } from '../../models';

interface ChecklistItemLocal {
  content: string;
  is_checked: boolean;
  position: number;
}

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
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

  @Output() close = new EventEmitter<void>();
  @Output() noteCreated = new EventEmitter<void>();

  isCreating = false;
  isEditMode = false;

  showColorPicker = false;
  isChecklistMode = false;
  showImageUpload = false;
  showReminder = false;
  showCollaborators = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  colors = [
    { name: 'default',  class: 'note-bg-default' },
    { name: 'red',      class: 'note-bg-red' },
    { name: 'orange',   class: 'note-bg-orange' },
    { name: 'yellow',   class: 'note-bg-yellow' },
    { name: 'green',    class: 'note-bg-green' },
    { name: 'teal',     class: 'note-bg-teal' },
    { name: 'blue',     class: 'note-bg-blue' },
    { name: 'darkblue', class: 'note-bg-darkblue' },
    { name: 'purple',   class: 'note-bg-purple' },
    { name: 'pink',     class: 'note-bg-pink' },
    { name: 'gray',     class: 'note-bg-gray' }
  ];

  checklistItems: ChecklistItemLocal[] = [];

  noteData: CreateNoteDto = {
    title: '',
    content: '',
    color: 'default',
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
      if (this.editNote.checklist_items?.length) {
        this.isChecklistMode = true;
        this.checklistItems = this.editNote.checklist_items.map(item => ({
          content:    item.content,
          is_checked: item.is_checked,
          position:   item.position
        }));
      }
      if (this.editNote.image_url) {
        this.imagePreview = this.editNote.image_url;
        this.showImageUpload = true;
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
      const hasContent = this.noteData.title?.trim() || this.noteData.content?.trim();
      const hasChecklistItems = this.checklistItems.some(item => item.content.trim());

      if (!hasContent && !hasChecklistItems) {
        this.onClose();
        return;
      }

      this.isCreating = true;

      // Si hay archivo nuevo, primero subirlo
      if (this.selectedFile) {
        this.noteService.uploadImage(this.selectedFile).subscribe({
          next: (res) => {
            this.saveNote(res.url);
          },
          error: (err) => {
            console.error('Error uploading image:', err);
            this.isCreating = false;
          }
        });
      } else {
        // Sin imagen nueva, usar la existente o null
        const existingUrl = this.isEditMode ? (this.imagePreview || undefined) : undefined;
        this.saveNote(existingUrl);
      }
    }

    private saveNote(imageUrl?: string) {
      const noteToSave: CreateNoteDto = {
        title:     this.noteData.title    || '',
        color:     this.noteData.color    || 'default',
        is_pinned: this.noteData.is_pinned ?? false,
        image_url: imageUrl
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

      if (this.isEditMode && this.editNote) {
        this.noteService.update(this.editNote.id, noteToSave).subscribe({
          next: () => {
            this.isCreating = false;
            this.noteCreated.emit();
          },
          error: (err) => {
            console.error('Error updating note:', err);
            this.isCreating = false;
          }
        });
      } else {
        this.noteService.create(noteToSave).subscribe({
          next: () => {
            this.isCreating = false;
            this.noteCreated.emit();
            this.resetForm();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error creating note:', err);
            this.isCreating = false;
          }
        });
      }
    }

  onOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      setTimeout(() => this.onSave(), 10);
    }
  }

  onToggleColorPicker(event: Event) {
    event.stopPropagation();
    this.showColorPicker = !this.showColorPicker;
    this.showReminder = false;
    this.showCollaborators = false;
  }

  onColorSelect(color: string) {
    this.noteData.color = color;
    this.showColorPicker = false;
    this.cdr.detectChanges();
  }

  onTogglePin() {
    this.noteData.is_pinned = !this.noteData.is_pinned;
  }

  onToggleReminder() {
    this.showReminder = !this.showReminder;
    this.showColorPicker = false;
    this.showCollaborators = false;
  }

  setReminder(type: string) {
    console.log('Setting reminder:', type);
    this.showReminder = false;
  }

  onToggleCollaborators() {
    this.showCollaborators = !this.showCollaborators;
    this.showColorPicker = false;
    this.showReminder = false;
  }

  addCollaborator() {
    this.showCollaborators = false;
  }

  onToggleChecklist() {
    this.isChecklistMode = !this.isChecklistMode;
    if (this.isChecklistMode && this.checklistItems.length === 0) {
      this.addChecklistItem();
    }
    this.showColorPicker = false;
    this.showReminder = false;
    this.showCollaborators = false;
    this.cdr.detectChanges();
  }

  onToggleImageUpload() {
    this.showImageUpload = !this.showImageUpload;
    this.showColorPicker = false;
    this.showReminder = false;
    this.showCollaborators = false;
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
    this.selectedFile = null;
    this.imagePreview = null;
    this.showImageUpload = false;
  }

  addChecklistItem() {
    this.checklistItems.push({
      content: '',
      is_checked: false,
      position: this.checklistItems.length
    });
  }

  removeChecklistItem(index: number) {
    this.checklistItems.splice(index, 1);
    this.checklistItems.forEach((item, i) => { item.position = i; });
  }

  onChecklistItemCheckChange(index: number, checked: boolean) {
    this.checklistItems[index].is_checked = checked;
  }

  private resetForm() {
    this.noteData = { title: '', content: '', color: 'default', is_pinned: false };
    this.checklistItems = [];
    this.isChecklistMode = false;
    this.showImageUpload = false;
    this.showColorPicker = false;
    this.showReminder = false;
    this.showCollaborators = false;
    this.imagePreview = null;
    this.selectedFile = null;
  }
}