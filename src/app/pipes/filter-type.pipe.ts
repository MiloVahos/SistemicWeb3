import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchByType'
})
export class SearchByTypePipe implements PipeTransform {

  transform(documents: any[], searchText: string) {

    if ( documents != null ) {
        if (searchText == null) {
            return documents;
        } else {
            return documents.filter( document => document.type
                                            .toLocaleLowerCase()
                                            .indexOf(searchText.toLocaleLowerCase()) !== -1  );
        }
    }
  }

}