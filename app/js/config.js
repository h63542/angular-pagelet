/**
 * Created with JetBrains WebStorm.
 * Author: Devin Chen
 * Date: 7/20/12
 * Time: 9:36 AM
 * To change this template use File | Settings | File Templates.
 */

seajs.config({
    alias : {
        'base' : '/app/js/',
        'jquery' : './lib/jquery/jquery-1.7.2.min',
        'angular' : './lib/angular/angular',
        'jquery-plug' : './lib/jquery/plugs',
        'sea-plug' : './lib/seajs/plugs'
    },
    preload : ['jquery','angular'],
    charset : "utf-8",
    debug : true
});