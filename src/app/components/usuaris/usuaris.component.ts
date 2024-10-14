import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  // Import FormsModule y NgForm para manejar el formulario
import { User } from '../../models/user.model'; // Importar el modelo User desde la subcarpeta services
import { UserService } from '../../services/user.service'; // Importar el servicio UserService desde la subcarpeta services
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { MaskEmailPipe } from '../../pipes/maskEmail.pipe';
import { ExperienciaService } from '../../services/experiencia.service'; // Importar el servicio ExperienciaService
import { Experiencia } from '../../models/experiencia.model';  // Modelo de experiencia

@Component({
  selector: 'app-usuaris',
  templateUrl: './usuaris.component.html',
  styleUrls: ['./usuaris.component.css'],
  standalone: true,  // Esto convierte el componente en independiente
  imports: [CommonModule, FormsModule, TruncatePipe, MaskEmailPipe]  // Importar CommonModule y FormsModule
})
export class UsuarisComponent implements OnInit {
  usuarios: User[] = []; // Lista de usuarios con tipado User
  experienciasPorUsuario: { [key: string]: Experiencia[] } = {};  // Almacena las experiencias de cada usuario por su _id
  desplegado: boolean[] = []; // Controla si el desplegable de cada usuario está abierto o cerrado
  desplegarBiografia: boolean[] = [];
  mostrarPassword: boolean[] = []; // Array para controlar la visibilidad de la contraseña

  nuevoUsuario: User = {
    name: '',
    mail: '', // Añadir el campo email
    password: '',
    comment: ''
  };

  confirmarPassword: string = ''; // Campo para confirmar la contraseña
  usuarioEdicion: User | null = null; // Usuario en proceso de edición
  indiceEdicion: number | null = null; // Almacena el índice del usuario en edición
  formSubmitted: boolean = false; // Indica si se ha enviado el formulario

  constructor(private userService: UserService, private experienciaService: ExperienciaService) {}

  ngOnInit(): void {
    // Cargar usuarios desde el UserService
    this.userService.getUsers()
      .subscribe(data => {
        this.usuarios = data;
        this.desplegado = new Array(data.length).fill(false);
      });
  }

  // Función para agregar o modificar un usuario
  agregarElemento(userForm: NgForm): void {
    this.formSubmitted = true;
  
    // Verificar si las contraseñas coinciden
    if (this.nuevoUsuario.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
      return;
    }
  
    if (this.indiceEdicion !== null) {
      // Estamos en modo edición, modificar el usuario existente
      this.usuarios[this.indiceEdicion] = { ...this.nuevoUsuario, _id: this.usuarios[this.indiceEdicion]._id };
  
      // Actualizar el usuario en la API
      this.userService.updateUser(this.usuarios[this.indiceEdicion]).subscribe(response => {
        console.log('Usuario actualizado:', response);
      });
  
      // Limpiar el estado de edición
      this.indiceEdicion = null;
    } else {
      // Modo agregar nuevo usuario
      const usuarioJSON: User = {
        name: this.nuevoUsuario.name,
        mail: this.nuevoUsuario.mail,
        password: this.nuevoUsuario.password,
        comment: this.nuevoUsuario.comment
      };
  
      // Enviar el usuario a la API a través del UserService
      this.userService.addUser(usuarioJSON).subscribe(response => {
        console.log('Usuario agregado:', response);
        
        // Agregar el usuario con el _id generado por la API al array de usuarios en el frontend
        this.usuarios.push({ ...usuarioJSON, _id: response._id });
        this.desplegado.push(false); // Añadir un nuevo estado de desplegado
      });
    }
  
    // Limpiar los campos del formulario y restablecer su estado
    this.resetForm(userForm);
  }

  // Función para limpiar el formulario
  resetForm(userForm: NgForm): void {
    this.nuevoUsuario = {
      name: '',
      mail: '', 
      password: '',
      comment: ''
    };
    this.confirmarPassword = '';
    this.formSubmitted = false; 
    userForm.resetForm(); 
  }

  // Función para preparar la edición de un usuario
  prepararEdicion(usuario: User, index: number): void {
    this.usuarioEdicion = { ...usuario };
    this.nuevoUsuario = { ...usuario };
    this.indiceEdicion = index; 
    this.desplegado[index] = true; 
  }

  // Función para eliminar un usuario usando el _id
  eliminarElemento(index: number): void {
    const usuarioAEliminar = this.usuarios[index];
  
    if (!usuarioAEliminar._id) {
      console.error('El usuario no tiene un _id válido. No se puede eliminar.');
      alert('El usuario no se puede eliminar porque no está registrado en la base de datos.');
      return;
    }
  
    if (confirm(`¿Estás seguro de que deseas eliminar a ${usuarioAEliminar.name}?`)) {
      this.userService.deleteUserById(usuarioAEliminar._id).subscribe(
        response => {
          console.log('Usuario eliminado:', response);
          this.usuarios.splice(index, 1);
          this.desplegado.splice(index, 1);
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
          alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
        }
      );
    }
  }

  // Función para alternar la visualización del desplegable
  toggleDesplegable(index: number): void {
    this.desplegado[index] = !this.desplegado[index];
  }

  // Obtener las experiencias de un usuario y desplegar la lista
  toggleExperiencias(userId: string, index: number): void {
    if (!this.desplegado[index]) {
      this.experienciaService.getExperienciasByUser(userId).subscribe((experiencias: Experiencia[]) => {
        this.usuarios[index] = { ...this.usuarios[index], experiences: experiencias };  // Asigna las experiencias al usuario
        this.desplegado[index] = true;
      });
    } else {
      this.desplegado[index] = false;
    }
  }
  

  // Método para alternar entre mostrar más o menos texto
  toggleBiografia(index: number) {
    this.desplegarBiografia[index] = !this.desplegarBiografia[index];
  }

  // Función para alternar la visibilidad de la contraseña
  togglePassword(index: number): void {
    this.mostrarPassword[index] = !this.mostrarPassword[index];
  }
}
