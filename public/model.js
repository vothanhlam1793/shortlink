var Short = Backbone.Model.extend({
    urlRoot: '/shorts',
    idAttribute: "_id"
});

var Log = Backbone.Model.extend({
    urlRoot: "/logs",
    idAttribute: "_id"
})