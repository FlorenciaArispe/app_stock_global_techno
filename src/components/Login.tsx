import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
  Image,
  Flex,
} from '@chakra-ui/react'
import supabase from '../supabase/supabase.service'
import { InputGroup, InputRightElement, IconButton } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'


interface LoginProps {
  onLogin: (session: any) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

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
      setError('')
      onLogin(data.session)
    }
  }

  return (
     <Box minH="100vh" bg="#0E2640" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white"  borderRadius="25px" boxShadow="lg" w={{ base: '90%', md: '750px' }}>

        
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="center">
          
          {/* Sección de inputs */}
          <Box flex="1" p={4}>
            <VStack p={4} spacing={6} as="form" onSubmit={handleLogin}>
            <Heading 
        size="100%" 
        color="#154273" 
        display={{ base: 'block', md: 'none' }}
      >
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
  <InputGroup>
    <Input
      type={showPassword ? 'text' : 'password'}
      placeholder="Ingresá tu contraseña"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <InputRightElement>
      <IconButton
        variant="ghost"
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
        onClick={() => setShowPassword(!showPassword)}
        size="sm"
      />
    </InputRightElement>
  </InputGroup>
</FormControl>

              {error && <Text color="red.500">{error}</Text>}

              <Button
                type="submit"
                bg={"#345070"}
                colorScheme="#0E2640"
                width="full"
                isLoading={isLoading}
              >
                Iniciar sesión
              </Button>
            </VStack>
          </Box>

          {/* Sección del logo */}
          <Box flex="1" display="flex" alignItems="center" justifyContent="center"  display={{ base: 'none', md: 'flex' }}>
            <Image
              src="/logo.jpeg" 
              alt="Logo Global Technology"
              boxSize={{ base: '150px', md: '100%' }}
              objectFit="contain"
                borderTopRightRadius="23px"
                borderBottomRightRadius="23px"
                 borderBottomLeftRadius="50px"
            />
          </Box>

        </Flex>
      </Box>
   </Box>
  )
}
