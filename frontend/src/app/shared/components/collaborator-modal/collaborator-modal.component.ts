import {
  Component, Input, Output, EventEmitter,
  OnInit, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { trigger, style, transition, animate } from '@angular/animations';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { UserService } from '../../../core/services/user.service';
import { Collaborator } from '../../models/collaborator.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-collaborator-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AvatarModule],
  templateUrl: './collaborator-modal.component.html',
  styleUrls: ['./collaborator-modal.component.scss'],
  animations: [
    trigger('overlayAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(-8px)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('140ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(-8px)' }))
      ])
    ])
  ]
})
export class CollaboratorModalComponent implements OnInit {
  /** ID de la nota a la que se añaden colaboradores */
  @Input() noteId!: number;
  /** Lista inicial de colaboradores (si ya existen) */
  @Input() initialCollaborators: Collaborator[] = [];

  @Output() closed = new EventEmitter<Collaborator[]>();

  emailInput = '';
  emailError = '';
  isAdding   = false;

  collaborators: Collaborator[] = [];

  constructor(
    private collaboratorService: CollaboratorService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Clonar para no mutar el input original
    this.collaborators = [...(this.initialCollaborators || [])];
  }

  // ── Validación ─────────────────────────────────────────────────
  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  onEmailInput() {
    // Limpiar error mientras el usuario escribe
    if (this.emailError) this.emailError = '';
  }

  onAddCollaborator() {
    const email = this.emailInput.trim();

    if (!email) {
      this.emailError = 'Ingresa un correo electrónico.';
      return;
    }

    if (!this.isValidEmail(email)) {
      this.emailError = 'Formato de correo inválido.';
      return;
    }

    // Verificar si ya está añadido
    const alreadyAdded = this.collaborators.some(
      c => c.user?.email?.toLowerCase() === email.toLowerCase()
    );
    if (alreadyAdded) {
      this.emailError = 'Este colaborador ya fue añadido.';
      return;
    }

    this.isAdding = true;
    this.emailError = '';

    // Buscar usuario por email y luego añadirlo
    this.userService.getByEmail(email).subscribe({
      next: (user: User | null) => {
        // El backend retorna null (200 OK) si no encuentra el usuario
        if (!user || !user.id) {
          this.emailError = 'No se encontró un usuario con ese correo.';
          this.isAdding = false;
          this.cdr.detectChanges();
          return;
        }

        this.collaboratorService.add({
          note_id: this.noteId,
          user_id: user.id,
          permission: 'edit'
        }).subscribe({
          next: (collab: Collaborator) => {
            const collabWithUser: Collaborator = { ...collab, user };
            this.collaborators = [...this.collaborators, collabWithUser];
            this.emailInput = '';
            this.isAdding   = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error añadiendo colaborador:', err);
            this.emailError = 'No se pudo añadir el colaborador. Intenta de nuevo.';
            this.isAdding = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error buscando usuario:', err);
        this.emailError = 'No se encontró un usuario con ese correo.';
        this.isAdding = false;
        this.cdr.detectChanges();
      }
    });
  }

  onRemoveCollaborator(collab: Collaborator) {
    this.collaboratorService.delete(collab.id).subscribe({
      next: () => {
        this.collaborators = this.collaborators.filter(c => c.id !== collab.id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error eliminando colaborador:', err);
      }
    });
  }

  onDone() {
    this.closed.emit(this.collaborators);
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onDone();
    }
  }

  // ── Helpers de UI ──────────────────────────────────────────────
  getInitials(user?: User): string {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getAvatarColor(user?: User): string {
    if (!user?.name) return '#8B5CF6';
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    let hash = 0;
    for (const ch of user.name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
}