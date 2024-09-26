const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const ratingSchema = require('./rating');

const adminSchema = mongoose.Schema({
          name: {
                    type : String,
                    required: true,
                    trim:true
          },
          decription:{ type : String,
                    required: true,
                    trim:true},
                    image:[
                              {
                                        type : String,
                                        required: true,       
                              }
                    ],
                    quantity :{
                              type:Number,
                              required: true,
                              trim      :true

                    },
                    price : {
                              type:Number,
                              required: true,
                              trim      :true
                    },
                    catching: {
                              type: String,
                              required: true,
                              trim: true,
                              default: 'default catching'
                            },
                            category: { 
                              type: String,
                              required: true,
                              trim: true
                          },
                          ratings:[
                            ratingSchema
                          ]
});



const Admin = mongoose.model('AdminProduct',adminSchema);
module.exports = {Admin, adminSchema};