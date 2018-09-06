import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// RUTAS
import { APP_ROUTING } from './app.router';

// PIPES
import { CapitalizadoPipe } from './pipes/capitalizado.pipe';
import { AutoresPipe } from './pipes/autores.pipe';
import { SearchByAuthorPipe } from './pipes/filter-authors.pipe';
import { SearchByYearPipe } from './pipes/filter-year-pipe';
import { SearchByTitlePipe } from './pipes/filter-title-pipe';

// SERVICES
import { BooksService } from './services/books.service';


// COMPONENTES
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { BookComponent } from './components/book/book.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { JournalComponent } from './components/journal/journal.component';
import { ConferenceComponent } from './components/conference/conference.component';
import { PrototypesComponent } from './components/prototypes/prototypes.component';
import { SoftwareComponent } from './components/software/software.component';
import { ThesisComponent } from './components/thesis/thesis.component';
import { AuthorComponent } from './components/author/author.component';
import { AddAuthorComponent } from './components/add/add-author/add-author.component';
import { AddBookComponent } from './components/add/add-book/add-book.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    BookComponent,
    ChapterComponent,
    JournalComponent,
    ConferenceComponent,
    PrototypesComponent,
    SoftwareComponent,
    ThesisComponent,
    CapitalizadoPipe,
    AutoresPipe,
    SearchByAuthorPipe,
    SearchByTitlePipe,
    SearchByYearPipe,
    AuthorComponent,
    AddAuthorComponent,
    AddBookComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    APP_ROUTING,
    NgbTypeaheadModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
  providers: [
    BooksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
