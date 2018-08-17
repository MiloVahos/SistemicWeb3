import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// RUTAS
import { APP_ROUTING } from './app.router';

// SERVICIOS
import { BookService } from './services/book.service';

// PIPES
import { CapitalizadoPipe } from './pipes/capitalizado.pipe';
import { AutoresPipe } from './pipes/autores.pipe';

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
import { AddBookComponent } from './components/add/add-book/add-book.component';
import { AuthorComponent } from './components/author/author.component';
import { AddAuthorComponent } from './components/add/add-author/add-author.component';

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
    AddBookComponent,
    CapitalizadoPipe,
    AutoresPipe,
    AuthorComponent,
    AddAuthorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    APP_ROUTING,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
