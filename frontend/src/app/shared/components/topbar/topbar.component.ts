import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SearchService } from '../../../core/services';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AvatarModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();

  private _searchQuery: string = '';

  constructor(private searchService: SearchService) {}

  ngOnInit() {}

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    this._searchQuery = value || '';
    // Actualizar la búsqueda en tiempo real
    this.searchService.setSearchQuery(this._searchQuery);
  }

  get showSearchIcon(): boolean {
    return !this._searchQuery || this._searchQuery.length === 0;
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  onSearch() {
    // La búsqueda ya se actualiza en tiempo real mediante el setter
    console.log('Searching:', this.searchQuery);
  }

  openSettings() {
    // TODO: Implement settings
    console.log('Open settings');
  }
}
