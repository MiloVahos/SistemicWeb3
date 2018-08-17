import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.css']
})
export class ConferenceComponent {

  conferences: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.conferences = db.collection('CONFERENCES').valueChanges();
  }

}
