Meteor.publish("reports", function (limit, selector) {
	return Reports.find(selector, {limit: limit, sort: {createDate: -1}});
});