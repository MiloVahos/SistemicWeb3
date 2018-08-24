import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchByYear'
})
export class SearchByYearPipe implements PipeTransform {

  transform(documents: any[], searchText: string) {

    if (searchText == null) {
        return documents;
    } else {
        return documents.filter( document => document.year.indexOf(searchText) !== -1 );
    }
  }

}

