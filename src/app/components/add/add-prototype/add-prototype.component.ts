import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Prototype } from '../../../interfaces/prototypes.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthorsService } from '../../../services/authors.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-prototype',
  templateUrl: './add-prototype.component.html'
})
export class AddPrototypeComponent implements OnInit {

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
  private PrototypesCol: AngularFirestoreCollection<Prototype>;
  public  PrototypesObs: Observable<Prototype[]>;
  private PrototypesList: Prototype[]  = [];
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
      'availability':   new FormControl( '', Validators.required ),
      'institution':   new FormControl( '', Validators.required ),
      'year':     new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':  new FormArray([ new FormControl('', Validators.required ) ])
    });

    this.PrototypesCol = db.collection<Prototype>('PROTOTYPES');
    this.PrototypesObs = this.PrototypesCol.valueChanges();

  }

  ngOnInit() {
    this.AuthorsNames  = this._authorsService.getAuthorsNames();
    this.PrototypesObs.subscribe( prototypes => {
      prototypes.forEach( prototype =>  {
        this.PrototypesList.push(prototype);
      });
    });
    this.checkCookies();
  }

  savePrototype() {

    const ID = this.getUniqueId();
    const prototype: Prototype = {
      id:           ID,
      title:        this.forma.value.title,
      availability: this.forma.value.availability,
      institution:  this.forma.value.institution,
      year:         this.forma.value.year.toString(),
      author:       this.forma.value.authors.join(' , ')

    };

    this.PrototypesCol.doc(ID).set(prototype).then( (result) => {
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      availability: '',
      institution: '',
      year: null
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
    this.cookieService.deleteAll();
  }

  // UPDATE
  updatePrototype ( prototype: Prototype ) {

    this.forma.reset({
      title:        prototype.title,
      availability: prototype.availability,
      institution:  prototype.institution,
      year:         prototype.year
    });

    const authors: string[] = prototype.author.split(' , ');
    for ( let i = 0; i < authors.length; i++ ) {
      (<FormArray>this.forma.controls['authors']).push(
        new FormControl( authors[i], Validators.required )
      );
    }
    (<FormArray>this.forma.controls['authors']).removeAt(0);
    this.updatedID  = prototype.id;
    this.updateMode = true;
  }

  update() {
    if ( this.updateMode ) {
      const prototype: Prototype = {
        id:           this.updatedID,
        title:        this.forma.value.title,
        availability: this.forma.value.availability,
        institution:  this.forma.value.institution,
        year:         this.forma.value.year.toString(),
        author:       this.forma.value.authors.join(' , ')
      };
      this.PrototypesCol.doc(this.updatedID).update(prototype);
    }
    this.forma.reset({
      title: '',
      availability: '',
      institution: '',
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
   deletePrototype ( prototype: Prototype, content ) {
    this.deleteID = prototype.id;
    this.deleteTitle = prototype.title;
    this.modalService.open( content, { ariaLabelledBy: 'modal-basic-title' } )
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  delete() {
    this.PrototypesCol.doc(this.deleteID).delete();
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

    if ( this.cookieService.check('AVAILABILITY') ) {
      this.forma.controls['availability'].setValue( this.cookieService.get('AVAILABILITY') );
    }

    if ( this.cookieService.check('INSTITUTION') ) {
      this.forma.controls['institution'].setValue( this.cookieService.get('INSTITUTION') );
    }

    if ( this.cookieService.check('YEAR') ) {
      this.forma.controls['year'].setValue( this.cookieService.get('YEAR') );
    }

    this.forma.controls['title'].valueChanges.subscribe( data => {
      this.cookieService.set( 'TITLE', data );
    });

    this.forma.controls['availability'].valueChanges.subscribe( data => {
      this.cookieService.set( 'AVAILABILITY', data );
    });

    this.forma.controls['institution'].valueChanges.subscribe( data => {
      this.cookieService.set( 'INSTITUTION', data );
    });

    this.forma.controls['year'].valueChanges.subscribe( data => {
      this.cookieService.set( 'YEAR', data );
    });
  }

}

