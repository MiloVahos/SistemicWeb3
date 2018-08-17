import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {

  books: Observable<any[]>;
  
  constructor(db: AngularFirestore) {
    this.books = db.collection('BOOKS').valueChanges();
  }

}
