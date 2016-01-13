/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        'ember-cli-tooltipster': {
            importTooltipsterPunk: true
        }
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    // Bootstrap
    app.import(app.bowerDirectory + "/bootstrap/dist/css/bootstrap.min.css");
    app.import(app.bowerDirectory + "/bootstrap/dist/js/bootstrap.min.js");
    app.import(app.bowerDirectory + "/bootstrap/dist/fonts/glyphicons-halflings-regular.eot", {
        destDir: "fonts"
    });
    app.import(app.bowerDirectory + "/bootstrap/dist/fonts/glyphicons-halflings-regular.svg", {
        destDir: "fonts"
    });
    app.import(app.bowerDirectory + "/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf", {
        destDir: "fonts"
    });
    app.import(app.bowerDirectory + "/bootstrap/dist/fonts/glyphicons-halflings-regular.woff", {
        destDir: "fonts"
    });
    app.import(app.bowerDirectory + "/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2", {
        destDir: "fonts"
    });
    //Isotope
    app.import(app.bowerDirectory + "/isotope/dist/isotope.pkgd.min.js");
    app.import(app.bowerDirectory + "/isotope-fit-columns/fit-columns.js");
    //Non-bower dependencies
    app.import("vendor/prefixfree/prefixfree.min.js");
    app.import('vendor/jparallax/jquery.parallax.css');
    app.import('vendor/jparallax/jquery.parallax.js');

    return app.toTree();
};