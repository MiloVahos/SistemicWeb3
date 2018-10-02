import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Prototype } from '../interfaces/prototypes.interface';

@Injectable({
  providedIn: 'root'
})
export class PrototypesService {

  private prototypesList: Prototype[] = [];
  private prototypes: Observable<any[]>;

  constructor(db: AngularFirestore) {

    this.prototypes = db.collection('PROTOTYPES').valueChanges();

    this.prototypes.subscribe(prototypes => {
      prototypes.forEach(prototype =>  {
        let flag = 0;
        for ( let i = 0; i < this.prototypesList.length; i++ ) {
          if ( this.prototypesList[i].id === prototype.id ) {
            flag++;
          }
        }
        if ( flag === 0 ) {
          this.prototypesList.push(prototype);
        }
      });
    });
  }

  getPrototypes() {
    return this.prototypesList;
  }
}
