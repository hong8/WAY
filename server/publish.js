Promises = new Meteor.Collection("promises");
Meteor.publish('promises', function () {
  return Promises.find();
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

