import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRestaurants = createAsyncThunk('restaurants/fetchAll', async () => {
    const response = await axios.get('http://localhost:5000/api/v1/restaurants');
    return response.data.data;
});

const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState: { items: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurants.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            });
    }
});

export const store = configureStore({
    reducer: { restaurants: restaurantSlice.reducer }
});