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
        this.thesisList.push(tesis);
      });
    });
  }

  getThesis() {
    return this.thesisList;
  }
}
