import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-thesis',
  templateUrl: './thesis.component.html',
  styleUrls: ['./thesis.component.css']
})
export class ThesisComponent {

  thesis: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.thesis = db.collection('THESIS').valueChanges();
  }


}
