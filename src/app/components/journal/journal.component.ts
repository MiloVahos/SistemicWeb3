import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent {

  journals: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.journals = db.collection('JOURNALS').valueChanges();
  }

}
