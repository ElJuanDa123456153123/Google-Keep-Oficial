import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Note, ChecklistItem } from '../../models';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AvatarModule, MenuModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<number>();
  @Output() pin = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();
  @Output() toggleChecklist = new EventEmitter<{ noteId: number; itemId: number }>();

  isHovered = false;
  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.setupMenu();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovered = false;
  }

  private setupMenu() {
    this.menuItems = [
      {
        label: 'Eliminar la nota',
        icon: 'pi pi-trash',
        command: () => this.delete.emit(this.note.id)
      },
      {
        label: 'Añadir etiqueta',
        icon: 'pi pi-tag',
        command: () => console.log('Add label')
      },
      {
        label: 'Crear una copia',
        icon: 'pi pi-copy',
        command: () => console.log('Create copy')
      },
      {
        label: 'Mostrar casillas',
        icon: 'pi pi-check-square',
        command: () => console.log('Show checkboxes')
      },
      {
        separator: true
      },
      {
        label: 'Archivar',
        icon: 'pi pi-archive',
        command: () => this.archive.emit(this.note.id)
      }
    ];
  }

  onCardClick() {
    if (!this.isHovered) {
      this.edit.emit(this.note);
    }
  }

  onPinClick(event: Event) {
    event.stopPropagation();
    this.pin.emit(this.note.id);
  }

  onToggleCheckItem(itemId: number) {
    this.toggleChecklist.emit({
      noteId: this.note.id,
      itemId: itemId
    });
  }

  formatReminderDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    };
    return d.toLocaleDateString('es-ES', options);
  }

  getNoteColorClass(): string {
    const colorMap: { [key: string]: string } = {
      'default': 'note-bg-default',
      'red': 'note-bg-red',
      'orange': 'note-bg-orange',
      'yellow': 'note-bg-yellow',
      'green': 'note-bg-green',
      'teal': 'note-bg-teal',
      'blue': 'note-bg-blue',
      'darkblue': 'note-bg-darkblue',
      'purple': 'note-bg-purple',
      'pink': 'note-bg-pink',
      'gray': 'note-bg-gray'
    };
    return colorMap[this.note.color] || 'note-bg-default';
  }

  getCompletedCount(): number {
    return this.note.checklist_items?.filter(item => item.is_checked).length || 0;
  }

  getTotalCount(): number {
    return this.note.checklist_items?.length || 0;
  }
}
