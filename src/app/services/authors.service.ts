import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Author } from '../interfaces/author.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  private AuthorsCol: AngularFirestoreCollection<Author>;  // COLECCIÓN DE AUTORES DE LA BASE DE DATOS
  private AuthorsObs: Observable<Author[]>; // OBSERVABLE DONDE SE VAN A ALMACENAR LOS AUTORES
  private AuthorsList: Author[]  = []; // CONTENDRÁ LOS AUTORES SI NO SE DESEAN COMO OBSERVABLE

  constructor( db: AngularFirestore ) {
    this.AuthorsCol = db.collection<Author>('AUTHORS');
    this.AuthorsObs = this.AuthorsCol.valueChanges();
  }

  // READ
  getAuthors() {
    this.AuthorsObs.subscribe( authors => {
      authors.forEach( author =>  {
        this.AuthorsList.push(author);
      });
    });
    return this.AuthorsList;
  }

}


