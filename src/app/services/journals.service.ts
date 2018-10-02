import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Journal } from '../interfaces/journal.interface';

@Injectable({
  providedIn: 'root'
})
export class JournalsService {

  private journalsList: Journal[] = [];
  private journals: Observable<any[]>;

  constructor(db: AngularFirestore) {

    this.journals = db.collection('JOURNALS').valueChanges();

    this.journals.subscribe(journals => {
      journals.forEach(journal =>  {
        let flag = 0;
        for ( let i = 0; i < this.journalsList.length; i++ ) {
          if ( this.journalsList[i].id === journal.id ) {
            flag++;
          }
        }
        if ( flag === 0 ) {
          this.journalsList.push(journal);
        }
      });
    });
  }

  getJournals() {
    return this.journalsList;
  }
}
