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
  @Input() isTrashView = false;
  @Output() edit           = new EventEmitter<Note>();
  @Output() delete         = new EventEmitter<number>();
  @Output() pin            = new EventEmitter<number>();
  @Output() archive        = new EventEmitter<number>();
  @Output() restore        = new EventEmitter<number>();
  @Output() permanentDelete = new EventEmitter<number>();
  @Output() toggleChecklist = new EventEmitter<{ noteId: number; itemId: number }>();
  @Output() labelToggle    = new EventEmitter<Note>();  // ✅ NUEVO: edición rápida de etiquetas

  @HostBinding('class') get hostClasses(): string {
    const color        = this.note?.color              || 'default';
    const pinned       = this.note?.is_pinned          ? 'pinned' : '';
    const hasReminder  = this.note?.reminder_date      ? 'has-reminder' : '';
    const reminderSoon = this.isReminderSoon()         ? 'reminder-soon' : '';
    return `note-bg-${color} ${pinned} ${hasReminder} ${reminderSoon}`.trim();
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

  // ✅ NUEVO: edición rápida de etiquetas
  onLabelClick(event: Event) {
    event.stopPropagation();
    this.labelToggle.emit(this.note);
  }

  onToggleCheckItem(itemId: number) {
    this.toggleChecklist.emit({ noteId: this.note.id, itemId });
  }

  onRestoreClick(event: Event) {
    event.stopPropagation();
    this.restore.emit(this.note.id);
  }

  onPermanentDeleteClick(event: Event) {
    event.stopPropagation();
    this.permanentDelete.emit(this.note.id);
  }

  // ── Recordatorios ───────────────────────────────────────────────

  /**
   * Verifica si el recordatorio es en menos de 1 hora
   */
  isReminderSoon(): boolean {
    if (!this.note?.reminder_date) return false;

    const reminder = new Date(this.note.reminder_date);
    const now = new Date();
    const diffMs = reminder.getTime() - now.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    return diffMinutes > 0 && diffMinutes < 60;
  }

  /**
   * Formatea el recordatorio como countdown relativo
   * Ej: "En 23 minutos", "Mañana a las 9:00 AM", etc.
   */
  formatReminderCountdown(date: Date | string): string {
    if (!date) return '';

    const reminder = new Date(date);
    const now = new Date();
    const diffMs = reminder.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Si ya pasó
    if (diffMs < 0) {
      return 'Recordatorio vencido';
    }

    // Menos de 1 hora
    if (diffMinutes < 60) {
      if (diffMinutes <= 1) return 'En 1 minuto';
      return `En ${diffMinutes} minutos`;
    }

    // Menos de 24 horas
    if (diffHours < 24) {
      if (diffHours === 1) return 'En 1 hora';
      return `En ${diffHours} horas`;
    }

    // Menos de 7 días - mostrar día de la semana
    if (diffDays < 7) {
      const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const dayName = days[reminder.getDay()];
      const timeStr = reminder.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const targetDate = new Date(reminder.getFullYear(), reminder.getMonth(), reminder.getDate());

      if (targetDate.getTime() === today.getTime()) {
        return `Hoy a las ${timeStr}`;
      }
      if (targetDate.getTime() === tomorrow.getTime()) {
        return `Mañana a las ${timeStr}`;
      }

      return `El ${dayName} a las ${timeStr}`;
    }

    // Más de 7 días - mostrar fecha completa
    return reminder.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + reminder.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatea la fecha del recordatorio de forma legible (versión antigua, mantenida por compatibilidad)
   */
  formatReminderDate(date: Date | string): string {
    return this.formatReminderCountdown(date);
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