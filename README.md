# Morejobs

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.3.

## Website: web

```
ng generate component components/test --project=web
ng build --prod --project=web
npm run dev:ssr --project=web
ng serve --project=web
http://localhost:4200
```

## Mobile app: mobile

```
ng generate component components/test --project=mobile
ng build --prod --project=mobile
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Localization
`ng extract-i18n --output-path projects/common/locale`

`ng serve --project=web --configuration=bn`

`ng build --configuration=production,bn`
