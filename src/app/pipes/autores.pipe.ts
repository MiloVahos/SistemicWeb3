import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'autores'
})
export class AutoresPipe implements PipeTransform {

    transform(value: string ): string {

        value = value.toLowerCase();

        let autores = value.split(',');
        let autoresArray = new Array<string>;
        let autor: string;

        for( let i in autores ) {
            let nombre = autores[i].split(" ");
            for( let j in nombre){
                nombre[j] = nombre[j][0].toUpperCase() + nombre[j].substr(1);
            }
            autor = nombre.join(" ");
            autoresArray.push(autor);
        }

        return autoresArray.join(" , ");
    }

}