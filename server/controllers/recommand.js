const User = require('../models/user');
const Feed = require('../models/feed');
const Team = require('../models/team');
var mongoose = require('mongoose');
const config = require('../config');

/*
팀 기반 추천,1
팀의 goal과 접속 유저의 goal을 비교해서 리스트에있는
 */

exports.findTeam = function(req,res,next){
    var data = [];
    function like_sort(a,b) {
        if(a.popular.like.length>b.popular.like.length)
            return 1;
        else if(a.popular.like.length<b.popular.like.length)
            return -1;
        return a.popular.unlike.length < b.popular.unlike.length;
    }

    console.log("recommand1");

    Team.find( { "goal" : {"$in":req.user.public.goal}}, function(err, datas){
        if(err) {
            return next(err);
        }
        // for(var i =0; i<datas.length; i++){
        //     data.push({"index" : i, "_id" : datas[i]._id, });  // 팀 정보 전체를 넘긴다.
        // }
        console.log(datas);
        datas.sort(like_sort);
        console.log("recommand2");
        res.send(datas);
    });
}

exports.find_Foster = function(req,res,next){
    var data=[];
    console.log("foster");

    function like_sort(a,b) {
        // if(a.popular==null || b.popular ==null)
        //     return 0;
        if(a.popular.like.length>b.popular.like.length)
            return -1;
        else if(a.popular.like.length<b.popular.like.length)
            return 1;
        return a.popular.unlike.length < b.popular.unlike.length;
        // return a.popular.unlike.length < b.popular.unlike.length;
    }

    Feed.find({"tag" : {"$in":req.user.public.goal}},function (err,datas) {
        if(err) {
            return next(err);
        }
        // for(var i =0; i<datas.length; i++){
        //     data.push({"index" : i, "_id" : datas[i]._id, "user" : datas[i].user,
        //         "view" : datas[i].view, "date" : datas[i].date, "mention" : datas[i].mention,
        //         "content" : datas[i].content, "comment" : datas[i].comment, "tag" : datas[i].tag
        //     });  // 피드 정보 전체를 넘긴다.
        // }
        datas.sort(like_sort);
        res.send(datas);

    });
}










