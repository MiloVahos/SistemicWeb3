import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Author } from '../interfaces/author.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  private authorsList: Author[] = [];  // Lista de libros que se generar a partir del observable de firebase
  private authors: Observable<any[]>; // En este observable se obtiene la colección de libros de firebase

  constructor(db: AngularFirestore) {

    this.authors = db.collection('AUTHORS').valueChanges(); // Se obtiene la colección de libros

    this.authors.subscribe(authors => {
      authors.forEach(author =>  {
        this.authorsList.push(author);
      });
    });
  }

  getAuthors() {
    return this.authorsList;
  }

}
