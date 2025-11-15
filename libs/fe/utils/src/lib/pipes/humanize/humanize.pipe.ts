import { Pipe, PipeTransform } from '@angular/core';

import { humanize } from '../../functions/humanize/humanize';

@Pipe({
  name: 'humanize',
})
export class HumanizePipe implements PipeTransform {
  public transform(value: unknown): string {
    return humanize(value);
  }
}
