import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client';


const Register = (props) => {

  
const REGISTER_USER = gql`
mutation register($username: String! $email: String! $password: String! $confirmPassword: String! ){
  register(username: $username email: $email password: $password confirmPassword: $confirmPassword) { 
    username email createdAt
  }
}
`;

  const [ errForm, setErrFrom ] = useState({})

  const [registerUser, { loading, data }] = useMutation(REGISTER_USER ,{
    update: (_, res) => {
      console.log(res)
      props.history.push('/login')
    },
    onError: (err) => {
      setErrFrom({})
      setErrFrom(err.graphQLErrors[0].extensions.errors)
    }
  })

  console.log(errForm)

    const { register, handleSubmit } = useForm()

      const onSubmit = (e) => {
        registerUser({ variables: e })
      }

    return (
        <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Registro</h1>
       
        <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label className={errForm.email && 'text-danger'}>
          {errForm.email ?? 'Email'}
        </Form.Label>
        <Form.Control className={errForm.email && 'is-invalid'} name="email" ref={register} type="email" placeholder="Enter email" />
      </Form.Group>
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
      <Form.Group>
        <Form.Label className={errForm.confirmPassword && 'text-danger'}>
        {errForm.confirmPassword ?? 'Reescriba su contraseña'}
        </Form.Label>
        <Form.Control className={errForm.confirmPassword && 'is-invalid'} name="confirmPassword" ref={register} type="password" placeholder="repita su password" />
      </Form.Group>
      <Button variant="success" type="submit" disabled={loading}>
        { loading ? 'loading..' : 'Registrar'}
      </Button>
      </Form>
    
        </Col>
      </Row>
    )
}

export default Register
