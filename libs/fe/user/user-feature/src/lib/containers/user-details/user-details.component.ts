import { CommonModule } from '@angular/common';
import { Component, effect, inject, Injector, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { staggeredFadeIn } from '@sparrow-home/ui';
import { User, UserDataFacadeService, UserRole } from '@sparrow-home/user-domain';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'sp-user-details',
  imports: [CommonModule, FormsModule, Button, Avatar, Divider, ToggleSwitch, Card],
  templateUrl: './user-details.component.html',
  animations: [staggeredFadeIn],
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
    if (userId !== undefined) {
      this._dataService.activateUser(userId, active);
    }
  }
}
