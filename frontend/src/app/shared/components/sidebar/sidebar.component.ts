import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LabelService, AuthService } from '../../../core/services';
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
  @Input() isOpen = false;
  @Output() viewChange = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  currentView: string = 'notes';
  labels: Label[] = [];
  showLabelModal = false;
  labelsLoaded = false;

  mainItems: SidebarMenuItem[] = [
    { icon: 'pi pi-lightbulb', label: 'Notas', active: true },
    { icon: 'pi pi-bell', label: 'Recordatorios', active: false }
  ];

  constructor(
    private labelService: LabelService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadLabels();
  }

  loadLabels() {
    const userId = this.authService.getCurrentUserId();
    this.labelService.getByUserId(userId).subscribe({
      next: (labels) => {
        this.labels = labels || [];
        this.labelsLoaded = true;
        this.cdr.detectChanges();   // reemplaza el setTimeout — dispara CD de forma segura
      },
      error: (err) => {
        console.error('Error loading labels:', err);
        this.labels = [];
        this.labelsLoaded = true;
        this.cdr.detectChanges();
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

  onClose() {
    this.close.emit();
  }
}