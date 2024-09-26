const express = require('express');
const auth = require('../middleware/auth');
const { Admin } = require('../models/admin');
const User = require('../models/user');
const Order = require('../models/order');
const userRouter = express.Router();


userRouter.post('/api/add-to-cart', auth, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const product = await Admin.findById(_id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    let user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let isProductFound = false;
    for (let i = 0; i < user.cart.length; i++) {
      console.log('Checking product in cart:', user.cart[i].product._id);
      if (user.cart[i].product._id.equals(product._id)) {
        isProductFound = true;
        user.cart[i].quantity += 1;
        break;
      }
    }

    if (!isProductFound) {
      user.cart.push({ product, quantity: 1 });
    }

    user = await user.save();
    console.log('Updated user cart:', user.cart);
    res.json(user);

  } catch (e) {
    res.status(500).json({ msg: "Error: " + e.message });
    console.log(e.message);
  }
});
userRouter.get('/api/display-cart', auth, async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.user).populate('cart.product');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let total = 0;
    const cartWithSubtotal = user.cart.map(item => {
      const subtotal = item.product.price * item.quantity;
      total += subtotal; 
      return {
        product: item.product,
        quantity: item.quantity,
        subtotal: subtotal 
      };
    });
    total = total.toFixed(3);
    res.json({ cart: cartWithSubtotal, total });
  } catch (e) {
    res.status(500).json({ msg: "Error: " + e.message });
    console.log(e.message);
  }
});
userRouter.delete('/api/remove-from-cart/:id', auth, async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const product = await Admin.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    let user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let productFound = false; 
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        productFound = true; 
        if (user.cart[i].quantity === 1) {
          user.cart.splice(i, 1); 
        } else {
          user.cart[i].quantity -= 1; 
        }
        break; // 
      }
    }
    if (!productFound) {
      return res.status(404).json({ msg: "Product not found in cart" });
    }

    user = await user.save();
    res.json(user);

  } catch (e) {
    res.status(500).json({ msg: "Error: " + e.message });
    console.log(e.message);
  }
});
userRouter.post('/api/save-user-address',auth,async(req,res)=>{
  try{
    const {address} = req.body;
    let user = await User.findById(req.user);
    user.address = address;
    user = await user.save();
    res.json(user);
  }catch (e) {
    res.status(500).json({ msg: "Error: " + e.message });
    console.log(e.message);
  }
});

userRouter.post('/api/order', auth, async (req, res) => {
  try {
    const { cart, totalPrice, address } = req.body;
    console.log(req.body);
    let products = [];
    for (let i = 0; i < cart.length; i++) {
      let product = await Admin.findById(cart[i].product._id);

      // Check if the product exists
      if (!product) {
        return res.status(404).json({ msg: `Product not found for ID: ${cart[i].product._id}` });
      }
      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;
        products.push({ product, quantity: cart[i].quantity });
        await product.save();
      } else {
        return res.status(400).json({ msg: `${product.name} is out of stock!` });
      }
    }

    let user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.cart = [];
    await user.save();

    let order = new Order({
      products,
      totalPrice,
      address,
      userId: req.user,
      orderAt: new Date().getTime()
    });

    order = await order.save();
    res.json(order);

  } catch (e) {
    res.status(500).json({ msg: "Error: " + e.message });
    console.log(e.message);
  }
});

userRouter.get('/api/orders/me',auth,async (req,res) => {
  try{
    let orders = await Order.find({userId: req.user});
    res.json(orders);
  }catch (e) {
    res.status(500).json({ msg: "Error: " + e.message });
    console.log(e.message);
  }
})

module.exports = userRouter;
