import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { Author } from '../../../interfaces/author.interface';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html'
})
export class AddAuthorComponent implements OnInit {

  // VARIABLES DE ENTORNO
  forma: FormGroup;                   // OBJETO MODIFICADOR DEL FORMULARIO
  showSuccess$: Observable<boolean>;  // SI SE COMPLETA UNA TRANSFERENCIA SE ACTIVA ESTA BANDERA
  showError$: Observable<boolean>;    // SI LA TRANSFERENCIA FALLA, SE ACTIVA ESTA BANDERA
  updateMode = false;                 // MODO UPDATE ACTIVADO
  private updatedID: string;          // ID QUE SE VA A MODIFICAR

  // VARIABLES DE LA BASE DE DATOS
  private AuthorsCol: AngularFirestoreCollection<Author>;  // COLECCIÓN DE AUTORES DE LA BASE DE DATOS
  private AuthorsObs: Observable<Author[]>; // OBSERVABLE DONDE SE VAN A ALMACENAR LOS AUTORES
  private AuthorsList: Author[]  = []; // CONTENDRÁ LOS AUTORES SI NO SE DESEAN COMO OBSERVABLE

  constructor(  private router: Router,
                private _authS: AuthService,
                private db: AngularFirestore
              ) {

    // SI EL USUARIO NO ESTÁ LOGGEADO, SE REGRESA AL HOME
    if ( !this._authS.isUserEmailLoggedIn ) {
      this.router.navigate(['/']);
    }

    // DEFINICIÓN DEL OBJETO FORMA
    this.forma = new FormGroup({
      'name':       new FormControl( '', Validators.required ),
      'email':      new FormControl( '', Validators.required ),
      'membership': new FormControl( '', Validators.required ),
      'active':     new FormControl( false, Validators.required ),
    });

    this.AuthorsCol = db.collection<Author>('AUTHORS');
    this.AuthorsObs = this.AuthorsCol.valueChanges();

  }

  ngOnInit() {
    this.AuthorsObs.subscribe( authors => {
      authors.forEach( author =>  {
        this.AuthorsList.push(author);
      });
    });
  }


  // CREATE
  saveAuthor() {

    const ID = this.getUniqueId();
    const author: Author = {
      name:         this.forma.value.name,
      email:        this.forma.value.email,
      membership:   this.forma.value.membership,
      active:       this.forma.value.active,
      id:           ID
    };

    this.AuthorsCol.doc(ID).set(author).then((result) => {
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      name: '',
      email: '',
      membership: '',
      active: false,
    });
  }

  // UPDATE
  updateAuthor ( author: Author ) {
    this.forma.reset({
      name: author.name,
      email: author.email,
      membership: author.membership,
      active: author.active,
    });
    this.updatedID  = author.id;
    this.updateMode = true;
  }

  update() {
    if ( this.updateMode ) {
      const author: Author = {
        name:         this.forma.value.name,
        email:        this.forma.value.email,
        membership:   this.forma.value.membership,
        active:       this.forma.value.active,
        id:           this.updatedID
      };
      this.AuthorsCol.doc(this.updatedID).update(author);
    }
    this.forma.reset({
      name: '',
      email: '',
      membership: '',
      active: false,
    });
    this.updatedID  = '';
    this.updateMode = false;
  }

  // DELETE
  deleteAuthor ( author: Author, content ) {
    const response = confirm('are you sure you want to delete?');
    if ( response ) {
      this.AuthorsCol.doc(author.id).delete();
    }
    return;
  }

  getUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime().toString(36);
  }

}
