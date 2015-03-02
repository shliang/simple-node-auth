define(['backbone'], function(Backbone) {
	var Router = Backbone.Router.extend({
		routes: {
			"": "homepage"
		},
		
		homepage: function() {
			console.log("home page");
		},
		
		_swapView: function(view) {
			this._currentView && this._currentView.remove();
			this._currentView = view;
			$('.content').html(view.render().$el);
		}
	});
	
	return Router;
});