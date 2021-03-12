# ng2-hallelujah

Hallelujah! This Angular module offers a [HAL/JSON](http://stateless.co/hal_specification.html) http-client to easily
interact with a [Spring Data Rest](https://projects.spring.io/spring-data-rest) API (and by extend any API that
conforms the Spring Data Rest resource model).

## Installation

Add the following to our `package.json`:

```
  "ng2-hallelujah": "https://github.com/pinksummit/HALlelujah/releases/download/0.4.1/ng2-hallelujah-0.4.1.tgz",
```

Using the release numbers for the desired build.

## Releasing a new version

1. Update the `package.json`'s `version` field to the new release number.
1. `npm i` to sync that number to `package-lock.json`.
1. Commit your changes.
1. `git tag <version>` using the new release number.
1. `npm run build:release`
1. Rename the file to include your new release number:
   - `mv ng2-hallelujah-0.m.p.tgz ng2-hallelujah-0.4.1.tgz`
1. Create a new release [here](https://github.com/pinksummit/HALlelujah/releases/new)
   1. The release title should be the `<version>-pinksummit`
   1. ✅ the pre-release box
   1. Upload the `.tgz` file
   1. Publish release! 🚀
