WayUsers = new Meteor.Collection("wayusers");
Meteor.publish('wayusers', function () {
    return WayUsers.find({});
});

MyPromises = new Meteor.Collection("mypromises");
Meteor.publish('mypromises', function () {
    return MyPromises.find({});
});

Promises = new Meteor.Collection("promises");
Meteor.publish('promises', function () {
    return Promises.find({});
});

Questions = new Meteor.Collection("questions");
Meteor.publish('questions', function () {
  return Questions.find({});
});

Chats = new Meteor.Collection("chats");
Meteor.publish('chats', function () {
    return Chats.find({});
});

Votes = new Meteor.Collection("votes");
Meteor.publish('votes', function () {
    return Votes.find({});
});

Credits = new Meteor.Collection("credits");
Meteor.publish('credits', function () {
    return Credits.find({});
});

WayFliesFS = new CollectionFS('wayfiles', { autopublish: false });
//WayFliesFS.allow({
//    insert: function(userId, myFile) { return userId && myFile.owner === userId; },
//    update: function(userId, files, fields, modifier) {
//        return _.all(files, function (myFile) {
//            return (userId == myFile.owner);
//
//        });  //EO iterate through files
//    },
//    remove: function(userId, files) { return false; }
//});
//WayFliesFS.filter({
//    allow: {
//        contentTypes: ['image/*']
//    }
//});

WayFliesFS.fileHandlers({
    default1: function(options) { // Options contains blob and fileRecord — same is expected in return if should be saved on filesytem, can be modified
        return { blob: options.blob, fileRecord: options.fileRecord }; // if no blob then save result in fileHandle (added createdAt)
    }});
Meteor.publish('wayfiles', function() {
//    if ( sharedService.user['id'] ) {
//        return WayFiles.find({ owner: sharedService.user['id'] }, { limit: 30 });
//    }
    return WayFliesFS.find({});
});