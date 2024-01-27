const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    },
    contact:
    {
        type:Number,
    },
    address:
    {
        type:String,
    },
    basket: [
        {
            id: {
                type: String,
                required: true,
            },
            title:{
                type:String,
                required:true,
            },
            price: {
                type:Number,
                required: true,
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            },
            image:{
                type:String,
                required:true,
            }, 
        }
    ],
    orders:
    [
        {
            id: {
                type: String,
                required: true,
            },
            title:{
                type:String,
                required:true,
            },
            price: {
                type:Number,
                required: true,
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            },
            image:{
                type:String,
                required:true,
            }, 
        }
    ]
});

const user = mongoose.model('User', productSchema); 
module.exports = user