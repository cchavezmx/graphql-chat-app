import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { gql, useLazyQuery } from '@apollo/client';


const Login = (props) => {

  
const LOGIN_USER = gql`
query login($username: String! $password: String!){
  login(username: $username password: $password) { 
    username email createdAt token
  }
}
`;

  const [ errForm, setErrFrom ] = useState({})

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER ,{
    onError: (err) => {
      setErrFrom({})
      setErrFrom(err.graphQLErrors[0].extensions.errors)
    },
    onCompleted: (data) => {
        localStorage.setItem('Token', data.login.token)
        props.history.push('/')
    }
    
  })

  console.log(errForm)

    const { register, handleSubmit } = useForm()

      const onSubmit = (e) => {
        loginUser({ variables: e })
      }

    return (
        <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Registro</h1>
       
        <Form onSubmit={handleSubmit(onSubmit)}>
      
      <Form.Group>
        <Form.Label className={errForm.username && 'text-danger'}>
        {errForm.username ?? 'Nombre de usario'}
        </Form.Label>
        <Form.Control className={errForm.username && 'is-invalid'} name="username" ref={register} type="text" placeholder="Nombre de usuario" />
      </Form.Group>
      <Form.Group>
        <Form.Label className={errForm.password && 'text-danger'}>
        {errForm.password ?? 'Contraseña'}
        </Form.Label>
        <Form.Control className={errForm.password && 'is-invalid'} name="password" ref={register} type="password" placeholder="Ingrese su password" />
      </Form.Group>
      <Button variant="success" type="submit" disabled={loading}>
        { loading ? 'loading..' : 'Registrar'}
      </Button>
      </Form>
    
        </Col>
      </Row>
    )
}

export default Login
