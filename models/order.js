const mongoose = require('mongoose');
const { adminSchema } = require('./admin');

const orderSchema = mongoose.Schema({
          products : [
                   {
                    product: adminSchema,
                    quantity:{
                     type: Number,
                     required: true         
                    }
                   }
          ],
          totalPrice : {
           
                    type: Number,
                    required: true
          },
          address:{
                    type: String,
                    required: true
          },
          userId : {
                    required: true,
                    type: String
          },
          orderAt:{
                    type: Number,
                    required: true
          },
          status:{
                    type: Number,
                    default:0,
          }
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;