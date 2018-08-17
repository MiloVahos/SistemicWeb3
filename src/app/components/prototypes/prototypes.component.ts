import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-prototypes',
  templateUrl: './prototypes.component.html',
  styleUrls: ['./prototypes.component.css']
})
export class PrototypesComponent {

  prototypes: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.prototypes = db.collection('PROTOTYPES').valueChanges();
  }

}
