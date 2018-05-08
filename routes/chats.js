var express = require('express');
var router = express.Router();
var Chat = require('../models/Chat');
var User = require('../models/User');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var secret = 'xxx';

var auth = function(req, res, next) {
    if (req.query.token === undefined) return res.status(401).json({message:'Unothorized'})
    var id = jwt.decode(req.query.token, secret);
    User.findById(id, function(err, user) {
        if (err) return res.status(500).json({message: err});
        req.user = user;
        next();
    })
}
router.post('/', auth,function(req, res,next) {
  body={user:req.user._id,comments:[]}
  newChat= new Chat(body);
  newChat.save(function(err,chat){
    if (err) return res.status(500).json({message: err});
    res.json(chat)
  })
})

router.get('/', auth,function(req, res) {
  Chat.find()
  .exec(function(err,chats){
    if (err) return res.status(500).json({error:err})
    if(!chats) return res.status(404).json({massage:"no chats not fount"})
    array=[]
    for(var i in chats){
      if(chats[i].user.toString().includes(req.user._id)) array.push(chats[i]._id)
    }
    if(!array) {res.json({message:"user not have a chats"})} else {return res.send(array)}
  })
})

router.get('/:id', auth,function(req, res) {
  Chat.findOne({_id:req.params.id})
  .exec(function(err,chat){
    if (err) return res.status(500).json({error:err})
    if(!chat) return res.status(404).json({massage:"chat not fount"})
    if(chat.user.toString().includes(req.user._id)) res.json(chat)
    else res.json({message:"user is not included in this chat"})
  })
})

router.put('/:id/addUser', auth,function(req, res) {
  Chat.findById(req.params.id, function (err, chat) {
  if (err) return res.status(500).json({error:err});
  if (!chat) return res.status(404).json({message:"chat not found"});
  if(chat.user.toString().includes(req.user._id)===false) return res.status(400).json({message:"are you not in this chat; you can not add a people"})
  if(req.query.user){
    if(chat.user.toString().includes(req.query.user)) return res.json({message:"user already exists"})
    else chat.user.push(req.query.user)
  }else return res.status(400).json({message:"no user defined on query"})
  chat.save(function (err, updatedChat) {
    if (err) return res.status(500).json({error:err});
    res.json(updatedChat);
  });
});
})

router.put('/:id/sendMessage', auth,function(req, res) {
  Chat.findById(req.params.id, function (err, chat) {
  if (err) return res.status(500).json({error:err});
  if (!chat) return res.status(404).json({message:"chat not found"});
  if(chat.user.toString().includes(req.user._id)){
    chat.comments.push({user:req.user._id,name:req.user.name,text:req.body.text,timeStamp:new Date()})
    chat.save(function (err, updatedChat) {
      if (err) return res.status(500).json({error:err});
      res.json(updatedChat);
    });
  }
  else res.json({message:"user is not included in this chat"})
})
});

router.delete('/:id', auth,function(req, res, next) {

})

module.exports = router;
