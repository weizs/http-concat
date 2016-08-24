# http concat
A express middleware for concatenating files in a given context: CSS and JS files usually

##Installation
    npm install express-http-concat --save
    
    app.use(httpConcat({
        base: path.join(__dirname, 'public', 'static'),
        path: '/'
    }));
    
##Use
    http://example.com/??script1.js,script2.js,build/script.js
    http://example.com/??script1.js,script2.js,build/script.js?v=2016
    http://example.com/??style1.css,style2.css,build/style.css
    http://example.com/??style1.css,style2.css,build/style.css?v=2016

