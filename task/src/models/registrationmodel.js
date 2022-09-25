const mongoose = require('mongoose')

const registrationSchema= new mongoose.Schema({

 name :{
    type :String,
    required: true,
    trim:true,
 },
address:{
    type: String,
    trim:true,
    required: true,
},
email:{
    type:String,
    unique:true

},
number:{
    type:String,
    required:true,
    unique:true
},
password:{

    type: String,
    required: true,
    trim: true
    

}


},{timestamps: true})



module.exports = mongoose.model("registration", registrationSchema);
