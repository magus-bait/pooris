Router.configure({
	trackPageView: true
});

Router.route('/', function () {
	this.render('pooris');
});