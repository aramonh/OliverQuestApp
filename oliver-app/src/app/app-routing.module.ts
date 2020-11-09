import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'edit-quest/:id',
    loadChildren: () => import('./pages/quest-pages/edit-quest/edit-quest.module').then( m => m.EditQuestPageModule)
  }
  ,
  {
    path: 'add-quest',
    loadChildren: () => import('./pages/quest-pages/add-quest/add-quest.module').then( m => m.AddQuestPageModule)
  }

  ,
  {
    path: 'quest-pages',
    loadChildren: () => import('./pages/quest-pages/quest-pages.module').then( m => m.QuestPagesPageModule)
  },


  
  {
    path: 'global-dialog-page',
    loadChildren: () => import('./pages/global-dialog-page/global-dialog-page.module').then( m => m.GlobalDialogPagePageModule)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
