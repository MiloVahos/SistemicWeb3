import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'autores'
})
export class AutoresPipe implements PipeTransform {

    transform(value: string ): string {

        value = value.toLowerCase();

        let autores = value.split(',');
        let autor: string;
        let autoresArray: Array<string> = [];

        for ( let i = 0; i < autores.length; i++ ) {
            let nombre = autores[i].split(' ');
            for ( let j = 0; j < nombre.length; j++ ) {
                nombre[j] = nombre[j][0].toUpperCase() + nombre[j].substr(1);
            }
            autor = nombre.join(' ');
            autoresArray.push(autor);
        }
        return autoresArray.join(" , ");
    }

}

