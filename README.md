# http concat

A express middleware for concatenating files in a given context: CSS and JS files usually

[![NPM version](https://badge.fury.io/js/http-concat.svg)](http://badge.fury.io/js/http-concat)

## Installation

```
npm install http-concat --save
```
    
## Server Side 

```
var express = require('express');
var httpConcat = require('http-concat');

var app = express();

app.use(httpConcat({
    base: path.join(__dirname, 'public', 'static'),
    path: '/'
}));
```
    
## Client Side

```
http://example.com/??script1.js,script2.js,build/script.js
http://example.com/??script1.js,script2.js,build/script.js?v=2016
http://example.com/??style1.css,style2.css,build/style.css
http://example.com/??style1.css,style2.css,build/style.css?v=2016
```
