const express = require('express');
const admin = require('../middleware/admin');
const { Admin } = require('../models/admin');
const Order = require('../models/order');
const adminRouter = express.Router();

adminRouter.post('/admin/add_products',admin,async(req,res)=>{
          try{
                    const {name , decription, image , quantity, price, category,catching} = req.body;
                    let product = new Admin({
                              name,
                              decription,
                              image,
                              quantity,
                              price,
                              category,
                              catching
                    });
                    product = await product.save();
                    res.json(product);

          }catch(e){
                    res.status(500).json({msg :"Error: " + e.message});
                    console.log(e.message);

          }
});

adminRouter.get('/admin/get-product',admin,async (req, res)=>{
          try{
                    const products = await Admin.find({});
                    res.json(products);
          }catch(e){
                    res.status(500).json({msg :"Error: " + e.message});

          }
});

adminRouter.post("/admin/delete-product",admin,async(req,res)=>{
          try{
                    const {_id} = req.body;
          const product = await Admin.findByIdAndDelete(_id);
          if (!product) {
                    return res.status(404).json({ msg: "Product not found" });
                  }
                       
                  res.status(200).json({ msg: "Product deleted successfully", product });
          }catch(e){
                    res.status(500).json({msg :"Error: " + e.message});

          }
          
});
adminRouter.get('/admin/get-orders',admin,async (req, res)=>{
  try{
            const orders = await Order.find({});
            res.json(orders);
  }catch(e){
            res.status(500).json({msg :"Error: " + e.message});

  }
});
adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try {
      const { id, status } = req.body;
      let order = await Order.findById(id);
      
      if (!order) {
          return res.status(404).json({ msg: "Order not found" });
      }

      order.status = status;
      order = await order.save();
      
      res.status(200).json(order); // أرسل الاستجابة هنا فقط
  } catch (e) {
      res.status(500).json({ msg: "Error: " + e.message });
  }
});
adminRouter.get('/admin/analytics', admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    let totalEarnings = 0;
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;
      }
    }

    const categories = ['Mobiles', 'Essentials', 'Appliances', 'Books', 'Fashion'];
    const earnings = await Promise.all(categories.map(cat => fetchCategory(cat)));

    const earningsObj = {
      mobileEarnings: earnings[0],
      essentials: earnings[1],
      appliances: earnings[2],
      booksEarnings: earnings[3],
      fashionEarnings: earnings[4]
    };

    res.json(earningsObj);
  } catch (e) {
    res.status(500).json({ msg: "Error: " + e.message });
  }
});
async function fetchCategory(cat) {
  let earnings = 0;
  let catOrders = await Order.find({
    'products.product.category': cat
  });
  for (let i = 0; i < catOrders.length; i++) {
    for (let j = 0; j < catOrders[i].products.length; j++) {
      earnings += catOrders[i].products[j].quantity * catOrders[i].products[j].product.price;
    }
  }
  return earnings;
}
module.exports = adminRouter;
