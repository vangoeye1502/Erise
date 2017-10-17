/* global Module, Log, MM, config */

/* Magic Mirror
 * Module: MMM-AlexaPi
 *
 * By Dion Gonano
 * MIT Licensed.
 */

Module.register("MMM-AlexaPi", {

	requiresVersion: "2.0.0",

	// Default module config.
	defaults: {
			alexaTimeout: 20000,
			alexaHBTimeout: 10000
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		this.settingsVersion = 1;

		this.timeoutID = "";
		this.HBtimeoutID = "";

		this.avsStatus = "no_connection";

	},

	notificationReceived: function(notification, payload, sender) {
		if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
			if (notification === "ALEXAPI_ACTION") {
				this.sendSocketNotification(notification, payload);
			}
		} else {
			if (notification === "DOM_OBJECTS_CREATED") {
				//Started, send language
				this.sendSocketNotification("INIT", {lang: config.language});
			}
		}
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "AVSSTATUS") {
			//reset heartbeat
			this.resetHBTimer();

			//record message
			this.avsStatus = payload.status;

			//Clear and Set new timeout.
			var self = this;
			clearTimeout(this.timeoutID);
			this.timeoutID = setTimeout(function() {
				self.timeoutID = "";
				self.avsStatus = 'idle';
				self.updateDom(500);
			}, this.config.alexaTimeout);
			//Request update now timeoutID is set
			this.updateDom(500);
		}
		if (notification === "AVSHB") {
			this.resetHBTimer();
			if (this.avsStatus === "no_connection") {
				this.avsStatus = 'idle';
				this.updateDom(500);
			}
		}
	},

	resetHBTimer: function() {
		var self = this;
		clearTimeout(this.HBtimeoutID);
		this.HBtimeoutID = setTimeout(function() {
			//cancel other timers
			clearTimeout(self.timeoutID);
			//do action of HB timout
			self.HBtimeoutID = "";
			self.avsStatus = 'no_connection';
			self.updateDom(1000);
		}, this.config.alexaHBTimeout);
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "normal large light";


		var symbolWrapper =  document.createElement("span");
		symbolWrapper.className = "fa fa-stack";
		//Check status
		if (this.avsStatus == "idle") {
			var symbol = document.createElement("i");
			document.getElementById("main").style.border = "5px solid black";
			symbol.innerHTML = "say \"Alexa\" to start";
			symbolWrapper.appendChild(symbol);
		} else if (this.avsStatus === "recording") {
			// var symbol1 = document.createElement("i");
			var symbol2 = document.createElement("div");
			document.getElementById("main").style.border = "5px solid cyan";
			// symbol1.className = "fa fa-microphone fa-stack-1x";
			symbol2.innerHTML = "listening";
			// symbolWrapper.appendChild(symbol1);
			symbolWrapper.appendChild(symbol2);
		} else if (this.avsStatus === "processing") {
			var symbol = document.createElement("div");
			document.getElementById("main").style.border = "5px solid blue";
			symbol.innerHTML = "processing";
			symbolWrapper.appendChild(symbol);
		} else if (this.avsStatus === "playback") {
			var symbol = document.createElement("div");
			document.getElementById("main").style.border = "5px solid blue";
			symbol.innerHTML = "playback";
			symbolWrapper.appendChild(symbol);
		} else if (this.avsStatus === "error") {
			var symbol = document.createElement("div");
			document.getElementById("main").style.border = "5px solid red";
			symbol.innerHTML = "error";
			symbolWrapper.appendChild(symbol)
		} else if (this.avsStatus === "no_connection") {
			var symbol = document.createElement("div");
			document.getElementById("main").style.border = "5px solid orange";
			symbol.innerHTML = "connecting";
			symbolWrapper.appendChild(symbol);
		}
		wrapper.appendChild(symbolWrapper);

		return wrapper;
	},
});
