const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    age: { type: Number, required: true },
    city: { type: String, required: true }
  },
{
  timestamps:true
});
//make a index 
userSchema.index({email:1},{unique:true}); 

//export the modle
module.exports = mongoose.model("User", userSchema);
