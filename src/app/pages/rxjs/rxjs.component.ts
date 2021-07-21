import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

    public intervaSubs: Subscription;

    constructor() {
        console.log('Constructor RXJS');

        // this.retornarObservable().pipe(
        //     retry(2)
        // ).subscribe(
        //     valor => console.log('Subs: ', valor),
        //     error => console.warn('Error' , error),
        //     () => console.log('Observable terminado')
        // );
        this.intervaSubs = this.retornaIntervalo().subscribe( console.log );
    }

    ngOnDestroy(): void {
        this.intervaSubs.unsubscribe();
    }

    retornaIntervalo(): Observable<number> {
        return interval(250)
        .pipe(
            map( valor =>  valor + 1 ),
            filter( valor => ( valor % 2 === 0 ) ? true : false )
        );
    }

    retornarObservable(): Observable<number>{
        let i = -1;
        return new Observable<number>( observer => {
            const intervalo = setInterval( () => {
                i++;
                observer.next(i);
                if (i === 4) {
                    clearInterval( intervalo );
                    observer.complete();
                }
                if( i === 2) {
                    observer.error(' i llego a 2');
                }
            }, 1000);
        } );
    }


}
