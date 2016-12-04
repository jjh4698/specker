const jwt = require('jwt-simple');
const config = require('../config');
var mongoose = require('mongoose');
var async = require("async");
const Parser = require('../util/parser');
const Feed = require('../models/feed');
const Spec = require('../models/spec');
const User = require('../models/user');


/*
 ref:http://bcho.tistory.com/1083
 waterfall : 각자의 흐름이 의존성이 있을때 순차적으로 실행.
 series : 각자의 흐름이 의존성이 없을때 순차적으로 실행.
 parallel : 각자의 흐름이 의존성도 없으며, 순차적으로 실행될 필요도 없을때.
 */


/*
 import 명령어: mongoimport —db specker —collection specs —file init_spec.json
 export 명령어: mongoexport -d specker -c specs -o init_spec.json
 */




exports.saveFeed = function(req, res, next){

    async.waterfall([
            function(callback){
                var $html =req.body.html;
                Parser.parser($html[0].children, req.user._id, function(result){
                    callback(null, result);
                });

            }
        ],
        function(err, result){
            const feed = new Feed();
            feed.user = req.user._id;
            feed.content = result.content;

            for(var i=0; i<result.mention.length; i++){
                feed.mention.push(mongoose.Types.ObjectId(result.mention[i]));
            }
            for(var i=0; i<result.tag.length; i++){
                feed.tag.push(mongoose.Types.ObjectId(result.tag[i]));
            }

            feed.save(function (err) {
                if(err)
                    return err;
                res.json({result:"ok"})

            });
            if(err) {
                throw err;
            }
            // return res.status(200).send({ userInfo: user.public, token: tokenForUser(user), userStatus:"AUTH_USER" });

        });


};

exports.getHomeFeed = function(req, res, next){
    console.log(req.body);
    var query=Date.now();

    if(req.body.nextIndex!=""){
        query = new Date(req.body.nextIndex).toISOString();
    }


    Feed.find({date: {$lt: query}}).sort({date:-1}).limit(5).exec(function(err, data){
        if(err)
            throw err;
        var nextIndex = data.length==0?false:data[data.length-1].date;
        res.send({data, nextIndex })
    })


};

exports.getSpec = function(req, res, next){
    var data=[];
    var query='';
    if(req.body.keyword){
        query=req.body.keyword;
    }
    Spec.find({name : {$regex : query}, depth:"C"}).sort({"name":-1}).limit(5).exec(function(err, datas){

        for(var i=0; i<datas.length; i++){
            data.push({"id":i,"name":datas[i].name, "like":datas[i].like, "_id":datas[i]._id});
        }

        res.send(data);
    });
}