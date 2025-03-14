import { createSlice } from "@reduxjs/toolkit";
import { deleteState, loadState } from "../utils/localStorage";
import {  toast } from 'sonner'
import { useDispatch } from "react-redux";



const initialState = loadState('cart') || {
    items : [],
    client: JSON.parse(localStorage.getItem('user')), 
    totalAmount :0,
    restaurant:0
};

export const updateRestaurantAndClearCart = (restaurantId) => (dispatch, getState) => {
    const { cart } = getState(); 
    if (cart.restaurant !== restaurantId) {
        dispatch(clearCart()); 
    }
    dispatch(updateRestaurant(restaurantId));
};

const cartSlice = createSlice({
    name:"cart",
    initialState,
    

    reducers : {
        addToCart:(state, action) => {  
    
            const product = action.payload;

            // Check if item already in cart 
            const existingItem = state.items.find(item=>item.id == product._id);               
            // Update quantity if item exists
            if(existingItem){
                existingItem.quantity = product.quantity || existingItem.quantity ;
                toast.success("Item Quantity Updated");
            }
            // Push a new item if not
            else{
                
                state.items.push({id:product._id,name:product.name,description:product.description,quantity:product.quantity || 1,price:product.price,image:product.image,restaurant:product.restaurant})
                state.client = JSON.parse(localStorage.getItem('user'));
                console.log("state.items",JSON.stringify(state.items));
                toast.success("Item added to cart");
            } 
            
            // calculate total
            state.totalAmount=state.items.reduce((totalAmount,item)=>totalAmount+item.quantity*item.price,0);
        },
        removeFromCart:(state,action)=>{
            const productId = action.payload;
            state.items = state.items.filter((item) => productId !== item.id);
            toast.warning("Item removed");
            state.totalAmount=state.items.reduce((totalAmount,item)=>totalAmount+item.quantity*item.price,0);
        },
        clearCart:(state) => {
            state.items =[];
            state.client = 0;
            state.totalAmount =0;
            state.restaurant=0;
            deleteState("cart");       
        },
        updateQuantity:(state,action)=>{
            const productId = action.payload.id;
            const selectedItem = state.items.find(item => item.id == productId);
            if(selectedItem){
                selectedItem.quantity = selectedItem.quantity+=action.payload.quantity;
                state.totalAmount=state.items.reduce((totalAmount,item)=>totalAmount+item.quantity*item.price,0);
            }
        },
        updateRestaurant:(state,action)=>{
            state.restaurant = action.payload;
        }
    }

})

export const {addToCart, removeFromCart, clearCart, updateQuantity, updateRestaurant} = cartSlice.actions;
export default cartSlice.reducer;
