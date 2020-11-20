import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuthState } from '../context/authContext'

export default function DynamicRouters(props){
    const { user } = useAuthState()

    if(props.auth && !user){
        return <Redirect to="/login" />
    } else if(props.guest && user){
        return <Redirect to="/" />
    } else {
        return <Route component={props.component} { ...props} />
    }
}

