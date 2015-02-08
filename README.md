angular-boilerplate
===

An boilerplate for AngularJS projects.

## Install node

[Node](http://nodejs.org/)

## After installing node, install Gulp globally

	npm install gulp -g

## Install all the dependencies

	npm install

## Download the libraries needed.

	bower install

## `gulpfile.js`

[Nyan](https://github.com/gonzalovazquez/nyan) is the gulpfile included with this boilerplate.
For more information you can visit the repository or bring up the help.

    gulp help

```
Usage
  gulp [task]

Available tasks
  bower_components  Copies bower_components to public
  build             Builds projects for distribution
  build-html        Dynamically injects javascript and css files
  clean             Deletes existing public directory
  css               Compliles sass to css
  default           Builds project
  e2e               Runs end to end tests
  help              Display this help text.
  lint              Lints javascript
  minify-img        Minifies images
  minify-js         Minifies all javascript
  templates         Copies templates to public
  test              Runs unit tests
  test-watch        Unit tests with watch
  views             Copies views to public
  watch             Watches and builds for changes
  webserver         Launches web server
```

###Folder structure

```
src/
├── images/
│ 
├── scripts/
│   ├── app.js
│   └── vendor/
│       └─google-analytics.js
├── styles/
│   └── main.scss
│
├── index.html
│
└── test/
    └── unit/
        └── app.spec.js

```

After running ``` gulp build ``` public folder is created and Nyan injects
all the scripts and styles into the new index.html

```
public/
├── images/
│
├── bower_components/
│ 
├── views/
│ 
├── templates/
│ 
├── javascript/
│   └── all.[version-number].min.js
│ 
├── css/
│   └── main.[version-number].min.css
│
└── index.html
```