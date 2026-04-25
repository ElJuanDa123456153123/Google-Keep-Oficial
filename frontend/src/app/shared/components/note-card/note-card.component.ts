import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, HostBinding
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Note } from '../../models';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AvatarModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit, OnChanges {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<number>();
  @Output() pin = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();
  @Output() toggleChecklist = new EventEmitter<{ noteId: number; itemId: number }>();

  // Aplica la clase de color directamente al elemento host <app-note-card>
  @HostBinding('class') get hostClasses(): string {
    const color = this.note?.color || 'default';
    const pinned = this.note?.is_pinned ? 'pinned' : '';
    return `note-bg-${color} ${pinned}`.trim();
  }

  ngOnInit() {}
  ngOnChanges() {}

  onCardClick() {
    this.edit.emit(this.note);
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.note.id);
  }

  onPinClick(event: Event) {
    event.stopPropagation();
    this.pin.emit(this.note.id);
  }

  onToggleCheckItem(itemId: number) {
    this.toggleChecklist.emit({ noteId: this.note.id, itemId });
  }

  formatReminderDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'short', day: 'numeric', month: 'short'
    });
  }

  // Mantenido por compatibilidad, ya no se usa en el template
  getNoteColorClass(): string {
    return `note-bg-${this.note?.color || 'default'}`;
  }

  getCompletedCount(): number {
    return this.note.checklist_items?.filter(i => i.is_checked).length || 0;
  }

  getTotalCount(): number {
    return this.note.checklist_items?.length || 0;
  }
}