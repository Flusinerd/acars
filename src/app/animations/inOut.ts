import { transition, style, animate, trigger, AnimationTriggerMetadata } from '@angular/animations';

/**
 *
 * @param time time string eg: '500ms', '1s'
 * @returns AnimationTriggerMetadata used in animations array
 */
export function inOutAnimation(time: string): AnimationTriggerMetadata {
  return trigger('inOutAnimation', [
    transition(
      ':enter',
      [
        style({opacity: 0}),
        animate(time + ' ease-out', style({opacity: 1}))
      ]
    ),
    transition(
      ':leave',
      [
        style({opacity: 1}),
        animate(time + ' ease-in', style({opacity: 0}))
      ]
    )
  ]);
}