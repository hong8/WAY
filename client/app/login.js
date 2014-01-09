Meteor.login = function( id, callback ) {
    //create a login request with admin: true, so our loginHandler can handle this request
    var loginRequest = { id : id };

    //send the login request
    Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: callback
    });
};