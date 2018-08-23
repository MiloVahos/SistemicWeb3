import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {

  list: boolean = false;
  code: boolean = false;
  column: boolean = true;
  complete: boolean = false;

  books: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.books = db.collection('BOOKS').valueChanges();
    /*this.books.subscribe(books => {
      books.forEach(book => {
        console.log(book.author);
      });
    });*/
  }

  listView() {
    this.list = true;
    this.code = false;
    this.column = false;
  }

  columsView() {
    this.list = false;
    this.code = false;
    this.column = true;
  }

  codeView() {
    this.list = false;
    this.code = true;
    this.column = false;
  }

}
