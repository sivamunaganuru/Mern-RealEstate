import React from 'react'
import {Outlet, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = () => {
    const {currentUser} = useSelector(state => state.user);
    if(!currentUser){
        return <Navigate to='/sign-in' />
    }
    return (
        <Outlet />
    )
}

export default PrivateRoute;