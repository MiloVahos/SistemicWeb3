import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchByJournal'
})
export class SearchByJournalPipe implements PipeTransform {

  transform(documents: any[], searchText: string) {

    if ( documents != null ) {
        if (searchText == null) {
            return documents;
        } else {
            return documents.filter( document => document.journal
                                            .toLocaleLowerCase()
                                            .indexOf(searchText.toLocaleLowerCase()) !== -1  );
        }
    }
  }

}

