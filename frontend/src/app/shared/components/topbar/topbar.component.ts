import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AvatarModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  private _searchQuery: string = '';

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    this._searchQuery = value || '';
  }

  get showSearchIcon(): boolean {
    return !this._searchQuery || this._searchQuery.length === 0;
  }

  toggleSidebar() {
    // TODO: Implement sidebar toggle
    console.log('Toggle sidebar');
  }

  onSearch() {
    // TODO: Implement search
    console.log('Searching:', this.searchQuery);
  }

  openSettings() {
    // TODO: Implement settings
    console.log('Open settings');
  }
}
