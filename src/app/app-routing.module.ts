import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { RequestResetComponent } from './account/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './account/password/response-reset/response-reset.component';
import { HomeComponent } from './home-dashboard/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { BuyBookFormComponent } from './user/buy-book/buy-book-form/buy-book-form.component';
import { RegisterComponent } from './account/register/register.component';
import { AccountActivationComponent } from './account/account-activation/account-activation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';




const routes: Routes = [
  //{ path: '', loadChildren: () => import('./home-dashboard/home-dashboard.module').then(m => m.HomeDashboardModule)    },
  /*{
    path: 'login',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user-routing.module').then(m => m.UserRoutingModule)
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/employee-routing.module').then(m => m.EmployeeRoutingModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home-dashboard/home-dashboard.module').then(m => m.HomeDashboardModule)
  }*/
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'account-activation', component: AccountActivationComponent},

  {path: 'request-password-reset', component: RequestResetComponent},
  {path: 'response-password-reset', component: ResponseResetComponent},
  {path: 'home', component: HomeComponent},

  {path:'',redirectTo:'login', pathMatch: 'full' },
  {path: 'page-not-found', component: PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
