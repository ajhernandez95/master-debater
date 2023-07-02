import { Box, useColorModeValue } from "@chakra-ui/react";
import { keyframes, css } from "@emotion/react";

interface OrbProps {
  size?: string | string[];
}

const defaultOrbProps = {
  size: ["200px", "300px"],
};

export const Orb = ({ size }: OrbProps) => {
  const { size: defaultSize } = defaultOrbProps;

  const spin = keyframes`
    100% { 
      transform: rotate(360deg); 
    } 
    `;

  const colorA = "#7f00ff";
  const colorB = "#0071ff";
  return (
    <Box
      display="block"
      width={size || defaultSize}
      height={size || defaultSize}
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
