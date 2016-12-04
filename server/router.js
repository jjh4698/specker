const Authentication = require('./controllers/authentication');
const Classification = require('./controllers/classification');
const Feed = require('./controllers/feed');
const Recommand = require('./controllers/recommand');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app, io) {
    // io.on('connection', function(socket){
    //     console.log('a user connected');
    //     socket.on('sang', function(msg){
    //         console.log('message: ' + msg);
    //         socket.emit('hyun', 'sang')
    //     });
    // });
    app.get('/', requireAuth, function(req, res) {
        res.send({ message: 'Super secret code is ABC123' });
    });

    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
    app.post('/signUpConfirm', requireAuth, Authentication.signUpConfirm);
    app.post('/isEmailExisted', Authentication.isEmailExisted );
    app.post('/getClassification', requireAuth, Classification.getClassification);
    app.post('/recommandTeam',requireAuth,Recommand.findTeam);
    app.post('/recommandFoster',requireAuth,Recommand.find_Foster);
    app.post('/saveClassification', requireAuth, Classification.saveClassification);
    app.post('/saveFeed',requireAuth, Feed.saveFeed);
    app.post('/isEmailExisted',Authentication.isEmailExisted);

    app.post('/getHomeFeed', requireAuth, Feed.getHomeFeed);

    app.post('/getSpec', requireAuth, Feed.getSpec);



};
