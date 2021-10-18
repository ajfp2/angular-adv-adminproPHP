import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

    public perfilForm: FormGroup;
    public usuario: Usuario;
    public imagenSubir: File;
    public imgTemp: any = null;

    constructor( private fb: FormBuilder, private us: UsuarioService, private fileUpload: FileUploadService) {
        this.usuario = us.usuario;
    }

    ngOnInit(): void {
        this.perfilForm = this.fb.group({
            nombre: [this.usuario.nombre, Validators.required],
            email: [this.usuario.email, Validators.required],
        });
    }

    actualizarImagen(file: File): void {
        this.imagenSubir = file;
        if (!file){
            return this.imgTemp = null;
        }
        const reader = new FileReader();
        reader.readAsDataURL( file );
        reader.onloadend = () => {
            this.imgTemp = reader.result;
        };
    }

    subirImagen(): void {
        this.fileUpload.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.id).then( img => {
            this.usuario.img = img;
            Swal.fire('Guardado', 'Imagen usuario actualizada.', 'success');
        }).catch( err => {
            console.error( err );
            Swal.fire('ERROR', 'No se ha actualizado la imagen', 'error');
        });
    }


    actualizarPerfil(): void {
        this.us.actualizarPerfil( this.perfilForm.value ).subscribe( resp => {
            console.log( this.perfilForm.value );
            const { nombre, email } = this.perfilForm.value;
            this.usuario.nombre = nombre;
            this.usuario.email = email;
            Swal.fire('Guardado', 'Cambios guardados', 'success');
        },
        (err) => {
            console.warn(err);
            Swal.fire('ERROR', 'No se han podido actualizar los datos.', 'error');
        } );
    }
}
