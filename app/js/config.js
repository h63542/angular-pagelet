/**
 * Created with JetBrains WebStorm.
 * Author: Devin Chen
 * Date: 7/20/12
 * Time: 9:36 AM
 * To change this template use File | Settings | File Templates.
 */

seajs.config({
    alias : {
        'base' : '/app/',
        'underscore' : '/app/lib/underscore-min',
        'angular-ui':'/app/lib/angular-ui/angular-ui',
        'jquery-plug' : '/app/lib/jquery/plugs',
        'sea-plug' : '/app/lib/seajs/plugs'
    },
    preload : ['underscore','angular-ui'],
    charset : "utf-8",
    debug : true
});