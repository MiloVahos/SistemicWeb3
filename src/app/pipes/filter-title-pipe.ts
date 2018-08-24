import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchByTitle'
})
export class SearchByTitlePipe implements PipeTransform {

  transform(documents: any[], searchText: string) {

    if (searchText == null) {
        return documents;
    } else {
        return documents.filter( document => document.title.indexOf(searchText) !== -1 );
    }
  }

}
