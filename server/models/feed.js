var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedSchema= new Schema({
    user:{type:Schema.ObjectId},
    popular: {
        like: [{
            who:{type:Schema.ObjectId},
            date:{type:Date, default:Date.now}
        }],
        unlike: [{
            who:{type:Schema.ObjectId},
            date:{type:Date, default:Date.now}
        }],
        block:[{
            who:{type:Schema.ObjectId},
            date:{type:Date, default:Date.now}
        }],
    },
    view:[{type:Schema.ObjectId}],

    date:{type:Date, default:Date.now},
    tag:[{type:Schema.ObjectId}],
    mention:[{type:Schema.ObjectId}],
    content:String,
    comment:[{type:Schema.ObjectId}]
});


const ModelClass = mongoose.model('feed', feedSchema);
module.exports = ModelClass;
