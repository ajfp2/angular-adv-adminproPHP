import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {

        this.getUsuarios().then( usuarios => {
            console.log( usuarios );
        });

        // const promesa = new Promise( (resolve, reject) => {
        //     if (false) { resolve('hola mundo'); }
        //     else {
        //         reject('Algo esta mal');
        //     }
        // });

        // promesa.then( (mensaje) => {
        //     console.log('Fin promesa:', mensaje);
        // })
        // .catch( e => console.error('Error:', e) );
        // console.log('Fin NgInit');
    }

    getUsuarios(): any {
        return new Promise( resolve => {
            fetch('https://reqres.in/api/users')
            .then( resp => resp.json())
            .then( body => console.log(body.data));
        });
    }

}
