import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  },
  {
    path: 'chat-screen',
    loadChildren: () => import('./chat-screen/chat-screen.module').then( m => m.ChatScreenPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
