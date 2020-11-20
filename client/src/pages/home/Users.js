import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Image } from 'react-bootstrap'
import classNames from 'classnames'
import { useMessageState, useMessageDispatch } from '../../context/Message'
import { Col } from 'react-bootstrap'

const GET_USERS = gql`
  query getUser{
    getUser{
    username createdAt imageUrl email
    latestMessage{
      content uuid from to createdAt
    }
  }
  }
`

const Users = () => {

    const dispatch = useMessageDispatch()
    const { users } = useMessageState()

    // iteramos el arrglo de usuarios para poder si esta lleno? :S 
    const selectedUser = users?.find((u => u.selected === true ))?.username

    const { loading } =useQuery(GET_USERS, {
        onCompleted: data => dispatch({ type: 'SET_USERS', payload: data.getUser}),
        onError: err => console.log(err)
    })

    let usersMarkup
    if (!users || loading) {
      usersMarkup = <p>Loading..</p>
    } else if (users.length === 0) {
      usersMarkup = <p>No users have joined yet</p>
    } else if (users.length > 0) {
      usersMarkup = users.map((user) => {
        const selected = selectedUser === user.username
            return  (
        <div 
        role="button" 
        className={classNames('hover-buttom d-flex p-3', {'bg-white' : selected, })} 
        onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: user.username})}>

          <Image src={user.imageUrl} className="user-image mr-2"></Image>
    
          <div className="d-none d-md-block ml-2">
          <p className="text-success">{user.username}</p>
          <p className="font-weight-light">
            {user.latestMessage ? user.latestMessage.content : 'You are now connected' }
          </p>
          </div>
        </div>
      )} 
      )
    }      
  // TODO REVISAR LOGICA DEL USEREDCUER

    return (
        <Col xs={2} md={4} className="p-0 bg-secondary">
           {usersMarkup} 
        </Col>
    )
}

export default Users
