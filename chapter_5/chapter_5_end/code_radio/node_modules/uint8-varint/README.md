# uint8-varint <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/uint8-varint.svg?style=flat-square)](https://codecov.io/gh/achingbrain/uint8-varint)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/uint8-varint/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/uint8-varint/actions/workflows/js-test-and-release.yml)

> Read/write varints from Uint8Arrays and Uint8ArrayLists

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i uint8-varint
```

## Usage

```js
import { Uint8ArrayList } from 'uint8arraylist'
import * as varint from 'uint8-varint'

const value = 12345

const buf = new Uint8ArrayList(
  new Uint8Array(2)
)
varint.signed.encode(value, buf)

varint.signed.decode(buf) // 12345
```

`BigInt`s are also supported:

```js
import { Uint8ArrayList } from 'uint8arraylist'
import * as varint from 'uint8-varint/big'

const value = 12345n

const buf = new Uint8ArrayList(
  new Uint8Array(2)
)
varint.signed.encode(value, buf)

varint.signed.decode(buf) // 12345n
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
