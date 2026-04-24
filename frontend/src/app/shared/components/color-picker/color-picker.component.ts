import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Output() colorSelect = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

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

  onColorClick(color: string) {
    this.colorSelect.emit(color);
  }

  onClose() {
    this.close.emit();
  }

  onOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
