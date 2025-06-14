const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: Buffer,
    imageBase64: String, 
    name:String,
    price:Number,
    discount:{
        type:Number,
        default:0
    },
    bgcolor:String,
    panelcolor:String,
    textcolor:String,
});
productSchema.pre('save', function(next) {
    if (this.image) {
        this.imageBase64 = this.image.toString('base64');
    }
    next();
});
module.exports = mongoose.model("product",productSchema);