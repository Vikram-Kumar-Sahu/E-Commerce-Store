const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model"); // Make sure path is correct

router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error });
});

// ✅ Fix here
router.get("/shop", isloggedin, async function (req, res) {
    try {
        const products = await productModel.find(); // You can apply filters/sorting if needed
        res.render("shop", { products });
    } catch (err) {
        console.error("Failed to load products:", err.message);
        req.flash("error", "Unable to load shop right now.");
        res.redirect("/");
    }
});

router.get("/logout", isloggedin,function(req,res){
    res.render("shop");
})

module.exports = router;
