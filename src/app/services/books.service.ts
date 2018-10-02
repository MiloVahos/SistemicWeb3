import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book.interface';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private booksList: Book[] = [];  // Lista de libros que se generar a partir del observable de firebase
  private books: Observable<any[]>; // En este observable se obtiene la colección de libros de firebase

  constructor(db: AngularFirestore) {

    this.books = db.collection('BOOKS').valueChanges(); // Se obtiene la colección de libros

    this.books.subscribe(books => {
      books.forEach(book =>  {
        let flag = 0;
        for ( let i = 0; i < this.booksList.length; i++ ) {
          if ( this.booksList[i].id === book.id ) {
            flag++;
          }
        }
        if ( flag === 0 ) {
          this.booksList.push(book);
        }
      });
    });

  }

  getBooks() {
    return this.booksList;
  }

}
