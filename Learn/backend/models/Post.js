const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true,'Title is required'],
        trim: true,
        minLength:[50,'Limit Exceeded ']

},
    content: {
        type: String,
        required: [true,'Content is required'],
        trim: true,
        minLength:[50,'Limit Exceeded ']
    },  
    author:{
        type: String,
        trim: true,
        required: true
    },
    
    tags:{
        type:Array,
        default:[]  
}

},{timestamps:true }
)
const Post = mongoose.model('Post',postSchema);

module.exports = Post
