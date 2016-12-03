
const jwt = require('jwt-simple');
const config = require('../config');
var mongoose = require('mongoose');
var async = require("async");
/*
 ref:http://bcho.tistory.com/1083
 waterfall : 각자의 흐름이 의존성이 있을때 순차적으로 실행.
 series : 각자의 흐름이 의존성이 없을때 순차적으로 실행.
 parallel : 각자의 흐름이 의존성도 없으며, 순차적으로 실행될 필요도 없을때.
 */

const User = require('../models/user');
const Spec = require('../models/spec');


function tokenForUser(user) {
    const timestamp = new Date().getTime();
    console.log(user.id);
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
/*
 import 명령어: mongoimport --db specker --collection specs --file init_spec.json
 export 명령어: mongoexport -d specker -c specs -o init_spec.json
 */



exports.getClassification = function(req, res, next){

    var data=[];
    var query='';
    if(req.body.keyword){
        query=req.body.keyword;
    }
    Spec.find({name : {$regex : query}, depth:"C"},function(err, datas){

        for(var i=0; i<datas.length; i++){
            data.push({"id":i,"name":datas[i].name});
        }

        res.send(data);
    });

    // db.terms.findOne({term : {$regex : "지수적"}})
};


exports.saveClassification = function(req, res, next){
    var token = req.body.token;
    var decoded = jwt.decode(token, config.secret);

    var objectId = mongoose.Types.ObjectId(decoded.sub);

    async.waterfall([
            function(callback){
                User.findOne({ _id: objectId }, function(err, existingUser){
                    if(err)
                        throw err;
                    callback(null,existingUser );
                })
            },
            function(user,callback){
                Spec.find({ name: { "$in" : req.body.tag}, depth:"C" }, function (err, specs) {
                        specs.forEach(function(value){
                            if (user.public.goal.indexOf(value._id)==-1)
                                user.public.goal.push(value._id);
                        });
                    callback(null, user);
                });
            },
            function(user,callback){
                User.findOneAndUpdate({_id:user._id}, user, {upsert:true}, function(err, result){
                    if (err)
                        throw err;
                    callback(null, result);
                });

            }
        ],
        function(err, user){
            if(err) {
                throw err;
            }
            return res.status(200).send({ userInfo: user.public, token: tokenForUser(user), userStatus:"AUTH_USER" });

        }
    );


};