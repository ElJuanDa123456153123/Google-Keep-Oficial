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
  @Output() edit           = new EventEmitter<Note>();
  @Output() delete         = new EventEmitter<number>();
  @Output() pin            = new EventEmitter<number>();
  @Output() archive        = new EventEmitter<number>();
  @Output() toggleChecklist = new EventEmitter<{ noteId: number; itemId: number }>();

  @HostBinding('class') get hostClasses(): string {
    const color  = this.note?.color     || 'default';
    const pinned = this.note?.is_pinned ? 'pinned' : '';
    return `note-bg-${color} ${pinned}`.trim();
  }

  ngOnInit()    {}
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

  /**
   * Formatea la fecha del recordatorio de forma legible en español.
   * Muestra "Hoy" o "Mañana" cuando aplica, seguido de la hora.
   */
  formatReminderDate(date: Date | string): string {
    if (!date) return '';

    const d   = new Date(date);
    const now  = new Date();

    const today    = new Date(now.getFullYear(),  now.getMonth(),  now.getDate());
    const tomorrow = new Date(now.getFullYear(),  now.getMonth(),  now.getDate() + 1);
    const target   = new Date(d.getFullYear(),    d.getMonth(),    d.getDate());

    const timeStr = d.toLocaleTimeString('es-ES', {
      hour:   '2-digit',
      minute: '2-digit'
    });

    if (target.getTime() === today.getTime())    return `Hoy, ${timeStr}`;
    if (target.getTime() === tomorrow.getTime()) return `Mañana, ${timeStr}`;

    return d.toLocaleDateString('es-ES', {
      day:   'numeric',
      month: 'short',
      year:  'numeric'
    }) + `, ${timeStr}`;
  }

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