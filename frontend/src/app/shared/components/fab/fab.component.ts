import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-fab',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent {
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
