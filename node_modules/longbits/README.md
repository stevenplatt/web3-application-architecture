# longbits <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/longbits.svg?style=flat-square)](https://codecov.io/gh/achingbrain/longbits)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/longbits/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/longbits/actions/workflows/js-test-and-release.yml)

> BigInts represented as hi/low bit values

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i longbits
```

## Usage

```js
import { LongBits } from 'longbits'

const val = 6547656755453442n
const bits = LongBits.fromBigInt(val)

bits.toBigInt() // 6547656755453442n
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
