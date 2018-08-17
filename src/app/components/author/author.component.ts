import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html'
})
export class AuthorComponent {

  authors: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.authors = db.collection('AUTHORS').valueChanges();
  }

}
