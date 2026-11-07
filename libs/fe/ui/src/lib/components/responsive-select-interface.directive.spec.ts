import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ResponsiveSelectInterfaceDirective } from './responsive-select-interface.directive';

@Component({
  imports: [ResponsiveSelectInterfaceDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<ion-select></ion-select>',
})
class SelectHostComponent {}

describe('ResponsiveSelectInterfaceDirective', () => {
  let breakpointState$: Subject<BreakpointState>;

  beforeEach(() => {
    breakpointState$ = new Subject<BreakpointState>();
    TestBed.configureTestingModule({
      imports: [SelectHostComponent],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: {
            observe: jest.fn(() => breakpointState$),
          },
        },
      ],
    });
  });

  it('uses an action sheet below the desktop breakpoint and a popover at or above it', () => {
    const fixture: ComponentFixture<SelectHostComponent> = TestBed.createComponent(SelectHostComponent);
    fixture.detectChanges();
    const select: HTMLElement = fixture.nativeElement.querySelector('ion-select');

    expect(select.getAttribute('interface')).toBe('action-sheet');

    breakpointState$.next({ matches: true, breakpoints: { '(min-width: 768px)': true } });
    fixture.detectChanges();
    expect(select.getAttribute('interface')).toBe('popover');

    breakpointState$.next({ matches: false, breakpoints: { '(min-width: 768px)': false } });
    fixture.detectChanges();
    expect(select.getAttribute('interface')).toBe('action-sheet');
  });
});
