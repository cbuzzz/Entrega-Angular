import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Experiencia } from '../models/experiencia.model';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  private apiUrl = 'http://localhost:3000/api/experiencias'; // URL de la API para experiencias

  constructor(private http: HttpClient) {}

  // Obtener la lista de experiencias
  getExperiencias(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(this.apiUrl);
  }  

  // Obtener experiencias asociadas a un usuario específico por su ID como owner o participant
  getExperienciasByUser(userId: string): Observable<Experiencia[]> {
    // Consulta para obtener experiencias como owner o participant
    return this.http.get<Experiencia[]>(`${this.apiUrl}?participant=${userId}&owner=${userId}`);
  }


  // Agregar una nueva experiencia al backend
  addExperiencia(newExperience: Experiencia): Observable<Experiencia> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Experiencia>(this.apiUrl, newExperience, { headers });
  }

  // Eliminar una experiencia por su ID
  deleteExperiencia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
