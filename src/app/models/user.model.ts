import { Experiencia } from './experiencia.model';  // Asegúrate de importar el modelo Experiencia

export interface User { 
  _id?: string;      // MongoDB genera automáticamente este campo al insertar
  name: string;
  mail: string;
  password: string;
  comment: string;    // Este campo es la "Biografía"
  experiencies?: Experiencia[];  // Añadir el campo experiences, opcional, que es un array de experiencias
}


  