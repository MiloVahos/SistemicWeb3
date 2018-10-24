import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchByConference'
})
export class SearchByConferencePipe implements PipeTransform {

  transform(documents: any[], searchText: string) {

    if ( documents != null ) {
        if (searchText == null) {
            return documents;
        } else {
            return documents.filter( document => document.conference
                                            .toLocaleLowerCase()
                                            .indexOf(searchText.toLocaleLowerCase()) !== -1  );
        }
    }
  }

}

