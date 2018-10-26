import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Book } from '../../../interfaces/book.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthorsService } from '../../../services/authors.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html'
})
export class AddBookComponent implements OnInit {

  // VARIABLES DE ENTORNO
  forma: FormGroup;                   // OBJETO MODIFICADOR DEL FORMULARIO
  showSuccess$: Observable<boolean>;  // SI SE COMPLETA UNA TRANSFERENCIA SE ACTIVA ESTA BANDERA
  showError$: Observable<boolean>;    // SI LA TRANSFERENCIA FALLA, SE ACTIVA ESTA BANDERA
  updateMode = false;                 // MODO UPDATE ACTIVADO
  private updatedID: string;          // ID QUE SE VA A MODIFICAR
  private deleteID: string;           // ID QUE SE VA A ELIMINAR
  deleteTitle: string;                // TITULO DEL LIBRO QUE SE VA A BORRAR

  // VARIABLES
  public currentYear = new Date().getFullYear();  // AÑO ACTUAL
  closeResult: string;

  // VARIABLES DE LA BASE DE DATOS
  private BooksCol: AngularFirestoreCollection<Book>;  // COLECCIÓN DE AUTORES DE LA BASE DE DATOS
  public  BooksObs: Observable<Book[]>; // OBSERVABLE DONDE SE VAN A ALMACENAR LOS AUTORES
  private BooksList: Book[]  = []; // CONTENDRÁ LOS AUTORES SI NO SE DESEAN COMO OBSERVABLE
  private AuthorsNames: Array<string> = []; // ARREGLO CON SOLO LOS NOMBRES DE LOS AUTORES

  constructor(  private router: Router,
                private _authS: AuthService,
                private _authorsService: AuthorsService,
                private db: AngularFirestore,
                private modalService: NgbModal,
                private cookieService: CookieService
              ) {

    if ( !this._authS.isUserEmailLoggedIn ) {
      this.router.navigate(['/']);
    }

    this.forma = new FormGroup({
      'title':      new FormControl( '', Validators.required ),
      'editorial':  new FormControl( '', Validators.required ),
      'year':       new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':    new FormArray([ new FormControl('', Validators.required ) ])
    });

    this.BooksCol = db.collection<Book>('BOOKS');
    this.BooksObs = this.BooksCol.valueChanges();
  }

  ngOnInit() {
    this.AuthorsNames  = this._authorsService.getAuthorsNames();
    this.BooksObs.subscribe( books => {
      books.forEach( book =>  {
        this.BooksList.push(book);
      });
    });
    this.checkCookies();
  }

  saveBook() {

    const ID = this.getUniqueId();
    const book: Book = {
      id:         ID,
      title:      this.forma.value.title,
      editorial:  this.forma.value.editorial,
      year:       this.forma.value.year.toString(),
      author:     this.forma.value.authors.join(' , ')
    };

    this.BooksCol.doc(ID).set(book).then( (result) => {
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.cookieService.deleteAll();
    this.forma.reset({
      title: '',
      editorial: '',
      year: ''
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }

  }

  // UPDATE
  updateBook ( book: Book ) {
    this.forma.reset({
      title: book.title,
      editorial: book.editorial,
      year: book.year
    });

    const authors: string[] = book.author.split(' , ');
    for ( let i = 0; i < authors.length; i++ ) {
      (<FormArray>this.forma.controls['authors']).push(
        new FormControl( authors[i], Validators.required )
      );
    }
    (<FormArray>this.forma.controls['authors']).removeAt(0);
    this.updatedID  = book.id;
    this.updateMode = true;
  }

  update() {
    if ( this.updateMode ) {
      const book: Book = {
        id:         this.updatedID,
        title:      this.forma.value.title,
        editorial:  this.forma.value.editorial,
        year:       this.forma.value.year.toString(),
        author:     this.forma.value.authors.join(' , ')
      };
      this.BooksCol.doc(this.updatedID).update(book);
    }
    this.forma.reset({
      title: '',
      editorial: '',
      year: ''
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
    this.updatedID  = '';
    this.updateMode = false;
    this.cookieService.deleteAll();
  }

  // DELETE
  deleteBook ( book: Book, content ) {
    this.deleteID = book.id;
    this.deleteTitle = book.title;
    this.modalService.open( content, { ariaLabelledBy: 'modal-basic-title' } )
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  delete() {
    this.BooksCol.doc(this.deleteID).delete();
    this.deleteID  = '';
    this.deleteTitle  = '';
    this.modalService.dismissAll(this.closeResult);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.AuthorsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )


  addAuthor() {
    (<FormArray>this.forma.controls['authors']).push(
      new FormControl('', Validators.required)
    );
  }

  removeAuthor( i: number ) {
    (<FormArray>this.forma.controls['authors']).removeAt(i);
  }

  getUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime().toString(36);
  }

  get formAuthors() { return <FormArray>this.forma.get('authors'); }

  checkCookies() {
    if ( this.cookieService.check('TITLE') ) {
      this.forma.controls['title'].setValue( this.cookieService.get('TITLE') );
    }

    if ( this.cookieService.check('EDITORIAL') ) {
      this.forma.controls['editorial'].setValue( this.cookieService.get('EDITORIAL') );
    }

    if ( this.cookieService.check('YEAR') ) {
      this.forma.controls['year'].setValue( this.cookieService.get('YEAR') );
    }

    this.forma.controls['title'].valueChanges.subscribe( data => {
      this.cookieService.set( 'TITLE', data );
    });

    this.forma.controls['editorial'].valueChanges.subscribe( data => {
      this.cookieService.set( 'EDITORIAL', data );
    });

    this.forma.controls['year'].valueChanges.subscribe( data => {
      this.cookieService.set( 'YEAR', data );
    });
  }

}
