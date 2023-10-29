// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  api_url: 'http://localhost:7300/api',
  files_url: 'http://localhost:7300/Library-files/',
  FileSize:8388608,
  production: false,
  appContext : '',
  recaptcha: {
    siteKey: '6Lczn_cdAAAAAKp6niX8xoCQpkqmQy4swPK1--SZ',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
