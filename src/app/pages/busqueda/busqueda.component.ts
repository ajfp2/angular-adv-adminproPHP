import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from '../../services/busquedas.service';
import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

    public usuarios: Usuario[] = [];
    public medicos: Medico[] = [];
    public hospitales: Hospital[] = [];

    constructor( private activatedRoute: ActivatedRoute, private bs: BusquedasService) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe( ({ termino }) => {
            console.log( termino );
            this.busquedaGlobal( termino );
        });
    }

    // tslint:disable-next-line:typedef
    busquedaGlobal( txtBuscar: string) {
        this.bs.busquedasGlobales(txtBuscar).subscribe( (resp: any) => {
            console.log( resp );
            this.usuarios = resp.usuarios;
            this.medicos = resp.medicos;
            this.hospitales = resp.hospitales;
        });
    }
}
