import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RemixLink, useLocation } from '@remix-run/react';
import { AiOutlineClose, AiTwotoneThunderbolt } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { BsBook, BsCheckCircle } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';

import { Logo } from '~/components/icons';
import { useOptionalUser } from '~/hooks/use-user';
import { addNextUrlToQuery } from '~/utils/core';

const webLinks = [
  { name: `About`, path: `/about` },
  // { name: `Blog`, path: `/blog` },
];

const mobileLinks = [
  { name: `About`, path: `/about` },
  { name: `Tech Stack`, path: `/tech-stack` },
  { name: `Achievements`, path: `/achievements` },
];

const dropdownLinks = [
  { name: `Tech Stack`, path: `/tech-stack` },
  { name: `Achievements`, path: `/achievements` },
];

interface NavLinkProps {
  index?: number;
  name: string;
  path: string;
  onClose: () => void;
}

const NavLink = (props: NavLinkProps) => {
  const location = useLocation();
  const link = {
    bg: useColorModeValue(`gray.200`, `gray.900`),
    color: useColorModeValue(`blue.500`, `blue.200`),
  };

  return (
    <Link
      px={2}
      py={1}
      as={RemixLink}
      to={props.path}
      rounded={`md`}
      _hover={{
        textDecoration: `none`,
        bg: link.bg,
      }}
      bg={location.pathname === props.path ? link.bg : `transparent`}
      color={location.pathname === props.path ? link.color : `inherit`}
      onClick={() => props.onClose()}
    >
      {props.name}
    </Link>
  );
};

interface MenuLinkProps {
  name: string;
  path: string;
  color: string;
  bg: string;
  rPath: string;
  onClose: () => void;
}

const MenuLink = (props: MenuLinkProps) => {
  const iconsObj = {
    '/tech-stack': <Icon as={AiTwotoneThunderbolt} size={18} color={props.color} />,
    '/open-source': <Icon as={BsBook} size={18} color={props.color} />,
    // '/developer-story': <Icon as={MdTimeline} size={18} color={props.color} />,
    '/achievements': <Icon as={BsCheckCircle} size={18} color={props.color} />,
  };

  return (
    <Link as={RemixLink} to={props.path} onClick={() => props.onClose}>
      <MenuItem
        color={props.rPath === props.path ? props.color : undefined}
        bg={props.rPath === props.path ? props.bg : undefined}
      >
        <HStack>
          {iconsObj[props.path as keyof typeof iconsObj]}
          <Text>{props.name}</Text>
        </HStack>
      </MenuItem>
    </Link>
  );
};

export function Header() {
  const user = useOptionalUser();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nextUrl = ['/login', '/join'].some((path) => location.pathname.startsWith(path))
    ? ''
    : location.pathname;

  const menuProps = {
    bg: useColorModeValue(`gray.200`, `gray.900`),
    color: useColorModeValue(`blue.500`, `blue.200`),
  };

  return (
    <>
      <Box
        bg={useColorModeValue(`white`, `gray.700`)}
        px={4}
        boxShadow={`lg`}
        width='100%'
        zIndex={55}
        as='header'
      >
        <Flex
          className='h-16'
          // h={16}
          alignItems={`center`}
          justifyContent={`space-between`}
          w={[`90%`, `85%`, `80%`]}
          maxW={800}
          mx='auto'
        >
          <IconButton
            size='md'
            icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
            aria-label={`Open Menu`}
            display={[`inherit`, `inherit`, `none`]}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={`center`}>
            <Box>
              <RemixLink to='/'>
                <Logo size={40} />
              </RemixLink>
            </Box>
            <HStack as={`nav`} spacing={4} display={{ base: `none`, md: `flex` }}>
              {webLinks.map((link, index) => (
                <NavLink key={index} name={link.name} path={link.path} onClose={onClose} />
              ))}
              <Menu autoSelect={false} isLazy>
                {({ onClose }) => (
                  <>
                    <MenuButton
                      as={Button}
                      variant='ghost'
                      size='sm'
                      px={2}
                      py={1.5}
                      fontSize={`1em`}
                      rounded={`md`}
                      height={`auto `}
                      _hover={menuProps}
                      _expanded={menuProps}
                      _focus={{ boxShadow: `none` }}
                      rightIcon={<BiChevronDown size={18} />}
                    >
                      Links
                    </MenuButton>
                    <MenuList zIndex={5}>
                      {dropdownLinks.map((link, index) => (
                        <MenuLink
                          key={index}
                          path={link.path}
                          name={link.name}
                          onClose={onClose}
                          color={menuProps.color}
                          bg={menuProps.bg}
                          rPath={location.pathname}
                        />
                      ))}
                    </MenuList>
                  </>
                )}
              </Menu>
            </HStack>
          </HStack>
          <Flex alignItems={`center`}>
            {user ? null : (
              <>
                <Button variant='ghost' as={RemixLink} to={addNextUrlToQuery('/login', nextUrl)}>
                  Login
                </Button>
                <Button variant='ghost' as={RemixLink} to={addNextUrlToQuery('/join', nextUrl)}>
                  Join
                </Button>
              </>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box
            pb={4}
            w={[`100%`, `100%`, `80%`]}
            maxW={800}
            display={[`inherit`, `inherit`, `none`]}
          >
            <Stack as={`nav`} spacing={4}>
              {mobileLinks.map((link, index) => (
                <NavLink
                  key={index}
                  index={index}
                  name={link.name}
                  path={link.path}
                  onClose={onClose}
                />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
