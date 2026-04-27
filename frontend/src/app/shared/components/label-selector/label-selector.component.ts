import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Label } from '../../models';
import { LabelService } from '../../../core/services';

@Component({
  selector: 'app-label-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.scss']
})
export class LabelSelectorComponent implements OnInit, OnDestroy {
  @Input() selectedLabels: Label[] = [];
  @Input() userId: number = 1; // Default user ID, should be passed from parent
  @Output() labelsChange = new EventEmitter<Label[]>();
  @Output() labelCreated = new EventEmitter<Label>();

  allLabels: Label[] = [];
  filteredLabels: Label[] = [];
  searchTerm = '';
  isDropdownOpen = false;
  isCreatingLabel = false;
  showCreateOption = false;

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(private labelService: LabelService) {
    // Setup search debouncing
    this.searchSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filterLabels(term);
    });
  }

  ngOnInit(): void {
    this.loadLabels();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLabels(): void {
    this.labelService.getByUserId(this.userId).subscribe({
      next: (labels: Label[]) => {
        this.allLabels = labels;
        this.filterLabels(this.searchTerm);
      },
      error: (error: any) => {
        console.error('Error loading labels:', error);
      }
    });
  }

  filterLabels(term: string): void {
    this.searchTerm = term;

    if (!term.trim()) {
      this.filteredLabels = this.allLabels;
      this.showCreateOption = false;
    } else {
      // Filter labels that match the search term
      this.filteredLabels = this.allLabels.filter(label =>
        label.name.toLowerCase().includes(term.toLowerCase())
      );

      // Show "Create" option if no exact match
      const exactMatch = this.allLabels.some(label =>
        label.name.toLowerCase() === term.toLowerCase()
      );
      this.showCreateOption = !exactMatch && term.trim().length > 0;
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject$.next(input.value);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filterLabels(this.searchTerm);
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // Cerrar dropdown al hacer clic fuera del componente
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.isDropdownOpen) {
      const target = event.target as HTMLElement;
      const selectorElement = document.querySelector('.label-selector');
      if (selectorElement && !selectorElement.contains(target)) {
        this.closeDropdown();
      }
    }
  }

  isLabelSelected(label: Label): boolean {
    return this.selectedLabels.some(selected => selected.id === label.id);
  }

  toggleLabel(label: Label): void {
    const isSelected = this.isLabelSelected(label);
    let updatedLabels: Label[];

    if (isSelected) {
      // Remove label
      updatedLabels = this.selectedLabels.filter(selected => selected.id !== label.id);
    } else {
      // Add label
      updatedLabels = [...this.selectedLabels, label];
    }

    this.labelsChange.emit(updatedLabels);
  }

  removeLabel(label: Label): void {
    event?.stopPropagation();
    const updatedLabels = this.selectedLabels.filter(selected => selected.id !== label.id);
    this.labelsChange.emit(updatedLabels);
  }

  async createNewLabel(): Promise<void> {
    if (!this.searchTerm.trim() || this.isCreatingLabel) {
      return;
    }

    this.isCreatingLabel = true;

    try {
      const newLabel = await this.labelService.create({
        name: this.searchTerm.trim(),
        user_id: this.userId
      }).toPromise();

      if (newLabel) {
        // Add to all labels
        this.allLabels = [...this.allLabels, newLabel];

        // Add to selected labels
        const updatedLabels = [...this.selectedLabels, newLabel];
        this.labelsChange.emit(updatedLabels);

        // Emit label created event
        this.labelCreated.emit(newLabel);

        // Clear search
        this.searchTerm = '';
        this.filterLabels('');
      }
    } catch (error) {
      console.error('Error creating label:', error);
    } finally {
      this.isCreatingLabel = false;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.showCreateOption) {
      this.createNewLabel();
    }
  }
}
