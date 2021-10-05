import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

    public loginForm = this.fb.group({

        email: [localStorage.getItem('email') || '', [Validators.required, Validators.email ] ],
        password: ['', Validators.required ],
        remember: [false]
    });

    constructor( private router: Router, private fb: FormBuilder, private us: UsuarioService) { }

    ngOnInit(): void {
    }

    // tslint:disable-next-line:typedef
    login() {
        // this.router.navigateByUrl('/');
        this.us.loginUsuario( this.loginForm.value ).subscribe(resp => {
            console.log(resp);
            if (this.loginForm.get('remember').value){
                localStorage.setItem('email', this.loginForm.get('email').value);
            } else {
                localStorage.removeItem('email');
            }
            // IR al dashboard
            this.router.navigateByUrl('/');
        }, (err) => {
            // Si suceden un error
            console.warn(err.error);
            const e = err.error;
            Swal.fire('ERROR-' + e.error, e.messages.error, 'error');
        });
    }

}
