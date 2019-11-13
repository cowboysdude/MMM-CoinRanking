/* Magic Mirror
 * Module:  MMM-CoinRanking
 * By cowboysdude 
 *
 */ 
Module.register('MMM-CoinRanking', {

    // Module config defaults.
    defaults: {
        updateInterval: 60 * 60 * 1000,
        animationSpeed: 0,
        initialLoadDelay: 1500,
        topcoins: 10		
    }, 

    getStyles: function() { 
            return ["MMM-CoinRanking.css"]; 
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);		
        this.scheduleUpdate();
        this.coins = []; 
    }, 

    getDom: function() { 
	
	    var wrapper = document.createElement("div");
		 
		var header = document.createElement("header");
         header.classList.add("small", "bright", "header");
         header.innerHTML = "Crypto Values";
         wrapper.appendChild(header);
		 
        var tablewrapper = document.createElement("table");
		tablewrapper.style.width = "35%";
        var row = document.createElement("tr");		
	   
	    var rth = document.createElement("th");
		rth.classList.add("th");
		rth.innerHTML = "Rank";
		row.appendChild(rth);
		
		var iimage = document.createElement("th");
		iimage.classList.add("th");
		iimage.innerHTML = "Icon";
		row.appendChild(iimage);
		
		var nth = document.createElement("th");
		nth.classList.add("th");
		nth.innerHTML = "Coin";
		row.appendChild(nth);
		
		var vth = document.createElement("th");
		vth.classList.add("th");
		vth.innerHTML = "Value";
		row.appendChild(vth);
		
		var cth = document.createElement("th");
		cth.classList.add("th");
		cth.innerHTML = "Change";
		row.appendChild(cth);
		
		tablewrapper.appendChild(row);
	   
	   for (i = 0; i < this.coins.length; i++) {
        var coins = this.coins[i]; 
	    var num = parseFloat(coins.price).toFixed(2);  
      
		var brow = document.createElement("tr"); 
		
		var title  = document.createElement("td");
		title.classList.add("small","bright","td","text");  
		title.innerHTML = coins.rank;
		brow.appendChild(title);
		
		var cimage  = document.createElement("td");
		cimage.classList.add("image");
		cimage.innerHTML = "<img src="+coins.iconUrl+" width=45%>";
		brow.appendChild(cimage);
		
		var ntitle  = document.createElement("td");
		ntitle.classList.add("small","bright","td");  
		ntitle.innerHTML = coins.name;
		brow.appendChild(ntitle);
		
		var vtitle  = document.createElement("td");
		vtitle.classList.add("small","bright","td");
        vtitle.style.paddingLeft = "10px";		
		vtitle.innerHTML = num;
		brow.appendChild(vtitle);
		
		var ctitle  = document.createElement("td");
		ctitle.classList.add("small","bright","td");
		ctitle.style.paddingLeft = "10px"; 
		 if (Math.sign(coins.change) === -1 ) {
           ctitle.innerHTML =  "<font color=red>"+coins.change;  
          } else if (Math.sign(coins.change) === 1) {
           ctitle.innerHTML = "<font color=#9BFE13>+"+coins.change;
          } else {
           ctitle.innerHTML = "<font color=white>"+coins.change;
          }  
		brow.appendChild(ctitle);
		
		 tablewrapper.appendChild(brow); 
		 wrapper.appendChild(tablewrapper);
    }  
        return wrapper;
    }, 


    processCOINS: function(data) {
        this.today = data.Today;
        this.coins = data;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getCOINS();
        }, this.config.updateInterval);
        this.getCOINS(this.config.initialLoadDelay);
    },

    getCOINS: function() {
        this.sendSocketNotification('GET_COINS');
    }, 

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COINS_RESULTS") {
            this.processCOINS(payload);
        } 
        this.updateDom(this.initialLoadDelay);
    }

});