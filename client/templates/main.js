var defaultLabel = 'Viimased teated';
Session.set('filter', {});
Session.set('charCount', 200);
Session.set('filterLabel', defaultLabel);
Session.set('mood', 'up');

Template.reports.helpers({
	reports: function () {
		return Reports.find(Session.get('filter'), {sort: {createDate: -1}});
	},
	time: function () {
		return moment(this.createDate).format('D.M.YYYY H:mm:ss');
	},
	filterLabel: function () {
		return Session.get('filterLabel');
	},
	filterActive: function () {
		return Session.get('filterLabel') !== defaultLabel;
	},
	moodClass: function () {
		return this.mood == 'up' ? 'panel-success' : 'panel-danger';
	}
});

Template.reports.created = function () {
	Tracker.autorun(function () {
		Meteor.subscribe('reports', 20, Session.get('filter'), function () {
			console.log('subscription finished');
		});
	});
};

Template.addReport.helpers({
	error: function (field) {
		return Session.get('error-' + field) ? 'has-error' : undefined;
	},
	charCount: function () {
		return Session.get('charCount');
	},
	active: function (state) {
		return Session.get('mood') == state ? 'active' : undefined;
	},
	addType: function () {
		return Session.get('mood') == 'up' ? 'btn-success' : 'btn-danger';
	}
});

Template.reports.events({
	'click #resetFilter': function(e, t) {
		e.preventDefault();
		Session.set('filter', {});
		Session.set('filterLabel', defaultLabel);
	}
});

Template.addReport.events({
	'click #up': function (e, t) {
		Session.set('mood', 'up');
	},
	'click #down': function (e, t) {
		Session.set('mood', 'down');
	},
	'click #searchReports': function (e, t) {
		e.preventDefault();
		var regNo = $(t.find("input[name=regNo]")).val();
		if (!regNo) {
			Session.set('filter', {});
			Session.set('filterLabel', defaultLabel);
		}
		else {
			Session.set('filter', {regNo: regNo});
			Session.set('filterLabel', 'Otsing: ' + regNo);
		}
	},
	'keyup, change textarea': function(e, t) {
		var comment = $(t.find("textarea[name=comment]")).val();
		var count = 200 - (comment ? comment.length : 0);
		Session.set('charCount', count);
		if (count < 0) {
			Session.set('error-comment', true);
		}
		else {
			Session.set('error-comment', false);
		}
	},
	'submit #reportForm': function (e, t) {
		console.log('submitting');
		e.preventDefault();
		var regNo = $(t.find("input[name=regNo]")).val();
		var comment = $(t.find("textarea[name=comment]")).val();
		Session.set('error-regNo', false);
		Session.set('error-comment', false);
		var valid = true;
		if (!regNo) {
			Session.set('error-regNo', true);
			valid = false;
		}
		if (!comment) {
			Session.set('error-comment', true);
			valid = false;
		}

		if (valid) {
			Meteor.call('insertReport', {
				regNo: regNo,
				comment: comment,
				mood: Session.get('mood')
			}, function() {
				console.log('inserted');
				$(t.find("form"))[0].reset();
				Session.set('charCount', 200);
			});
		}
	}
});