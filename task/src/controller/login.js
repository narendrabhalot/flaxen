

const  registermodel = require('../models/registrationmodel')
const jwt = require('jsonwebtoken')

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};


function isValid(value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true


}const userLogIn = async function (req, res) {

    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "please enter a valid email" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }

        const checkedUser = await registermodel.findOne({ email: email, password: password });
        if (!checkedUser) {
            return res.status(401).send({ status: false, msg: "email or password is not correct" });
        }

        else {
            const token = jwt.sign({ userId: checkedUser._id.toString() }, "narendra123", { expiresIn: '1d' });
            res.header('x-auth-key', token)
            return res.status(201).send({ status: true, Token: token });
        }

    }
    catch (error) { res.status(500).send({ msg: error.message }) }
};

module.exports.userLogIn=userLogIn