import { Component, OnInit } from '@angular/core';
import { SearchExperienciasService } from '../../services/search-experiencias.service';
import { Experiencia } from '../../models/experiencia.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-experiencias',
  templateUrl: './search-experiencias.component.html',
  styleUrls: ['./search-experiencias.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule]
})
export class SearchExperienciasComponent implements OnInit {
  searchTerm: string = '';
  experiencias: Experiencia[] = [];
  users: User[] = [];
  errorMessage: string = '';

  constructor(
    private searchExperienciasService: SearchExperienciasService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  searchUserExperiencias(): void {
    const user = this.users.find((u) => u.name.toLowerCase() === this.searchTerm.toLowerCase());
    if (user) {
      console.log('Usuario encontrado:', user);
      this.searchExperienciasService.getExperienciasByOwner(user._id!).subscribe((data: Experiencia[]) => {
        console.log('Experiencias encontradas:', data);
        this.experiencias = data;
      });
    } else {
      this.errorMessage = 'Usuario no encontrado';
    }
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        console.log('Usuarios cargados:', this.users);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  getUserNameById(userId: string): string {
    const user = this.users.find((u) => u._id === userId);
    console.log(`Buscando nombre para el ID: ${userId}`, user ? user.name : 'Desconocido');
    return user ? user.name : 'Desconocido';
  }

  getParticipantNames(participantIds: any[]): string {
      // Aquí asumimos que cada 'participantId' podría ser un objeto y no un simple string
      return participantIds
        .map((participant) => {
          const id = typeof participant === 'object' && participant._id ? participant._id : participant;
          return this.getUserNameById(id);
        })
        .join(', ');
  }

}
