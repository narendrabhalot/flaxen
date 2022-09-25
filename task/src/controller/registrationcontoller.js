const mongoose= require('mongoose')
const registrationmodel = require('../models/registrationmodel')
const jwt = require('jsonwebtoken')



////************    USER REGISTRATION   ********** *//


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};


function isValid(value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true
}


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId); // returns a boolean
  };



  const isValidPhone = function (number) {
    
    return /^[6789]\d{9}$/.test(number);
  };
  


const isValidEmail = function (email) {
    const check =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return check.test(email);
};


const isValidPassword = function (pass) {
    let passRE =
      /^(?!\S*\s)(?=\D*\d)(?=.*[!@#$%^&*])(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z]).{8,15}$/;
    return passRE.test(pass);
  };



const registration= async function (req, res) {
    try {

        let data = req.body

        let {  name, address, email,number, password } = data

        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: "please fill option" })
        }

        if (!isValid(name)) {
            res
                .status(400)
                .send({ status: false, message: "Name is mandatory" });
            return;
        }

        if (!isValid(address)) {
            res
                .status(400)
                .send({ status: false, message: "address is mandatory" });
            return;
        }

        if (!isValid(email)) {
            res
                .status(400)
                .send({ status: false, message: "email is mandatory" });
            return;
        }

        if (!isValid(number)) {
            res
                .status(400)
                .send({ status: false, message: "numberis mandatory" });
            return;
        }
        if (!isValid(password)) {
            res
                .status(400)
                .send({ status: false, message: "Password is mandatory" });
            return;
        }

        if (!isValidEmail(email)) {
            res.status(400).send({ status: false, message: "Email is invalid" });
            return;
        }
        // check email is unique or not
        const isExistEmail = await registrationmodel.findOne({ email: email });
        if (isExistEmail) {
            res
                .status(400)
                .send({ status: false, message: "This Email is alredy exist" });
            return;
        }

        if (!isValidPhone(number)) {
            res
              .status(400)
              .send({ status: false, message: "Phone number is not a valid" });
            return;
          }

          const isExisnumber = await registrationmodel.findOne({ number:number });
        if (isExisnumber) {
            res
                .status(400)
                .send({ status: false, message: "This number is alredy exist" });
            return;
        }
        if (!(password.length > 8 && password.length < 15)) {
            res
                .status(400)
                .send({ status: false, message: "password length between 8-15" });
            return;
        }
        
        if (!isValidPassword(password)) {
            res.status(400).send({
              status: false,
              message:
                "Password must be 8-15 characters long consisting of atleast one number, uppercase letter, lowercase letter and special character",
            });
            return;
          }


        const creatData = await registrationmodel.create(data)
        res.status(201).send({
            status: true,
            data: creatData,
            message: "registration successfull"
        })
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }



}




const userList = async function (req, res) {
    try {
        const alluser = await registrationmodel.find()

        if (alluser.length == 0) {
            res.send(404).send({ status: false, message: "no any user exist" })
        }

        res.status(200).send({ status: true, data: alluser })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}



const userUpdate = async function (req, res) {
    try {
        let userId = req.params.userId
        let user = await registrationmodel.findById(userId)


        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "invalid userId" })
        }
        if (!user) {
            return res.status(404).send({ status: "false", msg: "No such user exists " })
        };

        let body = req.body

        let emailAlreadyExist = await registrationmodel.findOne({ email: body.email })
        if (emailAlreadyExist) {
            return res.status(400).send({ status: false, message: 'email is already exist' })
        }
        let result = await registrationmodel.findOneAndUpdate({ _id: user._id }, body, { new: true })
        res.status(200).send({ data: result })


    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: "error", error: err.message })
    }
}




const deleteuser = async function (req, res) {

    try {
        let userId = req.params.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "invalid userId" })
        }
        let checkuser = await registrationmodel.findById(userId)
       

        if (!checkuser) {
            return res.status(404).send({ status: false, msg: "No user found this userId" })

        }

        await userModel.remove({ _id: userId })
        return res.status(200).send({ status: true, message: "user deleted successfully" })
    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.registration=registration
module.exports.userList=userList
module.exports.userUpdate=userUpdate
module.exports.deleteuser=deleteuser