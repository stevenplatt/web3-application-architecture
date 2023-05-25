# byte-access <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/byte-access.svg?style=flat-square)](https://codecov.io/gh/achingbrain/byte-access)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/byte-access/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/byte-access/actions/workflows/js-test-and-release.yml)

> Access data in Uint8ArrayLists and Uint8Arrays in a uniform way

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i byte-access
```

## Usage

```js
import { Uint8ArrayList } from 'uint8arraylist'
import accessor from 'byte-access'

// access Uint8Array data
const array = Uint8Array.from([0, 1, 2, 3, 4])
const arrayAccess = accessor(array)
arrayAccess.get(1) // 1
arrayAccess.set(1, 2)

// access Uint8ArrayList data
const list = new Uint8ArrayList(
  Uint8Array.from([0, 1, 2]),
  Uint8Array.from([3, 4])
)
const listAccess = accessor(list)
listAccess.get(1) // 1
listAccess.set(1, 2)
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
