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
        'jquery' : '/app/lib/jquery/jquery-1.7.2.min',
        'jquery-plug' : '/app/lib/jquery/plugs',
        'sea-plug' : '/app/lib/seajs/plugs'
    },
    preload : ['jquery'],
    charset : "utf-8",
    debug : true
});