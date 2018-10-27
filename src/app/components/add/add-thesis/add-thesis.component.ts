import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { AuthorsService } from '../../../services/authors.service';
import { Thesis } from '../../../interfaces/thesis.interface';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-thesis',
  templateUrl: './add-thesis.component.html'
})
export class AddThesisComponent implements OnInit {

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
  private ThesissCol: AngularFirestoreCollection<Thesis>;
  public  ThesissObs: Observable<Thesis[]>;
  private ThesissList: Thesis[]  = [];
  private AuthorsNames: Array<string> = [];

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
      'title':    new FormControl( '', Validators.required ),
      'student':  new FormControl( '', Validators.required ),
      'type':   new FormControl( '', Validators.required ),
      'university':   new FormControl( '', Validators.required ),
      'year':     new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':  new FormArray([ new FormControl('', Validators.required ) ])
    });

    this.ThesissCol = db.collection<Thesis>('THESIS');
    this.ThesissObs = this.ThesissCol.valueChanges();
  }

  ngOnInit() {
    this.AuthorsNames  = this._authorsService.getAuthorsNames();
    this.ThesissObs.subscribe( thesiss => {
      thesiss.forEach( thesis =>  {
        this.ThesissList.push(thesis);
      });
    });
    this.checkCookies();
  }

  saveThesis() {

    const ID = this.getUniqueId();
    const thesis: Thesis = {
      id:         ID,
      title:      this.forma.value.title,
      student:    this.forma.value.student,
      type:       this.forma.value.type,
      university: this.forma.value.university,
      year:       this.forma.value.year.toString(),
      author:     this.forma.value.authors.join(' , ')

    };

    this.ThesissCol.doc(ID).set(thesis).then( (result) => {
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      student: '',
      type: '',
      university: '',
      year: null
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
    this.cookieService.deleteAll();
  }

  // UPDATE
  updateThesis ( thesis: Thesis ) {

    this.forma.reset({
      title:      thesis.title,
      student:    thesis.student,
      type:       thesis.type,
      university: thesis.university,
      year:       thesis.year
    });

    const authors: string[] = thesis.author.split(' , ');
    for ( let i = 0; i < authors.length; i++ ) {
      (<FormArray>this.forma.controls['authors']).push(
        new FormControl( authors[i], Validators.required )
      );
    }
    (<FormArray>this.forma.controls['authors']).removeAt(0);
    this.updatedID  = thesis.id;
    this.updateMode = true;
  }

  update() {
    if ( this.updateMode ) {
      const thesis: Thesis = {
        id:         this.updatedID,
        title:      this.forma.value.title,
        student:    this.forma.value.student,
        type:       this.forma.value.type,
        university: this.forma.value.university,
        year:       this.forma.value.year.toString(),
        author:     this.forma.value.authors.join(' , ')
      };
      this.ThesissCol.doc(this.updatedID).update(thesis);
    }
    this.forma.reset({
      title: '',
      student: '',
      type: '',
      university: '',
      year: null
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
   deleteThesis ( thesis: Thesis, content ) {
    this.deleteID = thesis.id;
    this.deleteTitle = thesis.title;
    this.modalService.open( content, { ariaLabelledBy: 'modal-basic-title' } )
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  delete() {
    this.ThesissCol.doc(this.deleteID).delete();
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


  addAuthor() {
    (<FormArray>this.forma.controls['authors']).push(
      new FormControl('', Validators.required)
    );
  }

  removeAuthor( i: number ) {
    (<FormArray>this.forma.controls['authors']).removeAt(i);
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.AuthorsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  getUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime().toString(36);
  }

  get formAuthors() { return <FormArray>this.forma.get('authors'); }

  checkCookies() {

    if ( this.cookieService.check('TITLE') ) {
      this.forma.controls['title'].setValue( this.cookieService.get('TITLE') );
    }

    if ( this.cookieService.check('STUDENT') ) {
      this.forma.controls['student'].setValue( this.cookieService.get('STUDENT') );
    }

    if ( this.cookieService.check('TYPE') ) {
      this.forma.controls['type'].setValue( this.cookieService.get('TYPE') );
    }

    if ( this.cookieService.check('UNIVERSITY') ) {
      this.forma.controls['university'].setValue( this.cookieService.get('UNIVERSITY') );
    }

    if ( this.cookieService.check('YEAR') ) {
      this.forma.controls['year'].setValue( this.cookieService.get('YEAR') );
    }

    this.forma.controls['title'].valueChanges.subscribe( data => {
      this.cookieService.set( 'TITLE', data );
    });

    this.forma.controls['student'].valueChanges.subscribe( data => {
      this.cookieService.set( 'STUDENT', data );
    });

    this.forma.controls['type'].valueChanges.subscribe( data => {
      this.cookieService.set( 'TYPE', data );
    });

    this.forma.controls['university'].valueChanges.subscribe( data => {
      this.cookieService.set( 'UNIVERSITY', data );
    });

    this.forma.controls['year'].valueChanges.subscribe( data => {
      this.cookieService.set( 'YEAR', data );
    });
  }


}

