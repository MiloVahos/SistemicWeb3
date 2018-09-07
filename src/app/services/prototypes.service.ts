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
        this.prototypesList.push(prototype);
      });
    });
  }

  getPrototypes() {
    return this.prototypesList;
  }
}
