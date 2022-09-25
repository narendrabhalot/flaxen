const express = require("express");
const router = express.Router();
const userCreate= require('../controller/registrationcontoller') 
const userlogin= require('../controller/login') 
const userList= require('../controller/registrationcontoller') 
const userupdate= require('../controller/registrationcontoller') 
const userdelete= require('../controller/registrationcontoller') 
const authentication = require('../middlewere/auth')



router.post('/register', userCreate.registration)
router.post('/login', userlogin.userLogIn)
router.get('/alldata', userList.userList)
router.put('/updatedata',authentication, userupdate.userUpdate)
router.delete('/deletedata',userdelete.deleteuser)



module.exports = router
