import { environment } from 'src/environments/environment';

const base_url = environment.base_url;


export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public id?: string) {
    }

    // imprimirUsuario(): void {
    //     console.log( this.nombre );
    // }

    get imagenUrl(): string {
        if (this.img ){
            return `${ base_url }/uploads/usuarios/${ this.img }`;
        } else {
            return `${ base_url }/uploads/usuarios/no-image`;
        }
    }
}


