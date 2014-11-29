Meteor.publish("reports", function (limit, selector) {
	console.log(selector);
	return Reports.find(selector, {limit: limit, sort: {createDate: -1}});
});