/* global Module, Log, MM, config */

/* Magic Mirror
 * Module: BuienRadar
 *
 * By Van Goeye Jannes
 * MIT Licensed.
 */

Module.register("BuienRadar",{

    // Default module config.
    defaults: {
        url: "http://api.buienradar.nl/image/1.0/radarmapbe?width=250",
        text: "Hello world!"
    },


    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        var link = document.createElement("a");
        link.setAttribute("href","http://www.buienradar.be")
        var image = document.createElement("IMG");
        image.src = this.config.url;
        image.className = "grayscale";
        image.style.borderRadius = "30px" ;
        image.setAttribute("border", "0");
        link.appendChild(image);
        wrapper.appendChild(link);
        return wrapper;

    }
});