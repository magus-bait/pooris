Meteor.methods({
	insertReport: function (report) {
		var doc = _.extend(report, {
			createDate: new Date()
		});
		Reports.insert(doc, function() {
			console.log('report inserted');
		});
	}
});