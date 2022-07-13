import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {InitialStateTypes,user} from '../../common/types'
// Define the initial state using that type


const initialState: InitialStateTypes = {
	userSearch:[],
	user:[]
};

export const userSlice = createSlice({
	name: 'userState',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<user[]>) => {
			state.user = action.payload;
		},
		setSearch: (state, action: PayloadAction<user[]>) => {
		    state.userSearch=action.payload
		},
	},
});

export const { setUser, setSearch } = userSlice.actions;

export default userSlice.reducer;
