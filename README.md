# unzip-url

Unzip a remote zip file to local disk.

## Import

```js
import {unzip} from '@compilets/unzip-url';
```

## API

```ts
export declare function unzip(url: string, targetDir: string): Promise<void>;
```

## Example

```ts
import {unzip} from '@compilets/unzip-url';

await unzip('https://some.zip', '/tmp/myzip');
```

## CLI

```sh
npx unzip-url https://some.zip /tmp/myzip
```
