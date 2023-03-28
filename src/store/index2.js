import { createSlice, configureStore } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const initialAuthState = { isAuthenticated: false, token: '', emailID: '' }

const initialExpenseState = { id: '', money: '', desc: '', category: ''}

const initialTheme = { theme: false }

const themeSlice = createSlice({
    name: "theme",
    initialState: initialTheme,
    reducers: {
        dark(state) {
            state.theme = true;
        },
        light(state) {
            state.theme = false;
        },
        toggle(state) {
            state.theme = !state.theme
        }
    }
})

const expenseSlice = createSlice({
    name: "expenses",
    initialState: initialExpenseState,
    reducers: {
        money(state, action) { 
            state.money = action.payload
        },
        category(state, action) {
            state.category = action.payload
        },
        desc(state, action) {
            state.desc = action.payload
        },
        id(state,action) {
            state.id = action.payload
        }
    }
})

const authSlice = createSlice({
    name: "authentication",
    initialState: initialAuthState,
    reducers: {
        login(state) {
            state.isAuthenticated = true;
        },
        logout(state) {
            state.isAuthenticated = false;
        },
        token(state, action) {
            state.token = action.payload
        },
        emailId(state, action) {
            state.emailID = action.payload
        }

    }
})

const store = configureStore({
    reducer: { auth: authSlice.reducer, expense: expenseSlice.reducer, theme: themeSlice.reducer }
})

export const authActions = authSlice.actions;
export const expenseActions = expenseSlice.actions;
export const themeActions = themeSlice.actions;

export default store;