module.exports = {

    'facebookAuth' : {
        'clientID'      : '419352488499636', //App ID
        'clientSecret'  : 'a4212a72224dd2b1a4fb55a9bc0aa849', // App Secret
        'callbackURL'   : 'https://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },



};
