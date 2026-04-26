import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NotesBoardComponent } from './shared/components/notes-board/notes-board.component';
import { FabComponent } from './shared/components/fab/fab.component';
import { NoteModalComponent } from './shared/components/note-modal/note-modal.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    SidebarComponent,
    NotesBoardComponent,
    FabComponent,
    NoteModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Google Keep - Team Babilonicos';
  showNoteModal = false;

  @ViewChild(NotesBoardComponent) notesBoard!: NotesBoardComponent;

  onFabClick() {
    this.showNoteModal = true;
  }

  onNoteModalClose() {
    console.log('🔒 App: Cerrando modal (close event)');
    this.showNoteModal = false;
  }

  onNoteCreated() {
    console.log('🎉 App: Nota creada/editada - Recargando...');

    // ✅ Recargar notas primero
    setTimeout(() => {
      if (this.notesBoard) {
        console.log('📋 App: Recargando notas...');
        this.notesBoard.loadNotes();
      } else {
        console.error('❌ App: notesBoard no está disponible');
      }
    }, 50);
  }

  onViewChange(view: string) {
    console.log('View changed to:', view);
    if (this.notesBoard) {
      this.notesBoard.setCurrentView(view);
    }
  }
}
