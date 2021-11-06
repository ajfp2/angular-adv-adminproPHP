import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

    public imagenSubir: File;
    public imgTemp: any = null;

    constructor(public modalImg: ModalImagenService, public fileUpload: FileUploadService) { }

    ngOnInit(): void {
    }

    cerrarModal(): void {
        this.imgTemp = null;
        this.modalImg.cerrarModal();
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

        const id = this.modalImg.id;
        const tipo = this.modalImg.tipo;

        this.fileUpload.actualizarFoto(this.imagenSubir, tipo, id).then( img => {
            Swal.fire('Guardado', 'Imagen usuario actualizada.', 'success');
            this.modalImg.nuevaImg.emit(img);
            this.cerrarModal();
        }).catch( err => {
            console.error( err );
            Swal.fire('ERROR', 'No se ha actualizado la imagen', 'error');
        });
    }

}
