import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchByAuthor'
})
export class SearchByAuthorPipe implements PipeTransform {

  transform(documents: any[], searchText: string) {

    if (searchText == null) {
        return documents;
    } else {
        return documents.filter( document => document.author
                                        .toLocaleLowerCase()
                                        .indexOf(searchText.toLocaleLowerCase()) !== -1 );
    }
  }

}

