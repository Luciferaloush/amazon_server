const express = require('express');
const productRouter = express.Router();
const auth = require('../middleware/auth');
const {Admin} = require('../models/admin');
productRouter.get('/api/products/:category',auth,async(req,res)=>{
          try{
                    const products = await Admin.find({
                              category: req.params.category
                          });
                          if (products.length === 0) {
                              return res.status(404).json({ msg: "No products found in this category." });
                          }
                    res.json(products);
          }catch(e){
                    res.status(500).json({msg:e.message});
          }
});

productRouter.get('/api/products/search/:name',auth,async(req,res)=>{
          try{
                    const product = await Admin.find({
                              name: {$regex: req.params.name , $options:'i'}
                    });
                    res.json(product);
          }catch(e){
                    res.status(500).json({msg:e.message});
          }
});
productRouter.get('/api/product/get-product',auth,async (req, res)=>{
          try{
                    const products = await Admin.find({});
                    res.json(products);
          }catch(e){
                    res.status(500).json({msg :"Error: " + e.message});

          }
});


productRouter.post('/api/rate-product',auth,async(req,res)=>{
          try{
                    console.log("Request body:", req.body); 
                const {_id , rating} = req.body;
                
                let product = await Admin.findById(_id);
                if (!product) {
                    return res.status(404).json({ msg: "Product not found." }); 
                }
                
                for(let i = 0; i < product.ratings.length; i++){
                    if(product.ratings[i].userId == req.user){
                              product.ratings.splice(i, 1);
                              break;
                    }
                }
                
                const ratingSchema  = {
                    userId : req.user,
                    rating,
                };
                product.ratings.push(ratingSchema);
                product = await product.save();
                res.json(product);
          }catch(e){
            console.error(e); // Log the error

                    res.status(500).json({msg :"Error: " + e.message});
    
          }
})

productRouter.get('/api/deal-of-day',auth ,async (req, res)=>{
   try{
    let products = await Admin.find({});

    products = products.sort((a, b)=>{
        let aSum = 0;
        let bSum = 0;

        for(let i=0; i < a.ratings.length; i++){
            aSum += a.ratings[i].rating;
        }
        for(let i=0; i < b.ratings.length; i++){
            bSum += b.ratings[i].rating;
        }
        return aSum < bSum ? 1 : -1;
    })
    res.json(products[0]);
   }
    catch(e){
        res.status(500).json({msg :"Error: " + e.message});

    }
});


module.exports = productRouter;
