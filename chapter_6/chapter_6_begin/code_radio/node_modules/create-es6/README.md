# npm init es6

To initialise a free and open ESM project (`"type"="module"`) in Node.js, simply issue the following command:

```shell
npm init es6
```

I made this as an alternative to `npm init -y` (which produces a _package.json_ file for a CommonJS project by default) because I was sick of (forgetting to) add the type declaration into the package file manually every time.

This is the _package.json_ file it creates:

```json
{
  "name": "",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "license": "AGPL-version-3.0",
  "private": false,
  "engines": {
    "node": ">= 14.0.0",
    "npm": ">= 6.0.0"
  },
  "homepage": "",
  "repository": {
    "type": "git",
    "url": ""
  },
  "bugs": "",
  "keywords": [],
  "author": {
    "name": "",
    "email": "",
    "url": ""
  },
  "contributors": [

  ],
  "scripts": {
    "dev": "",
    "test": ""
  },
  "dependencies": {

  },
  "devDependencies": {

  }
}
```

## Like this? Fund us!

[Small Technology Foundation](https://small-tech.org) is a tiny, independent not-for-profit.

We exist in part thanks to patronage by people like you. If you share [our vision](https://small-tech.org/about/#small-technology) and want to support our work, please [become a patron or donate to us](https://small-tech.org/fund-us) today and help us continue to exist.

## Copyright

Copyright &copy; 2021-present [Aral Balkan](https://ar.al), [Small Technology Foundation](https://small-tech.org).

## License

[ISC](./LICENSE)
