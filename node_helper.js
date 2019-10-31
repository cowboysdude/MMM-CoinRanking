/* Magic Mirror
 * Module: MMM-Ticknews
 *
 *  Node helper built with NPM Modules and 
 *  Stack Exchange snippets 
 * 
 *
 * By Cowboysdude
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var request = require('request');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },

      getCOINS: function() {
        request({
            url: "https://api.coinranking.com/v1/public/coins?base=USD&timePeriod=7d",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var items = JSON.parse(body).data.coins;

				result = items.slice(0, this.config.topcoins);
				
                this.sendSocketNotification("COINS_RESULTS", result);
			}	
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_COINS') {
            this.getCOINS(payload);
        }
		if (notification === 'CONFIG') {
            this.config = payload;
        }
    }
});