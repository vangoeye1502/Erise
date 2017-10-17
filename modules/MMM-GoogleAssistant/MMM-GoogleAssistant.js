/* Magic Mirror
 * Module: MMM-GoogleAssistant
 *
 * By Gaurav
 *
 */

Module.register("MMM-GoogleAssistant", {
  // Module config defaults.
  defaults: {

    header: "Google Asistant",
    maxWidth: "100%",
    publishKey: 'pub-c-b7f324ac-e190-4bcf-ba5e-b860168f6f9b',
    subscribeKey: 'sub-c-f97a2b14-b03f-11e7-8d4b-66b981d3b880',
  },

  // Define start sequence.
  start: function() {
    Log.info('Starting module: Google Assistant Now');
    this.assistantActive = false;
    this.processing = false;
    this.userQuery = null;
    this.sendSocketNotification('INIT', 'handshake');
  },

  getDom: function() {
    Log.log('Updating DOM for GA');
    var wrapper = document.createElement("div");

    if (this.assistantActive == true) {
      if (this.processing == true) {
        wrapper.innerHTML = "<img src='MMM-GoogleAssistant/assistant_active.png'></img><br/>" + this.userQuery;
      } else {
        wrapper.innerHTML = "<img src='MMM-GoogleAssistant/assistant_active.png'></img>" + "waiting";
      }

    } else {
      wrapper.innerHTML = "<img src='https://cdn.dribbble.com/users/32512/screenshots/3227273/loader.gif' " +
          "width='400px' height='300px' class='AI'><br/>INACTIVE</img>";
    }
    return wrapper;
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification == 'ON_CONVERSATION_TURN_STARTED') {
      this.assistantActive = true;
    } else if (notification == 'ON_CONVERSATION_TURN_FINISHED') {
      this.assistantActive = false;
      this.processing = false;
    } else if (notification == 'ON_RECOGNIZING_SPEECH_FINISHED') {
      this.userQuery = payload;
      this.processing = true;
    }
    this.updateDom(500);
  },
});
