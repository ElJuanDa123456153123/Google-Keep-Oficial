import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/services';

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
  userInitials = 'JD'; // Default

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userInitials = this.getInitials(user.name);
    }
  }

  private getInitials(name: string): string {
    if (!name) return 'JD';
    return name
      .split(' ')
      .map((word: string) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

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
    this.sidebarToggle.emit();
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
