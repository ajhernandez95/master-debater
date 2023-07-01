import { Box, useColorModeValue } from "@chakra-ui/react";
import { keyframes, css } from "@emotion/react";

export const Orb = () => {
  const spin = keyframes`
    100% { 
      transform: rotate(360deg); 
    } 
    `;

  const colorA = useColorModeValue("#7f00ff", "#e100ff");
  const colorB = useColorModeValue("#0071ff", "#00e0ff");
  return (
    <Box
      display="block"
      width={["200px", "300px"]}
      height={["200px", "300px"]}
      borderRadius="50%"
      css={css`
        animation: ${spin} 4s linear infinite;
        box-shadow: inset 0 0 50px #fff, inset 20px 0 60px ${colorA},
          inset -20px 0 60px ${colorB}, inset 20px 0 300px ${colorA},
          inset -20px 0 300px ${colorB}, 0 0 50px #fff, -10px 0 60px ${colorA},
          10px 0 60px ${colorB};
      `}
    />
  );
};