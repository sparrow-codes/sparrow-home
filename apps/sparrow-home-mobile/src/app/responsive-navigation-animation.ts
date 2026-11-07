import { Animation, AnimationBuilder, iosTransitionAnimation } from '@ionic/angular';

export function responsiveNavigationAnimation(
  isDesktop: () => boolean,
  buildAnimation: AnimationBuilder = iosTransitionAnimation,
): AnimationBuilder {
  return (baseElement, options): Animation => {
    const animation: Animation = buildAnimation(baseElement, options);
    return isDesktop() ? animation.duration(0) : animation;
  };
}
