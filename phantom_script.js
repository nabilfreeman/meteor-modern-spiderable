// 'url' is assigned to in a statement before this.
var page = require('webpage').create();

var isReady = function () {
  return page.evaluate(function () {
    if (typeof Meteor === 'undefined'
        || Meteor.status === undefined
        || !Meteor.status().connected) {
      return false;
    }
    if (typeof Package === 'undefined'
        || Package["jazeee:spiderable-longer-timeout"] === undefined
        || Package["jazeee:spiderable-longer-timeout"].Spiderable === undefined
        || !Package["jazeee:spiderable-longer-timeout"].Spiderable._initialSubscriptionsStarted ) {
      return false;
    }
	if( !(Meteor.isRouteComplete || Meteor.isReadyForSpiderable ) ) {
		// We only need one of these flags set in order to proceed. I may deprecate Meteor.isRouteComplete
		return false;
	}
    if (typeof Tracker === 'undefined' || typeof DDP === 'undefined'){
        return false;
    }
    Tracker.flush();
    return DDP._allSubscriptionsReady();
  });
};

var dumpPageContent = function () {
  var out = page.content;
  out = out.replace(/<script[^>]+>(.|\n|\r)*?<\/script\s*>/ig, '');
  out = out.replace('<meta name="fragment" content="!">', '');
  console.log(out);
};

page.open(url, function(status) {
  if (status === 'fail')
    phantom.exit();
});

setInterval(function() {
  if (isReady()) {
    dumpPageContent();
    phantom.exit();
  }
}, 100);
