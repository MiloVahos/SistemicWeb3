import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Thesis } from '../interfaces/thesis.interface';

@Injectable({
  providedIn: 'root'
})
export class ThesisService {

  private thesisList: Thesis[] = [];
  private thesis: Observable<any[]>;

  constructor(db: AngularFirestore) {

    this.thesis = db.collection('THESIS').valueChanges();

    this.thesis.subscribe(thesis => {
      thesis.forEach(tesis =>  {
        let flag = 0;
        for ( let i = 0; i < this.thesisList.length; i++ ) {
          if ( this.thesisList[i].id === tesis.id ) {
            flag++;
          }
        }
        if ( flag === 0 ) {
          this.thesisList.push(tesis);
        }
      });
    });
  }

  getThesis() {
    return this.thesisList;
  }
}
