import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from '../guard/admin-auth.guard';
import { HomeComponent } from "./home/home.component";
import { HomeSamplesComponent } from './home-samples/home-samples.component';


const routes: Routes = [

  {
    path: 'auth', component: HomeComponent, children: [
      { path: 'samples', component: HomeSamplesComponent },

      {
        path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
      },
      // {
      //   path: 'employee', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      // },
      {
        path: 'supplies', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'libraryServices', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'programsAndEvents', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'universityThesises', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'technicalSupport', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'giftSpecialLibraries', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'technicalDepartment', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'printingArchiving', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'femalBeneficicareis', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'publicAdminstration', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'maleLibRelations', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'femaleLibRelations', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'user', loadChildren: () => import('../user/user.module').then(m => m.UserModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule {
}
