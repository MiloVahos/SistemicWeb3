import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Journal } from '../../../interfaces/journal.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthorsService } from '../../../services/authors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-journal',
  templateUrl: './add-journal.component.html'
})
export class AddJournalComponent implements OnInit {

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
  private JournalsCol: AngularFirestoreCollection<Journal>;
  private JournalsObs: Observable<Journal[]>;
  private JournalsList: Journal[]  = [];
  private AuthorsNames: Array<string> = [];

  constructor(  private router: Router,
                private _authS: AuthService,
                private _authorsService: AuthorsService,
                private db: AngularFirestore,
                private modalService: NgbModal
            ) {

    if ( !this._authS.isUserEmailLoggedIn ) {
      this.router.navigate(['/']);
    }

    this.forma = new FormGroup({
      'title':    new FormControl( '', Validators.required ),
      'journal':  new FormControl( '', Validators.required ),
      'number':   new FormControl( '', Validators.required ),
      'volume':   new FormControl( '', Validators.required ),
      'pages':    new FormControl( '' ),
      'url':      new FormControl( '' ),
      'colCat':   new FormControl( '' ),
      'sjrCat':   new FormControl( '' ),
      'year':     new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':  new FormArray([ new FormControl('', Validators.required ) ])
    });

    this.JournalsCol = db.collection<Journal>('JOURNALS');
    this.JournalsObs = this.JournalsCol.valueChanges();

  }

  ngOnInit() {
    this.AuthorsNames  = this._authorsService.getAuthorsNames();
    this.JournalsObs.subscribe( journals => {
      journals.forEach( journal =>  {
        this.JournalsList.push(journal);
      });
    });
  }

  saveJournal() {

    const ID = this.getUniqueId();
    const journal: Journal = {
      id:       ID,
      title:    this.forma.value.title,
      journal:  this.forma.value.journal,
      number:   this.forma.value.number,
      volume:   this.forma.value.volume,
      pages:    this.forma.value.pages,
      url:      this.forma.value.url,
      colCat:   this.forma.value.colCat,
      sjrCat:   this.forma.value.sjrCat,
      year:     this.forma.value.year.toString(),
      author:   this.forma.value.authors.join(' , ')

    };

    this.JournalsCol.doc(ID).set(journal).then( (result) => {
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      journal: '',
      number: '',
      volume: '',
      pages: '',
      url: '',
      colCat: '',
      sjrCat: '',
      year: null
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
  }

  updateJournal ( journal: Journal ) {

    this.forma.reset({
      title:    journal.title,
      journal:  journal.journal,
      number:   journal.number,
      volume:   journal.volume,
      pages:    journal.pages,
      url:      journal.url,
      colCat:   journal.colCat,
      sjrCat:   journal.sjrCat,
      year:     journal.year
    });

    const authors: string[] = journal.author.split(' , ');
    for ( let i = 0; i < authors.length; i++ ) {
      (<FormArray>this.forma.controls['authors']).push(
        new FormControl( authors[i], Validators.required )
      );
    }
    (<FormArray>this.forma.controls['authors']).removeAt(0);
    this.updatedID  = journal.id;
    this.updateMode = true;
  }

  update() {
    if ( this.updateMode ) {
      const journal: Journal = {
        id:       this.updatedID,
        title:    this.forma.value.title,
        journal:  this.forma.value.journal,
        number:   this.forma.value.number,
        volume:   this.forma.value.volume,
        pages:    this.forma.value.pages,
        url:      this.forma.value.url,
        colCat:   this.forma.value.colCat,
        sjrCat:   this.forma.value.sjrCat,
        year:     this.forma.value.year.toString(),
        author:   this.forma.value.authors.join(' , ')
      };
      this.JournalsCol.doc(this.updatedID).update(journal);
    }
    this.forma.reset({
      title: '',
      journal: '',
      number: '',
      volume: '',
      pages: '',
      url: '',
      colCat: '',
      sjrCat: '',
      year: null
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
    this.updatedID  = '';
    this.updateMode = false;
  }

  // DELETE
  deleteJournal ( journal: Journal, content ) {
    this.deleteID = journal.id;
    this.deleteTitle = journal.title;
    this.modalService.open( content, { ariaLabelledBy: 'modal-basic-title' } )
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  delete() {
    this.JournalsCol.doc(this.deleteID).delete();
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

}
