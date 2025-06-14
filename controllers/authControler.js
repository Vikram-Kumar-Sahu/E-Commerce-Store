const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken");

module.exports.registerUser =async function (req,res) {
    try{
        
        let {email,password,fullname} = req.body;
       
        let user = await userModel.findOne({email:email});
        if (user) return res.status(401).send("You already have an account please login");

        bcrypt.genSalt(10,function (err,salt) {
            bcrypt.hash(password,salt,async function(err,hash){
                if(err) return res.send(err.message);
                else {
                    let user= await userModel.create({
                        email,
                        password:hash,
                        fullname,
                    });
                    //creating token
                    
                    //creating cookie
                    let token =  generateToken(user);
                    res.cookie("token",token);
                    res.send("user created succesfully");
                    
                }
            })
        })
        
    }catch(err){
        console.log(err.message);
    }
}

module.exports.loginUser = async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).send("Email or Password incorrect");

        bcrypt.compare(password, user.password, function (err, result) {
            if (err) return res.status(500).send("Internal server error");

            if (result) {
                const token = generateToken(user);
                res.cookie("token", token);
                res.send("Login successful");
            }
            else {
                return res.status(400).send("Email or Password incorrect");
            }
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Something went wrong");
    }
};

module.exports.logout = function (req,res) {
    res.cookie("token","");
    res.redirect("/");
};
