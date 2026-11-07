import { Animation, AnimationBuilder, createAnimation } from '@ionic/angular';

import { responsiveNavigationAnimation } from './responsive-navigation-animation';

describe('responsiveNavigationAnimation', () => {
  it('disables page transitions on desktop and restores them on mobile after resizing', () => {
    let desktop: boolean = false;
    const element: HTMLElement = document.createElement('div');
    const options: object = { direction: 'forward' };
    const buildAnimation: jest.MockedFunction<AnimationBuilder> = jest.fn<Animation, Parameters<AnimationBuilder>>(
      () => createAnimation().duration(540),
    );
    const transition: AnimationBuilder = responsiveNavigationAnimation(() => desktop, buildAnimation);

    const mobileAnimation: Animation = transition(element, options);
    expect(mobileAnimation.getDuration()).toBe(540);
    expect(buildAnimation).toHaveBeenCalledWith(element, options);

    desktop = true;
    expect(transition(element, options).getDuration()).toBeLessThanOrEqual(1);

    desktop = false;
    expect(transition(element, options).getDuration()).toBe(540);
  });
});
