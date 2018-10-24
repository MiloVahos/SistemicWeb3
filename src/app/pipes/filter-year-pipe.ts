import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchByYear'
})
export class SearchByYearPipe implements PipeTransform {

  transform(documents: any[], searchText: string) {

    if ( documents != null ) {
        if (searchText == null) {
            return documents;
        } else {
            return documents.filter( document => {
                if ( searchText.indexOf('-')  !== -1 ) {    // Si el search contiene -
                    const years = searchText.split('-');
                    const year1 = parseInt( years[0] );
                    const year2 = parseInt( years[1] );
                    const docYear = parseInt( document.year );
                    if ( (docYear >= year1) && (docYear <= year2) ) { return document; }
                } else {
                    return document.year.indexOf(searchText) !== -1;
                }
            });
        }
    }
  }

}

