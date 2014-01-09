Accounts.registerLoginHandler(function(loginRequest) {

    //we create a user if not exists, and get the userId
    var user = WayUsers.findOne( { id : loginRequest['id'] } );
    if(!user) {
        //userId = Meteor.users.insert({username: '821067351365'});
        return null;
    } else {
        return user;
    }
});