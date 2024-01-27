const express=require('express')
const router=express.Router()

const {signUp,signIn,logout}=require('./useAuth')
const {
    addItemToCart,
    removeItemToCart,
    incrementQuantity, 
    decrementQuantity,
    getData,
    moveItemToOrder,
    removeItemToOrder,
    updateData
    }=require('./Basket')

router.get('/',(req,res)=>
{
    res.json('hello ')
})

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.post('/logout',logout)
router.post('/addItemToCart',addItemToCart)
router.post('/incrementQuantity',incrementQuantity)
router.post('/decrementQuantity',decrementQuantity)
router.delete('/removeItemToCart',removeItemToCart)
router.get('/getData',getData)
router.delete('/removeItemToOrder',removeItemToOrder)
router.post('/moveItemToOrder',moveItemToOrder)
router.put('/updateData',updateData)


module.exports=router