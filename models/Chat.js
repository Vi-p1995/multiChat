const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user:[Schema.Types.ObjectId],
  comments:[{user:Schema.Types.ObjectId,name:String,text:String,timeStamp:Date}]
});

module.exports = mongoose.model('Chat', ChatSchema);
