import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PageTitleComponent } from '@sparrow-home/ui';
import { User, UserDataFacadeService } from '@sparrow-home/user-domain';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Skeleton } from 'primeng/skeleton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Observable } from 'rxjs';

@Component({
  selector: 'sp-user-details',
  imports: [
    CommonModule,
    FormsModule,
    Button,
    Avatar,
    Divider,
    ToggleSwitch,
    Card,
    TranslatePipe,
    Skeleton,
    PageTitleComponent,
  ],
  templateUrl: './user-details.component.html',
})
export class UserDetailsComponent implements OnInit {
  private readonly _dataService: UserDataFacadeService = inject(UserDataFacadeService);

  protected readonly user: Signal<User | null> = this._dataService.user;
  protected readonly additionalUsers: Signal<User[] | null> = this._dataService.additionalUsers;
  protected readonly isLoading$: Observable<boolean> = this._dataService.isLoading$;
  protected readonly isRefreshing$: Observable<boolean> = this._dataService.isRefreshing;

  public ngOnInit(): void {
    this._dataService.fetchUserDetails();
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
