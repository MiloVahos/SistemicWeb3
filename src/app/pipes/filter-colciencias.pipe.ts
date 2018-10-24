import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchByColciencias'
})
export class SearchByColcienciasPipe implements PipeTransform {

  transform(documents: any[], searchText: string) {

    if ( documents != null ) {
        if (searchText == null) {
            return documents;
        } else {
            return documents.filter( document => document.colCat
                                            .toLocaleLowerCase()
                                            .indexOf(searchText.toLocaleLowerCase()) !== -1  );
        }
    }
  }

}

