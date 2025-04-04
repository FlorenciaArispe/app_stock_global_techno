import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react'
import supabase from '../supabase/supabase.service'

function Login({ onLogin }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Usuario o contraseña incorrectos')
      toast({
        title: 'Error de autenticación',
        description: 'Usuario o contraseña incorrectos',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } else {
      onLogin(data.session)
    }
  }

  return (
    <Box
      minH="100vh"
      bg="#0E2640"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        w={{ base: '90%', sm: '400px' }}
        zIndex={1}
      >
        <VStack spacing={6} as="form" onSubmit={handleLogin}>
          <Heading size="lg" color="#154273">
            GLOBAL TECHNOLOGY
          </Heading>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Ingresá tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" w="full">
            Iniciar sesión
          </Button>

          {error && <Text color="red.500">{error}</Text>}
        </VStack>
      </Box>
    </Box>
  )
}

export default Login
