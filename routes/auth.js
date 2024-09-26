const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

authRouter.post('/api/signup', async(req,res)=>{
          try {
                    const {name, email, password} = req.body;

         const existingUser = await User.findOne({ email });
         if(existingUser){
          return res.status(400).json({msg : "email already exists"});
         }
     const hashPassword = await bcryptjs.hash(password,8);

        let user = new User({
          name,
          email,
          password:hashPassword
         })
         user = await user.save();
         res.json(user);

          }catch(e){
                    res.status(500).json({err : e.message});
          }
          
          //post that data in database
          //return that data to the user

});

authRouter.post('/api/signin',async(req,res)=>{
  try{
    const {email, password} = req.body;
    const user =await User.findOne({email: email});
    if(!user){
      return res.status(400).json({msg : "User not found check your email."});
    }
  const isMatch = await bcryptjs.compare(password, user.password);
  if(!isMatch){
    return res.status(400).json({msg : "Invalid password."});
  }
 const token = jwt.sign({id: user._id}, "passwordKey",);
 res.json({token, ...user._doc});
  }catch(e){
    res.status(500).json({err : e.message});
  }
});

authRouter.post('/api/profile/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, 'passwordKey');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      address: user.address,
      type: user.type,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
