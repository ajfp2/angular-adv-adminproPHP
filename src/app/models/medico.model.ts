
import { Hospital } from './hospital.model';

interface MedicoUser {
    _id: string;
    nombre: string;
    img: string;
}

export class Medico {
    constructor(
        public nombre: string,
        public img?: string,
        public usuario?: MedicoUser,
        public id?: string,
        public hospital?: Hospital) {
    }
}
