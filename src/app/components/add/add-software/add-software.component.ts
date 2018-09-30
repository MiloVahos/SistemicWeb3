import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Software } from '../../../interfaces/software.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthorsService } from '../../../services/authors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-software',
  templateUrl: './add-software.component.html'
})
export class AddSoftwareComponent implements OnInit {

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
  private SoftwaresCol: AngularFirestoreCollection<Software>;
  private SoftwaresObs: Observable<Software[]>;
  private SoftwaresList: Software[]  = [];
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
      'name':  new FormControl( '', Validators.required ),
      'availability':   new FormControl( '', Validators.required ),
      'institution':   new FormControl( '', Validators.required ),
      'year':     new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':  new FormArray([ new FormControl('', Validators.required ) ])
    });

    this.SoftwaresCol = db.collection<Software>('SOFTWARE');
    this.SoftwaresObs = this.SoftwaresCol.valueChanges();

  }

  ngOnInit() {
    this.AuthorsNames  = this._authorsService.getAuthorsNames();
    this.SoftwaresObs.subscribe( softwares => {
      softwares.forEach( software =>  {
        this.SoftwaresList.push(software);
      });
    });
  }

  saveSoftware() {

    const ID = this.getUniqueId();
    const software: Software = {
      id:           ID,
      title:        this.forma.value.title,
      name:         this.forma.value.name,
      availability: this.forma.value.availability,
      institution:  this.forma.value.institution,
      year:         this.forma.value.year.toString(),
      author:       this.forma.value.authors.join(' , ')
    };

    this.SoftwaresCol.doc(ID).set(software).then((result) => {
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      name: '',
      availability: '',
      institution: '',
      year: null
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
  }

  // UPDATE
  updateSoftware ( software: Software ) {

    this.forma.reset({
      title:        software.title,
      name:         software.name,
      availability: software.availability,
      institution:  software.institution,
      year:         software.year
    });

    const authors: string[] = software.author.split(' , ');
    for ( let i = 0; i < authors.length; i++ ) {
      (<FormArray>this.forma.controls['authors']).push(
        new FormControl( authors[i], Validators.required )
      );
    }
    (<FormArray>this.forma.controls['authors']).removeAt(0);
    this.updatedID  = software.id;
    this.updateMode = true;
  }

  update() {
    if ( this.updateMode ) {
      const software: Software = {
        id:           this.updatedID,
        title:        this.forma.value.title,
        name:         this.forma.value.name,
        availability: this.forma.value.availability,
        institution:  this.forma.value.institution,
        year:         this.forma.value.year.toString(),
        author:       this.forma.value.authors.join(' , ')
      };
      this.SoftwaresCol.doc(this.updatedID).update(software);
    }
    this.forma.reset({
      title: '',
      name: '',
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
  }

   // DELETE
   deleteSoftware ( software: Software, content ) {
    this.deleteID = software.id;
    this.deleteTitle = software.title;
    this.modalService.open( content, { ariaLabelledBy: 'modal-basic-title' } )
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  delete() {
    this.SoftwaresCol.doc(this.deleteID).delete();
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
