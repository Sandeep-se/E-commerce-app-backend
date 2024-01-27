const user=require('./model')

const addItemToCart=async(req,res)=>
{
    try{
        const {userId,item}=req.body
        if(!userId)
        {
            return res.json({message:'signIn'})
        }
        const User=await user.findById(userId)
        const io=req.app.get('socket')
        if (!User) {
            return res.json({ message: 'User not found' });
        }
        const {id, title, price,image }=item
        let {quantity}=item
        if(isNaN(quantity))
        {
            quantity=1
        }
        const itemIndex=User.basket.find(basketItem=>basketItem.id===id)
        if(itemIndex)
        {
            itemIndex.quantity++;
        }
        else
        {
            User.basket.push({id,title,price,quantity,image})
        }
        await User.save()
        io.emit('basket',{message:'item added socket',User})
        res.json({message:'Item added to the cart successfully'});
    }
    catch(err)
    {
        console.log({message:err.message})
    }

}
const removeItemToCart=async(req,res)=>
{
    try{
        const {userId}=req.query
        if(!userId)
        {
            return res.json({message:'signIn'})
        }
        const io=req.app.get('socket')
        const User=await user.findById(userId)
        if (!User || !User.basket) {
            return res.json({ message: 'User not found or basket is empty' });
        }

        const {itemId}=req.query;
        const itemIndex=User.basket.findIndex((item)=>item.id===itemId)
        if(itemIndex===-1)
        {
            return res.json({message:'Item is not found in basket'})
        }
        
        User.basket.splice(itemIndex,1)
        await User.save()
        io.emit('basket',{message:'item removed socket',User})
        res.json({message:'Item is removed sucessful'})
    }
    catch(err)
    {
        console.log({message:err.message})
    }
}
const incrementQuantity=async(req,res)=>
{
    try{
        const {userId,itemId}=req.body
        if(!userId)
        {
            return res.json({message:'signIn'})
        }
        const io=req.app.get('socket')
        const User=await user.findById(userId)
        if (!User) {
            return res.json({ message: 'User not found' });
        }
        
        const item=User.basket.find(item=>item.id===itemId)
        if (!item) {
            return res.json({ message: 'Item is not found in the user basket' });
        }
        item.quantity++;
        await User.save()
        io.emit('basket',{message:'item incremented socket',User})
        return res.json({message:'successfully incremented the quantity'})

    }
    catch(err)
    {
        res.json({message:err.message})      
    }
}

const decrementQuantity=async(req,res)=>
{
    try{
        const {userId}=req.body
        if(!userId)
        {
            return res.json({message:'signIn'})
        }
        const io=req.app.get('socket')
        const User=await user.findById(userId)
        if (!User) {
            return res.json({ message: 'User not found' });
        }
        const {itemId}=req.body;
    
        const item=User.basket.find(item=>item.id===itemId)
        const itemIndex=User.basket.findIndex(item=>item.id===itemId)
        if (!item) {
            return res.json({ message: 'Item is not found in the user basket' });
        }
       
        if(item.quantity===1)
        {
            User.basket.splice(itemIndex,1)
            await User.save()
            return res.json({message:'Item is removed sucessful'})
        }
        item.quantity--;
        await User.save()
        io.emit('basket',{message:'item decremented socket',User})
        return res.json({message:'successfully decremented the quantity'})

    }
    catch(err)
    {
        res.json({message:err.message})
    }
}

const getData = async (req, res) => {
    const { userId } = req.query;
    console.log(userId);
  
    if (!userId) {
      return res.json({ message: 'signIn' });
    }
  
    try {
      const User = await user.findById(userId);
      return res.json({ User });
    } 
    catch (error) {
      console.error('Error while fetching user data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

const moveItemToOrder=async(req,res)=>
  {
    const {userId}=req.body
    
    if(!userId)
    return res.json({ message: 'signIn' })
    const io=req.app.get('socket')
    try{
        const User=await user.findById(userId)
        const basketItem=User.basket;

        if (!basketItem || basketItem.length === 0) {
            return res.json({ message: 'Basket is empty' });
          }
        
          for (const item of basketItem) {
            const { id, title, price, quantity, image } = item;
            console.log({ id, title, price, quantity, image });
      
            User.orders.push({ id, title, price, quantity, image });
          }
        User.basket=[]
        await User.save();
        io.emit('basket',{message:'item added socket',User})
        return res.json({message:'succesfully added to order'})
    }
    catch(err)
    {
        return res.json({message:err.message})
    }
  }
  
  const removeItemToOrder=async(req,res)=>
{
    try{
        const {userId}=req.query
        if(!userId)
        {
            return res.json({message:'signIn'})
        }
        const io=req.app.get('socket')
        const User=await user.findById(userId)
        if (!User || !User.orders) {
            return res.json({ message: 'User not found or order is empty' });
        }

        const {itemId}=req.query;
        const itemIndex=User.orders.findIndex((item)=>item.id===itemId)
        if(itemIndex===-1)
        {
            return res.json({message:'Item is not found in basket'})
        }
        
        User.orders.splice(itemIndex,1)
        await User.save()
        io.emit('basket',{message:'item removed socket',User})
        res.json({message:'Item is removed sucessful'})
    }
    catch(err)
    {
        console.log({message:err.message})
    }
}

const updateData=async(req,res)=>
{
    try{
        const {userId, name, email, contact, address }=req.body
        console.log(req.body)
        if(!userId)
        {
            return res.json({message:'signIn'})
        }
        const io=req.app.get('socket')
        const updateObject = {};

        if (name !== '') {
        updateObject.name = name;
        }

        if (email !== '') {
        updateObject.email = email;
        }

        if (contact !== '') {
        updateObject.contact = contact;
        }

        if (address !== '') {
        updateObject.address = address;
        }

        const updatedUser = await user.findByIdAndUpdate(
        userId,
        updateObject,
        { new: true }
        );

        io.emit('basket', { message: 'user detail updated socket', User: updatedUser });

        res.json({message:'user detail sucessfully updated'});
    }
    catch(err)
    {
        console.log({message:err.message})
    }
}
module.exports={addItemToCart,removeItemToCart,incrementQuantity,decrementQuantity,getData,moveItemToOrder,removeItemToOrder,updateData}