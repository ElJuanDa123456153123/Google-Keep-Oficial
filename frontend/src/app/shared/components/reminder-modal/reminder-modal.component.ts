// frontend/src/app/shared/components/reminder-modal/reminder-modal.component.ts

import {
  Component, Input, Output, EventEmitter, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface QuickSuggestion {
  label: string;
  icon: string;
  getDate: () => Date;
}

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

  // ✅ Inputs por separado
  selectedDate = '';
  selectedTime = '';

  errorMessage = '';
  todayDate = '';
  minDate = '';

  // ✅ Sugerencias inteligentes
  quickSuggestions: QuickSuggestion[] = [];

  ngOnInit() {
    this.initializeDateLimits();
    this.initializeDefaultDateTime();
    this.initializeSuggestions();
  }

  // ── Inicialización ─────────────────────────────────────────────

  private initializeDateLimits() {
    const now = new Date();
    this.todayDate = now.toISOString().split('T')[0];
    this.minDate = this.todayDate;
  }

  private initializeDefaultDateTime() {
    if (this.existingReminder) {
      const d = new Date(this.existingReminder);
      this.selectedDate = d.toISOString().split('T')[0];
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      this.selectedTime = `${hh}:${mm}`;
      return;
    }

    // ✅ HORA INTELIGENTE: Calcular próxima hora lógica
    const now = new Date();
    const currentHour = now.getHours();

    let defaultDateTime = new Date();

    // Si es muy tarde (después de 8 PM), sugerir mañana a las 9 AM
    if (currentHour >= 20) {
      defaultDateTime.setDate(defaultDateTime.getDate() + 1);
      defaultDateTime.setHours(9, 0, 0, 0);
    }
    // Si es muy temprano (antes de 6 AM), sugerir hoy a las 9 AM
    else if (currentHour < 6) {
      defaultDateTime.setHours(9, 0, 0, 0);
    }
    // Si es horario normal, sugerir próxima hora en punto
    else {
      defaultDateTime.setHours(currentHour + 1, 0, 0, 0);
    }

    this.selectedDate = defaultDateTime.toISOString().split('T')[0];
    const hh = String(defaultDateTime.getHours()).padStart(2, '0');
    const mm = String(defaultDateTime.getMinutes()).padStart(2, '0');
    this.selectedTime = `${hh}:${mm}`;
  }

  private initializeSuggestions() {
    const now = new Date();
    const currentHour = now.getHours();

    // ✅ Sugerencia 1: Esta mañana / Esta tarde
    if (currentHour < 12) {
      // Por la mañana: sugerir "Esta mañana" a las 9 AM si aún es temprano
      if (currentHour < 9) {
        this.quickSuggestions.push({
          label: 'Esta mañana a las 9:00 AM',
          icon: 'pi pi-sun',
          getDate: () => {
            const d = new Date();
            d.setHours(9, 0, 0, 0);
            return d;
          }
        });
      }
      // Sugerir "Esta tarde" a las 3 PM
      this.quickSuggestions.push({
        label: 'Esta tarde a las 3:00 PM',
        icon: 'pi pi-clock',
        getDate: () => {
          const d = new Date();
          d.setHours(15, 0, 0, 0);
          return d;
        }
      });
    } else {
      // Por la tarde/noche: sugerir mañana mañana
      this.quickSuggestions.push({
        label: 'Mañana a las 9:00 AM',
        icon: 'pi pi-moon',
        getDate: () => {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          d.setHours(9, 0, 0, 0);
          return d;
        }
      });
    }

    // ✅ Sugerencia 2: Próximo lunes (si hoy no es lunes)
    const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes
    if (dayOfWeek !== 1) {
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      this.quickSuggestions.push({
        label: dayOfWeek === 0 ? 'Mañana (lunes) a las 9:00 AM' : 'El próximo lunes a las 9:00 AM',
        icon: 'pi pi-calendar',
        getDate: () => {
          const d = new Date();
          d.setDate(d.getDate() + daysUntilMonday);
          d.setHours(9, 0, 0, 0);
          return d;
        }
      });
    }

    // ✅ Sugerencia 3: Próxima semana (si no hay muchas sugerencias)
    if (this.quickSuggestions.length < 3) {
      this.quickSuggestions.push({
        label: 'La próxima semana a las 9:00 AM',
        icon: 'pi pi-calendar-times',
        getDate: () => {
          const d = new Date();
          d.setDate(d.getDate() + 7);
          d.setHours(9, 0, 0, 0);
          return d;
        }
      });
    }
  }

  // ── Helpers ────────────────────────────────────────────────────

  getSelectedDateTimeLiteral(): string {
    if (!this.selectedDate || !this.selectedTime) {
      return '';
    }

    const date = new Date(`${this.selectedDate}T${this.selectedTime}:00`);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = days[date.getDay()];

    const dayNum = date.getDate();

    const timeStr = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let dateStr = '';

    if (targetDate.getTime() === today.getTime()) {
      dateStr = 'hoy';
    } else if (targetDate.getTime() === tomorrow.getTime()) {
      dateStr = 'mañana';
    } else {
      dateStr = `el ${dayName} ${dayNum}`;
    }

    return `${dateStr} a las ${timeStr}`;
  }

  // ── Acciones ───────────────────────────────────────────────────

  onSelectSuggestion(suggestion: QuickSuggestion) {
    const date = suggestion.getDate();
    this.selectedDate = date.toISOString().split('T')[0];
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    this.selectedTime = `${hh}:${mm}`;
    this.reminderSaved.emit(date);
  }

  onSave() {
    if (!this.selectedDate || !this.selectedTime) {
      this.errorMessage = 'Por favor selecciona fecha y hora.';
      return;
    }

    const selected = new Date(`${this.selectedDate}T${this.selectedTime}:00`);
    const now = new Date();

    if (isNaN(selected.getTime())) {
      this.errorMessage = 'Fecha u hora inválida.';
      return;
    }

    if (selected <= now) {
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