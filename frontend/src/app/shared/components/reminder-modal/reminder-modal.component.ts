// frontend/src/app/shared/components/reminder-modal/reminder-modal.component.ts

import {
  Component, Input, Output, EventEmitter, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reminder-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './reminder-modal.component.html',
  styleUrls: ['./reminder-modal.component.scss']
})
export class ReminderModalComponent implements OnInit {
  @Input() existingReminder: Date | null = null;

  @Output() reminderSaved  = new EventEmitter<Date>();
  @Output() reminderCleared = new EventEmitter<void>();
  @Output() cancelled       = new EventEmitter<void>();

  customDate = '';
  customTime = '';
  errorMessage = '';
  today = '';

  ngOnInit() {
    // Calcular el mínimo de fecha (hoy)
    const now = new Date();
    this.today = now.toISOString().split('T')[0];

    // Si ya hay recordatorio guardado, prellenar los campos
    if (this.existingReminder) {
      const d = new Date(this.existingReminder);
      this.customDate = d.toISOString().split('T')[0];
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      this.customTime = `${hh}:${mm}`;
    }
  }

  // ── Opciones rápidas ──────────────────────────────────────────

  setQuick(option: 'today' | 'tomorrow' | 'nextweek') {
    const d = new Date();
    d.setSeconds(0, 0);

    if (option === 'today') {
      d.setHours(9, 0);
    } else if (option === 'tomorrow') {
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0);
    } else {
      d.setDate(d.getDate() + 7);
      d.setHours(9, 0);
    }

    this.reminderSaved.emit(d);
  }

  // ── Sección personalizado ──────────────────────────────────────

  onSaveCustom() {
    this.errorMessage = '';

    if (!this.customDate || !this.customTime) {
      this.errorMessage = 'Por favor completa la fecha y la hora.';
      return;
    }

    const selected = new Date(`${this.customDate}T${this.customTime}:00`);

    if (isNaN(selected.getTime())) {
      this.errorMessage = 'Fecha u hora inválida.';
      return;
    }

    if (selected <= new Date()) {
      this.errorMessage = 'La fecha y hora deben ser futuras.';
      return;
    }

    this.reminderSaved.emit(selected);
  }

  onClear() {
    this.reminderCleared.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}