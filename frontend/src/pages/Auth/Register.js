import './Auth.css'

// Components
import { Link } from 'react-router-dom';
import Message from './../../components/Message';

// Hooks
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

// Redux
import {register, reset} from '../../slices/authSlice'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()

  const {loading, error} = useSelector(state => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()

    const user = {
      name, 
      email, 
      password, 
      confirmPassword
    }

    console.log(user) // Remover com o final do projeto

    dispatch(register(user))

    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  // Clean all auth states
  useEffect(() => {
    dispatch(reset())
  }, [dispatch])

  return (
    <div id='register'>
      <h2>Reactgram</h2>
      <p className='subtitle'>Cadastre-se para ver as postagens e fazer parte desta rede!</p>
      
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Nome' value={name || ''} onChange={e => setName(e.target.value)}/>
        <input type='email' placeholder='E-mail' value={email || ''} onChange={e => setEmail(e.target.value)}/>
        <input type='password' placeholder='Senha' value={password || ''} onChange={e => setPassword(e.target.value)}/>
        <input type='password' placeholder='Confirme a Senha' value={confirmPassword || ''} onChange={e => setConfirmPassword(e.target.value)}/>
        {!loading && <input type='submit' value='Cadastrar'/>}
        {loading && <input type='submit' value='Aguarde...' disabled/>}
        {error && <Message message={error} type='error'/>}
      </form>

      <p>
        Já possui conta? <Link to='/login'>Entrar</Link>
      </p>
    </div>
  )
}

export default Register