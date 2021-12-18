interface HospitalUser {
    _id: string;
    nombre: string;
    img: string;
}

export class Hospital {
    constructor(
        public nombre: string,
        public img?: string,
        public usuario?: HospitalUser,
        public id?: string) {
    }
}

export interface HospitalInterface {
    hospitales: Hospital[];
    pager: any;
    paginas: number;
    total: number;
}
