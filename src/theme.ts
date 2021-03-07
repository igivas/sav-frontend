import { extendTheme } from '@chakra-ui/react';

// Let's say you want to add custom colors

const colors = {
  primary: {
    500: '#48b461',
  },
  red: {
    500: '#E53E3E',
  },
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const theme = extendTheme({ colors });

export default theme;
