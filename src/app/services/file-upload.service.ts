import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor() { }

    // tslint:disable-next-line:typedef
    async actualizarFoto(archivo: File, tipo: 'usuarios'|'medicos'|'hospitales', id: string ){
        try {
            const url = `${ base_url }/uploads/cambiaFoto/${ tipo }/${ id }`;
            const formData = new FormData();
            formData.append('imagen', archivo);
            // headers: new HttpHeaders().set('Authorization', localStorage.getItem('token') || ''),
            const resp = await fetch( url, {
                method: 'POST',
                headers: {
                    // tslint:disable-next-line:object-literal-key-quotes
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: formData
            });
            const data = await resp.json();
            if (data.ok){
                return data.imagen;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
