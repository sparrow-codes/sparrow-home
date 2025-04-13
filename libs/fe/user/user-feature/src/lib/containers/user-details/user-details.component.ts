import { CommonModule } from '@angular/common';
import { Component, effect, inject, Injector, OnInit, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftEndOnRectangleSolid } from '@ng-icons/heroicons/solid';
import { User, UserDataFacadeService, UserRole } from '@sparrow-home/user-domain';

import { UserBasicDataComponent } from '../../component/user-basic-data/user-basic-data.component';

@Component({
  selector: 'sp-user-details',
  imports: [CommonModule, MatCard, UserBasicDataComponent, MatButton, NgIcon, MatSlideToggle],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
  providers: [provideIcons({ heroArrowLeftEndOnRectangleSolid })],
})
export class UserDetailsComponent implements OnInit {
  private readonly _dataService: UserDataFacadeService = inject(UserDataFacadeService);
  private readonly _injector: Injector = inject(Injector);

  protected readonly user: Signal<User | null> = this._dataService.user;
  protected readonly additionalUsers: Signal<User[] | null> = this._dataService.additionalUsers;

  public ngOnInit(): void {
    this._dataService.fetchUserDetails();

    effect(
      () => {
        if (this.user()?.role === UserRole.OWNER) {
          console.log(this.user());
          this._dataService.fetchAdditionalUsers();
        }
      },
      { injector: this._injector }
    );
  }

  protected handleLogout(): void {
    this._dataService.logout();
  }

  protected handleUserActivatedToggle(active: boolean, userId?: number): void {
    if (active && userId) {
      this._dataService.activateUser(userId);
    }
  }
}
