const mongoose = require('mongoose');
const { adminSchema } = require('./admin');

const userSchema = mongoose.Schema({
          name: {
                    required: true,
                    type:String,
                    trim:true

          },
          email: {
                    required: true,
                    type:String,
                    trim:true,
                    validate:{
                              validator:(value)=>{
                                        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        return value.match(re);
   
                              },
                              message : 'Please enter a valid email address'
                    }
          },
          password : {
                    required : true,
                    type : String,
                    validate:{
                              validator:(value)=>{

                                        return value.length > 6;
   
                              },
                              message : 'Please enter al long password'
                    }
          },
          address :{
                    type : String,
                    default : '',
          },
          type : {
                    type: String,
                    default : 'user',
          },
        cart: [
                    {
                              product: {
                                        type: adminSchema,
                                        required: true // Specify that the product is required
                                    },
                              quantity: {
                                        type : Number,
                                        required  : true,
                              }
                    }
          ]

});

const User = mongoose.model('User',userSchema);
module.exports = User;