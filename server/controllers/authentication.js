const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');
var nodemailer = require('nodemailer');
var async = require("async");
var gravatar = require("gravatar");
// create reusable transporter object using the default SMTP transport
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'joininspecker@gmail.com',
        pass: 'speckers'
    }
};
var transporter = nodemailer.createTransport(smtpConfig);
// setup e-mail data with unicode symbols



function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


exports.isEmailExisted = function(req, res, next){
    User.findOne({ "public.email": req.body.email }, function(err, existingUser){
        if(err){
            res.send({error:"서버 에러"})
        }
        if(existingUser){
            res.send({error:"이미 사용중인 이메일입니다."})
        }
        else{
            res.send({result:"ok"});
        }
    });
};

exports.signin = function(req, res, next){
    User.findOne({ "public.email": req.body.email }, function(err, existingUser){
        if(existingUser.private.isValid=="invalid"){
            res.send({userStatus:"SIGN_UP_INCOMPLETE_USER"});
        }
        else if(existingUser.public.goal.length<3){
            res.send({token: tokenForUser(existingUser), userStatus:"TAG_INCOMPLETE_USER"})
        }
        else{
            res.send({token: tokenForUser(existingUser), userStatus:"AUTH_USER" });

        }
        console.log("signin");


    });

};

exports.signup = function(req, res, next){

    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;
    const sex = req.body.sex;
    const name = req.body.name;


    User.findOne({ "public.email": email }, function(err, existingUser){
        if(err){
            return next(err);
        }

        if(existingUser){
            return res.status(422).send({ error: 'Email is in use' });
        }

        var getGravatar = gravatar.url(email, {
            s: 80,
            d: 'retro'
        });

        const user = new User();
        user.public.email = email;
        user.public.age = age;
        user.public.sex = sex;
        user.public.name = name;
        user.public.address.placeId = req.body.address.placeId;
        user.public.address.label = req.body.address.label;
        user.public.address.location.lat = req.body.address.lat;
        user.public.address.location.lng = req.body.address.lng;
        user.private.password = password;
        user.public.gravatar = 'http:'+getGravatar;
        user.save(function(err){
            if(err){
                return next(err);
            }
            res.json({ email:email, name:name, userStatus:"SIGN_UP_INCOMPLETE_USER" });
            var mailOptions = {
                from: 'specker korea <joininspecker@gmail.com>',
                to: email,
                subject: 'specker 회원가입 확인 메일입니다.',
                // text: name+'님의 회원가입을 축하합니다. 귀하의 건승을 기원합니다. ',
                html:'<h1>'+name+"님의 회원가입을 축하합니다. 룹과 귀하의 건승을 기원합니다."+tokenForUser(user)+' </h1><p>인증 하실려면 <a href="http://127.0.0.1:8080/signUpConfirm?token='+tokenForUser(user)+'">여기</a>를 클릭하세요.</p>'
            };


            transporter.sendMail(mailOptions, function(error, response){

                if (error){
                    console.log(error);
                } else {
                    console.log("Message sent : " + response.message);
                }
                transporter.close();
            });


        })

    });

};

exports.signUpConfirm = function(req, res, next){
    User.findOneAndUpdate({ "public.email": req.user.public.email }, {"private.isValid":"valid"}, { new: true }, function(err, user){
        if(err){
            return next(err);
        }
        res.json({ token:tokenForUser(user), userStatus:"TAG_INCOMPLETE_USER" });
    });

};
// sign up 다음에 수행 된다고 가정, req.user에 해당 유저의 정보가 들어있다.
