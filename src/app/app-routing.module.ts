import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PropertyComponent } from './property/property.component';
import { WatchListComponent } from './watch-list/watch-list.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'property/:id', component: PropertyComponent },
  { path: 'watchlist', component: WatchListComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
