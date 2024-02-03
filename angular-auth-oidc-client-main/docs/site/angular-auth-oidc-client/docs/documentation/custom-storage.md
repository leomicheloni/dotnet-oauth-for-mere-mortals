---
sidebar_label: Custom Storage
sidebar_position: 7
---

# Custom Storage

The library uses the `sessionStorage` as the default storage mechanism. If needed, you can create a custom storage implementation, e.g. to use `localStorage` or cookies.
A storage provider is implemented as a class with the `AbstractSecurityStorage` interface and the `read`, `write` and `remove` methods.
The following example shows a custom storage that uses `localStorage`:

```ts
import { AbstractSecurityStorage } from 'angular-auth-oidc-client';

@Injectable()
export class MyStorageService implements AbstractSecurityStorage {
  read(key: string) {
    return localStorage.getItem(key);
  }

  write(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
```

Then provide the class in the module:

```ts
@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        // ...
      },
    }),
  ],
  providers: [{ provide: AbstractSecurityStorage, useClass: MyStorageService }],
  exports: [AuthModule],
})
export class AuthConfigModule {}
```
