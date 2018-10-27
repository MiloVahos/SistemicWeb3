import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Conference } from '../../../interfaces/conference.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthorsService } from '../../../services/authors.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-conference',
  templateUrl: './add-conference.component.html'
})
export class AddConferenceComponent implements OnInit {

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
  private ConferencesCol: AngularFirestoreCollection<Conference>;
  public  ConferencesObs: Observable<Conference[]>;
  private ConferencesList: Conference[]  = [];
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
      'conference':  new FormControl( '', Validators.required ),
      'pages':    new FormControl( '' ),
      'url':      new FormControl( '' ),
      'ambit':   new FormControl( '' ),
      'year':     new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':  new FormArray([ new FormControl('', Validators.required ) ])
    });

    this.ConferencesCol = db.collection<Conference>('CONFERENCES');
    this.ConferencesObs = this.ConferencesCol.valueChanges();

  }

  ngOnInit() {
    this.AuthorsNames  = this._authorsService.getAuthorsNames();
    this.ConferencesObs.subscribe( conferences => {
      conferences.forEach( conference =>  {
        this.ConferencesList.push(conference);
      });
    });
    this.checkCookies();
  }

  saveConference() {

    const ID = this.getUniqueId();
    const conference: Conference = {
      id:           ID,
      title:        this.forma.value.title,
      conference:   this.forma.value.conference,
      pages:        this.forma.value.pages,
      url:          this.forma.value.url,
      ambit:        this.forma.value.ambit,
      year:         this.forma.value.year.toString(),
      author:       this.forma.value.authors.join(' , ')
    };

    this.ConferencesCol.doc(ID).set(conference).then( (result) => {
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      conference: '',
      pages: '',
      url: '',
      ambit: '',
      year: null
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
    this.cookieService.deleteAll();
  }

   // UPDATE
   updateConference ( conference: Conference ) {

    this.forma.reset({
      title:        conference.title,
      conference:   conference.conference,
      pages:        conference.pages,
      url:          conference.url,
      ambit:        conference.ambit,
      year:         conference.year
    });

    const authors: string[] = conference.author.split(' , ');
    for ( let i = 0; i < authors.length; i++ ) {
      (<FormArray>this.forma.controls['authors']).push(
        new FormControl( authors[i], Validators.required )
      );
    }
    (<FormArray>this.forma.controls['authors']).removeAt(0);
    this.updatedID  = conference.id;
    this.updateMode = true;
  }

  update() {
    if ( this.updateMode ) {
      const conference: Conference = {
        id:           this.updatedID,
        title:        this.forma.value.title,
        conference:   this.forma.value.conference,
        pages:        this.forma.value.pages,
        url:          this.forma.value.url,
        ambit:        this.forma.value.ambit,
        year:         this.forma.value.year.toString(),
        author:       this.forma.value.authors.join(' , ')
      };
      this.ConferencesCol.doc(this.updatedID).update(conference);
    }
    this.forma.reset({
      title: '',
      conference: '',
      pages: '',
      url: '',
      ambit: '',
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
  deleteConference ( conference: Conference, content ) {
    this.deleteID = conference.id;
    this.deleteTitle = conference.title;
    this.modalService.open( content, { ariaLabelledBy: 'modal-basic-title' } )
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  delete() {
    this.ConferencesCol.doc(this.deleteID).delete();
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

    if ( this.cookieService.check('CONFERENCE') ) {
      this.forma.controls['conference'].setValue( this.cookieService.get('CONFERENCE') );
    }

    if ( this.cookieService.check('PAGES') ) {
      this.forma.controls['pages'].setValue( this.cookieService.get('PAGES') );
    }

    if ( this.cookieService.check('URL') ) {
      this.forma.controls['url'].setValue( this.cookieService.get('URL') );
    }

    if ( this.cookieService.check('AMBIT') ) {
      this.forma.controls['ambit'].setValue( this.cookieService.get('AMBIT') );
    }

    if ( this.cookieService.check('YEAR') ) {
      this.forma.controls['year'].setValue( this.cookieService.get('YEAR') );
    }

    this.forma.controls['title'].valueChanges.subscribe( data => {
      this.cookieService.set( 'TITLE', data );
    });

    this.forma.controls['conference'].valueChanges.subscribe( data => {
      this.cookieService.set( 'CONFERENCE', data );
    });

    this.forma.controls['pages'].valueChanges.subscribe( data => {
      this.cookieService.set( 'PAGES', data );
    });

    this.forma.controls['url'].valueChanges.subscribe( data => {
      this.cookieService.set( 'URL', data );
    });

    this.forma.controls['ambit'].valueChanges.subscribe( data => {
      this.cookieService.set( 'AMBIT', data );
    });

    this.forma.controls['year'].valueChanges.subscribe( data => {
      this.cookieService.set( 'YEAR', data );
    });
  }

}

