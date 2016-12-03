const User = require('../models/user');
var mongoose = require('mongoose');
const config = require('../config');

/*
팀 기반 추천,1
팀의 goal과 접속 유저의 goal을 비교해서 리스트에있는
 */

exports.recommand = function(req,res,next){
    var data = [];
    function like_sort(a,b) {
        if(a.popular.like>b.popular.like)
            return 1;
        else if(a.popular.like<b.popular.like)
            return -1;
        return a.popular.dislike < b.popular.dislike;
    }

    console.log("recommand1");

    User.find( { "public.goal" : req.user.public.teams.goal}, function(err, datas){
        if(err) {
            return next(err);
        }
        for(var i =0; i<datas.length; i++){
            data.push({"index" : i, "_id" : datas[i]._id, });  // 팀 정보 전체를 넘긴다.
        }
        data.sort(like_sort);
        console.log("recommand2");
        res.send(data);
    });
}










