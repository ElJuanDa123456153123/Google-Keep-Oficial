import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NoteService } from '../../../core/services';
import { CreateNoteDto, CreateChecklistItemDto } from '../../models';

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
  styleUrls: ['./note-modal.component.scss']
})
export class NoteModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() noteCreated = new EventEmitter<void>();

  isCreating = false;
  showTitle = false;
  showColorPicker = false;
  isChecklistMode = false;
  showImageUpload = false;
  showReminder = false;
  showCollaborators = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  colors = [
    { name: 'default', class: 'note-bg-default' },
    { name: 'red', class: 'note-bg-red' },
    { name: 'orange', class: 'note-bg-orange' },
    { name: 'yellow', class: 'note-bg-yellow' },
    { name: 'green', class: 'note-bg-green' },
    { name: 'teal', class: 'note-bg-teal' },
    { name: 'blue', class: 'note-bg-blue' },
    { name: 'darkblue', class: 'note-bg-darkblue' },
    { name: 'purple', class: 'note-bg-purple' },
    { name: 'pink', class: 'note-bg-pink' },
    { name: 'gray', class: 'note-bg-gray' }
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

  getModalColorClass(): string {
    return 'note-bg-' + (this.noteData.color || 'default');
  }

  onContentFocus() {
    this.showTitle = true;
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    const hasContent = this.noteData.title || this.noteData.content;
    const hasChecklistItems = this.checklistItems.some(item => item.content.trim());

    if (!hasContent && !hasChecklistItems) {
      this.onClose();
      return;
    }

    this.isCreating = true;

    const noteToCreate: CreateNoteDto = { ...this.noteData };

    if (this.isChecklistMode && this.checklistItems.length > 0) {
      noteToCreate.checklist_items = this.checklistItems
        .filter(item => item.content.trim())
        .map(item => ({
          content: item.content,
          position: item.position
        }));
      noteToCreate.content = undefined; // Don't send content if it's a checklist
    }

    // Don't send image_url for now - needs a proper upload endpoint
    // TODO: Implement file upload endpoint in backend
    delete noteToCreate.image_url;

    this.noteService.create(noteToCreate).subscribe({
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

  onOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onSave();
    }
  }

  onToggleColorPicker(event: Event) {
    event.stopPropagation();
    this.showColorPicker = !this.showColorPicker;
    // Close other popups
    this.showReminder = false;
    this.showCollaborators = false;
  }

  onColorSelect(color: string) {
    this.noteData.color = color;
    this.showColorPicker = false;
    this.cdr.detectChanges();
  }

  onColorPickerClose() {
    this.showColorPicker = false;
  }

  onTogglePin() {
    this.noteData.is_pinned = !this.noteData.is_pinned;
  }

  onToggleReminder() {
    this.showReminder = !this.showReminder;
    // Close other popups
    this.showColorPicker = false;
    this.showCollaborators = false;
  }

  setReminder(type: string) {
    console.log('Setting reminder:', type);
    // TODO: Implement reminder logic
    this.showReminder = false;
  }

  onToggleCollaborators() {
    this.showCollaborators = !this.showCollaborators;
    // Close other popups
    this.showColorPicker = false;
    this.showReminder = false;
  }

  addCollaborator() {
    console.log('Adding collaborator');
    // TODO: Implement collaborator logic
    this.showCollaborators = false;
  }

  onToggleChecklist() {
    this.isChecklistMode = !this.isChecklistMode;
    if (this.isChecklistMode && this.checklistItems.length === 0) {
      this.addChecklistItem();
    }
    // Close all popups
    this.showColorPicker = false;
    this.showReminder = false;
    this.showCollaborators = false;
    this.cdr.detectChanges();
  }

  onToggleImageUpload() {
    this.showImageUpload = !this.showImageUpload;
    // Close all popups
    this.showColorPicker = false;
    this.showReminder = false;
    this.showCollaborators = false;
    this.cdr.detectChanges();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.cdr.detectChanges(); // Force UI update
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
    // Update positions
    this.checklistItems.forEach((item, i) => {
      item.position = i;
    });
  }

  onChecklistItemContentChange(index: number, content: string) {
    this.checklistItems[index].content = content;
  }

  onChecklistItemCheckChange(index: number, checked: boolean) {
    this.checklistItems[index].is_checked = checked;
  }

  private resetForm() {
    this.noteData = {
      title: '',
      content: '',
      color: 'default',
      is_pinned: false
    };
    this.checklistItems = [];
    this.isChecklistMode = false;
    this.showImageUpload = false;
    this.showTitle = false;
    this.showColorPicker = false;
    this.showReminder = false;
    this.showCollaborators = false;
    this.imagePreview = null;
    this.selectedFile = null;
  }
}
