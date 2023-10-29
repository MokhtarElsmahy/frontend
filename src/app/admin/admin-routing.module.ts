import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { HallsComponent } from './halls/halls.component';
import { AdminAuthGuard } from '../guard/admin-auth.guard';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AdminAuthGuard]} ,
  {path: 'profile', component: ProfileComponent, canActivate: [AdminAuthGuard]} ,
   {path: 'users', component: UsersComponent, canActivate: [AdminAuthGuard]} ,
   {path: 'libraries', component: LibrariesComponent, canActivate: [AdminAuthGuard]} ,
   {path: 'halls/:id', component: HallsComponent, canActivate: [AdminAuthGuard]} ,
    
   {path: '**', component: PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
