import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { LabelService } from '../../../core/services';
import { CreateLabelDto } from '../../models';

@Component({
  selector: 'app-label-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './label-modal.component.html',
  styleUrls: ['./label-modal.component.scss']
})
export class LabelModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() labelCreated = new EventEmitter<void>();

  isCreating = false;
  labelName = '';

  constructor(private labelService: LabelService) {}

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (!this.labelName.trim()) {
      return;
    }

    this.isCreating = true;

    const labelDto: CreateLabelDto = {
      name: this.labelName.trim(),
      user_id: 1 // TODO: Get from auth service
    };

    this.labelService.create(labelDto).subscribe({
      next: () => {
        this.isCreating = false;
        this.labelCreated.emit();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating label:', err);
        this.isCreating = false;
      }
    });
  }

  onOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSave();
    } else if (event.key === 'Escape') {
      this.onClose();
    }
  }

  private resetForm() {
    this.labelName = '';
  }
}
