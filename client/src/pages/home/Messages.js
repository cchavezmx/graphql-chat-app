import React, { Fragment, useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import Message from './Message'
import { Col } from 'react-bootstrap'

// Importamos el contexto
import { useMessageDispatch, useMessageState } from  '../../context/Message'

const GET_MESSAGES = gql`
  query getMessages($from: String!){
      getMessages(from: $from){
          uuid
          from
          to
          content
          createdAt

        }
  }
`
const Messages = () => {

  
  //  atravez del cotnexto podemos acceder al objeto de users generado en el componente de usuarios 
  const { users } = useMessageState()
  
  // iteramos el arrglo de usuarios para poder si esta lleno? :S 
  const selectedUser = users?.find((u => u.selected === true ))?.username
  
  if (selectedUser) console.log(selectedUser)

    const [getMessages, { loading: messagesLoading, data: messagesData, error: messagesErr }] = useLazyQuery(GET_MESSAGES)

    useEffect(() => {
        if(selectedUser)
        getMessages({ variables: { from: selectedUser }})
    }, [selectedUser])

    return (
      <Col xs={10} md={8}  className="messages-box d-flex flex-column-reverse">
        {messagesData && messagesData.getMessages.length > 0 ? (
          messagesData.getMessages.map(msg => {
            return (
              <Fragment>
                <Message message={msg} />
              </Fragment>
            )
          })
        ): <p>No tienes mensajes</p>} 
        </Col>
    )
}

export default Messages
