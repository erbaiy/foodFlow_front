import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../utils/axiosRequests";
import { toast } from "sonner";
import { clearCart } from "./cartSlice";


// Thunk functions to fetch and insert data

export const insertOrder = createAsyncThunk(
    "client",
    async(orderData)=>{
        const uri= "client";
        try{


           
            const response =  await postRequest(uri,orderData);
            console.log("response",response);
            thunkApi.dispatch(clearCart());
            return response;
        }
        catch(error){
            return thunkApi.rejectWithValue(error.message);
        }
    }
)

export const fetchOrders = createAsyncThunk(
    "order/fetchOrders",
    async(_,thunkApi)=>{
        const uri= "orders";
        try{
            return await getRequest(uri,clientId);
        }
        catch(error){
            return thunkApi.rejectWithValue(error.message);
        }
    }
)

// Order slice

const initialState = {
    items : [],
    restaurant:0,
    client:JSON.parse(localStorage.getItem('user')),
    totalAmount:0,
    loading: false,
    error:null,
};

const orderSlice = createSlice({
    name:"order",
    initialState,

    reducers :{
        initializeOrder:(state,action)=>{
            state.items = action.payload.items;
            state.totalAmount = action.payload.totalAmount;
            state.restaurant = action.payload.restaurant;
            state.client = action.payload.client;
            console.log('initize payload',action.payload);
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(insertOrder.pending,(state) =>{
            state.loading=true;
        })
        .addCase(insertOrder.fulfilled,(state, action) =>{
            console.log("action.payload",action.payload)
            const items = action.payload.order.items;
            const restaurant = action.payload.order.restaurant;
            const client = action.payload.order.client;
            state.loading=false;
            state.items = items;
            state.restaurant = restaurant;
            state.client = client;           
            toast.success("Order passed");
        })
        .addCase(insertOrder.rejected,(state,action)=>{
            state.loading = false;
            state.error=action.payload;
        })
    }
})

export const { initializeOrder } = orderSlice.actions; 
export default orderSlice.reducer;
