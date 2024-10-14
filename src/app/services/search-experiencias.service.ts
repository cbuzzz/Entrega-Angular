import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Experiencia } from '../models/experiencia.model'; // Importar el modelo de experiencia
import { User } from '../models/user.model'; // Importar el modelo de usuario

@Injectable({
  providedIn: 'root' // El servicio estará disponible en toda la aplicación
})
export class SearchExperienciasService {

  private apiUrl = 'http://localhost:3000/api'; // Base URL del backend

  constructor(private http: HttpClient) {}

  // Método para buscar un usuario por nombre
  searchUserByName(name: string): Observable<User | null> {
    const url = `${this.apiUrl}/user/search/${name}`; // Asegúrate de que esta es la URL correcta
    return this.http.get<User>(url).pipe(
      catchError(error => {
        console.error('Error al buscar usuario:', error);
        return of(null);
      })
    );
  }
  

  // Método para obtener las experiencias de un propietario por su ID
  getExperienciasByOwner(ownerId: string): Observable<Experiencia[]> {
    const url = `${this.apiUrl}/experiencias?owner=${ownerId}`;
    return this.http.get<Experiencia[]>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener experiencias del usuario:', error);
          return of([]); // Retornar un array vacío en caso de error
        })
      );
  }
}
