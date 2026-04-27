import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SearchService } from '../../../core/services';
import { AuthService } from '../../../core/services/auth.service';

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
  public showProfileMenu: boolean = false;
  public userProfile: any = null;

  constructor(
    private searchService: SearchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userProfile = this.authService.getUserProfile();
  }

  // Cierra el menu si se da click afuera
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.showProfileMenu = false;
    }
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    this._searchQuery = value || '';
    this.searchService.setSearchQuery(this._searchQuery);
  }

  get showSearchIcon(): boolean {
    return !this._searchQuery || this._searchQuery.length === 0;
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  onSearch() {
    console.log('Searching:', this.searchQuery);
  }

  openSettings() {
    console.log('Open settings');
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.authService.logout();
  }

  get userInitials(): string {
    if (!this.userProfile) return 'KD';
    const name = this.userProfile.name || this.userProfile.email || 'Keep Dev';
    return name.substring(0, 2).toUpperCase();
  }
}
