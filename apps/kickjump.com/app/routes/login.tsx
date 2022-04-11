import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@kickjump/components';
import { Form, useLocation } from '@remix-run/react';
import { AuthenticityTokenInput } from 'remix-utils';

export default function LoginPage() {
  const location = useLocation();

  return (
    <Container maxW='lg' py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing='8'>
        <Stack spacing='6'>
          <Stack spacing={{ base: '2', md: '3' }} textAlign='center'>
            <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
              Log in to your account
            </Heading>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing='6' as={Form} action={`/auth/github${location.search}`} method='post'>
            <AuthenticityTokenInput />
            <Button variant='solid' type='submit'>
              Login with GitHub <Icon icon='github' color='#181717' />
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
