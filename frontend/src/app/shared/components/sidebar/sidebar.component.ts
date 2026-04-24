import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LabelService } from '../../../core/services';
import { Label } from '../../models';
import { LabelModalComponent } from '../label-modal/label-modal.component';

export interface SidebarMenuItem {
  icon: string;
  label: string;
  active?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonModule, LabelModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() viewChange = new EventEmitter<string>();

  currentView: string = 'notes';
  labels: Label[] = [];
  showLabelModal = false;
  labelsLoaded = false;

  mainItems: SidebarMenuItem[] = [
    { icon: 'pi pi-lightbulb', label: 'Notas', active: true },
    { icon: 'pi pi-bell', label: 'Recordatorios', active: false }
  ];

  constructor(private labelService: LabelService) {}

  ngOnInit() {
    this.loadLabels();
  }

  loadLabels() {
    // TODO: Get user ID from auth service
    this.labelService.getByUserId(1).subscribe({
      next: (labels) => {
        setTimeout(() => {
          this.labels = labels || [];
          this.labelsLoaded = true;
        }, 0);
      },
      error: (err) => {
        console.error('Error loading labels:', err);
        setTimeout(() => {
          this.labels = [];
          this.labelsLoaded = true;
        }, 0);
      }
    });
  }

  onMainItemClick(item: SidebarMenuItem) {
    this.mainItems.forEach(i => i.active = false);
    item.active = true;
    this.currentView = item.label.toLowerCase();
    this.viewChange.emit(this.currentView);
  }

  onLabelClick(label: Label) {
    this.mainItems.forEach(i => i.active = false);
    this.currentView = `label:${label.name}`;
    this.viewChange.emit(this.currentView);
  }

  onTrashClick() {
    this.mainItems.forEach(i => i.active = false);
    this.currentView = 'trash';
    this.viewChange.emit(this.currentView);
  }

  addNewLabel() {
    this.showLabelModal = true;
  }

  onLabelModalClose() {
    this.showLabelModal = false;
  }

  onLabelCreated() {
    this.showLabelModal = false;
    this.loadLabels();
  }
}
