const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


exports.signin = function(req, res, next){
    console.log("check1",req.body);
    User.findOne({ "public.email": req.body.email }, function(err, existingUser){
        if(existingUser.public.goal.length<3){
            res.send({token:tokenForUser(req.user), userStatus:"TAG_INCOMPLETE_USER"})
        }
        else{
            res.send({token: tokenForUser(req.user), userStatus:"AUTH_USER" });
        }
    });

};

exports.signup = function(req, res, next){

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(422).send({error: 'Email or password please!'});
    }
    User.findOne({ "public.email": email }, function(err, existingUser){
        if(err){
            return next(err);
        }

        if(existingUser){
            console.log("이미 존재하는 유저입니다.");
            return res.status(422).send({ error: 'Email is in use' });
        }

        const user = new User();
        user.public.email = email;
        user.private.password = password;

        user.save(function(err){
            if(err){
                return next(err);
            }

            res.json({ token: tokenForUser(user), userStatus:"TAG_INCOMPLETE_USER" });

        })

    });

};