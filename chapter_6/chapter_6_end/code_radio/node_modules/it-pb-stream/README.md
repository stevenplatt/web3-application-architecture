# it-pb-stream <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it-pb-stream.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it-pb-stream)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it-pb-stream/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it-pb-stream/actions/workflows/js-test-and-release.yml)

> A convenience-wrapper around protocol-buffers and lp-messages functions

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-pb-stream
```

- [Install](#install)
  - [npm](#npm)
- [Usage](#usage)
- [License](#license)

```sh
> npm install it-pb-stream
```

## Usage

```js
import { pbStream } from 'it-pb-stream'

const stream = pbStream(duplex)
stream.writeLP(buf)
stream.writePB(buf, def)
//.. etc
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
