const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner-model");

router.get("/", function (req, res) {
    res.send("hey its working get");
});

// Only register this route in development mode
if (process.env.NODE_ENV === "development") {
    router.post("/create", async function (req, res) {
        try {
            const { fullname, email, password } = req.body;

            if (!fullname || !email || !password) {
                return res.status(400).send("Missing required fields");
            }

            const owners = await ownerModel.find();

            if (owners.length > 0) {
                return res.status(503).send("You don't have permission to create a new owner");
            }

            const createdOwner = await ownerModel.create({
                fullname,
                email,
                password,
            });

            return res.status(201).send(createdOwner);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}

router.get("/admin", function (req, res) {
    const success = req.flash ? req.flash("success") : ""; // compatible whether you use flash or not
    res.render("createproducts", { success });
});


module.exports = router;
