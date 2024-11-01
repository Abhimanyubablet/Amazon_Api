const mongoose = require ("mongoose");
const { productSchema } = require("./product");

const userSchema = new mongoose.Schema({
    name :{
        required : true,
        type : String,
        trim : true
    },
    email : {
        required : true,
        type : String,
        trim : true,
        validate : {
            validator : (value) => {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return value.match(re);
            },
            message : "Please enter a valid email address",
        },
    },
    password : {
        required : true,
        type : String,
    },
    address : {
        type : String,
        default : ""
    },
    type : {
        type : String,
        default : "user",
    },
    cart : [
        {
            product : productSchema,
            quantity : {
                type : Number,
                required : true,
            }
        }
    ]
})

const User = mongoose.model("User", userSchema);
module.exports = User;