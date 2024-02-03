import { Provider } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OpenIdConfiguration } from '../openid-configuration';

export class OpenIdConfigLoader {
  loader?: Provider;
}

export abstract class StsConfigLoader {
  abstract loadConfigs(): Observable<OpenIdConfiguration[]>;
}

export class StsConfigStaticLoader implements StsConfigLoader {
  constructor(
    private readonly passedConfigs: OpenIdConfiguration | OpenIdConfiguration[]
  ) {}

  loadConfigs(): Observable<OpenIdConfiguration[]> {
    if (Array.isArray(this.passedConfigs)) {
      return of(this.passedConfigs);
    }

    return of([this.passedConfigs]);
  }
}

export class StsConfigHttpLoader implements StsConfigLoader {
  constructor(
    private readonly configs$:
      | Observable<OpenIdConfiguration>
      | Observable<OpenIdConfiguration>[]
      | Observable<OpenIdConfiguration[]>
  ) {}

  loadConfigs(): Observable<OpenIdConfiguration[]> {
    if (Array.isArray(this.configs$)) {
      return forkJoin(this.configs$);
    }

    const singleConfigOrArray = this.configs$ as Observable<unknown>;

    return singleConfigOrArray.pipe(
      map((value: unknown) => {
        if (Array.isArray(value)) {
          return value as OpenIdConfiguration[];
        }

        return [value] as OpenIdConfiguration[];
      })
    );
  }
}
