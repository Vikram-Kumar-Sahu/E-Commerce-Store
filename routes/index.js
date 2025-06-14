const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model"); // Make sure path is correct
const userModel = require("../models/user-model")

router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error ,loggedin:false });
});

router.get("/addtocart/:id", isloggedin, async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        const productId = req.params.id;

        // Find if product already exists in cart
        const existingItem = user.cart.find(item => 
            item.product && item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({
                product: productId,
                quantity: 1
            });
        }

        await user.save();
        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch (err) {
        console.error("Error adding to cart:", err);
        req.flash("error", "Failed to add to cart.");
        res.redirect("/shop");
    }
});


// ✅ Fix here
router.get("/shop", isloggedin, async function (req, res) {
    try {
        const products = await productModel.find(); // You can apply filters/sorting if needed
        let success = req.flash("success");
        res.render("shop", { products,success });
    } catch (err) {
        console.error("Failed to load products:", err.message);
        req.flash("error", "Unable to load shop right now.");
        res.redirect("/");
    }
});

router.get("/cart", isloggedin, async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email })
            .populate({
                path: 'cart.product',
                model: 'product'
            });

        let success = req.flash("success") || "";
        res.render("cart", { user, success });
    } catch (err) {
        console.error("Error loading cart:", err);
        req.flash("error", "Failed to load cart");
        res.redirect("/shop");
    }
});
  
  

  // Updated increase quantity route
router.get("/cart/increase/:id", isloggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        const item = user.cart.find(i => 
            i.product && i.product._id.toString() === req.params.id
        );
        
        if (item) {
            item.quantity += 1;
            await user.save();
        }
        res.redirect("/cart");
    } catch (err) {
        console.error("Error increasing quantity:", err);
        req.flash("error", "Failed to update quantity");
        res.redirect("/cart");
    }
});

// Updated decrease quantity route
router.get("/cart/decrease/:id", isloggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        const item = user.cart.find(i => 
            i.product && i.product._id.toString() === req.params.id
        );
        
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                await user.save();
            } else {
                // Optional: Remove if quantity reaches 0
                user.cart = user.cart.filter(i => 
                    i.product && i.product._id.toString() !== req.params.id
                );
                await user.save();
                req.flash("success", "Item removed from cart");
            }
        }
        res.redirect("/cart");
    } catch (err) {
        console.error("Error decreasing quantity:", err);
        req.flash("error", "Failed to update quantity");
        res.redirect("/cart");
    }
});

// Updated remove from cart route
router.get("/removefromcart/:id", isloggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        user.cart = user.cart.filter(item => 
            item.product && item.product._id.toString() !== req.params.id
        );
        await user.save();
        req.flash("success", "Item removed from cart");
        res.redirect("/cart");
    } catch (err) {
        console.error("Error removing from cart:", err);
        req.flash("error", "Failed to remove item");
        res.redirect("/cart");
    }
});
  

router.get("/logout", isloggedin,function(req,res){
    res.render("shop");
})

module.exports = router;
