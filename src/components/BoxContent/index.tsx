import { Flex, useMediaQuery } from '@chakra-ui/react';
import React from 'react';

const BoxContent: React.FC = ({ children }) => {
  const [menorQue400] = useMediaQuery('(max-width: 400px)');

  return (
    <Flex
      direction="column"
      border={{ sm: '0px solid #ddd', lg: '1px solid #ddd' }}
      maxHeight="calc(100vh - 170px)"
      minHeight="calc(100vh - 170px)"
      // maxWidth="calc(100vw - 40px)"
      borderRadius="4px"
      p={{ base: '0px', sm: '0px', md: '0px', lg: '20px' }}
      overflowY="scroll"
      // whiteSpace="nowrap"
      // overflowX="scroll"
      bg={{ sm: 'none', md: 'none', lg: '#fcfcfc' }}
      css={{
        '&::-webkit-scrollbar': {
          width: `${menorQue400 ? '0px' : '4px'}`,
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#ccc',
          borderRadius: '24px',
        },
      }}
    >
      {children}
    </Flex>
  );
};

export default BoxContent;
