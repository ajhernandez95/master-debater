import { Box, useColorModeValue } from "@chakra-ui/react";
import { keyframes, css } from "@emotion/react";

export type Theme = "default" | "genius";
interface OrbProps {
  size?: string | string[];
  theme?: Theme;
}

const defaultOrbProps = {
  size: ["200px", "300px"],
  theme: "default",
};

export const Orb = ({ size, theme }: OrbProps) => {
  const { size: defaultSize } = defaultOrbProps;

  const spin = keyframes`
    100% { 
      transform: rotate(360deg); 
    } 
    `;
  let colorA, colorB, colorC;

  switch (theme) {
    case "genius":
      colorA = "#7f00ff";
      colorB = "#0071ff";
      colorC = "#fff";

      break;
    default:
      colorA = "#ae00ff";
      colorB = "#ff0099";
      colorC = "#ededed";
  }

  const orbCss = css`
  animation: ${spin} 4s linear infinite;
  transition: box-shadow 0.3s ease; // Add transition for box-shadow
  box-shadow: 
    inset 0 0 20px ${colorC}, 
    inset 10px 0 30px ${colorA},
    inset -10px 0 30px ${colorB}, 
    inset 10px 0 150px ${colorA},
    inset -10px 0 150px ${colorB}, 
    0 0 20px ${colorC},
    -5px 0 30px ${colorA},
    5px 0 30px ${colorB};
`;

  return (
    <Box
      display="block"
      width={size || defaultSize}
      height={size || defaultSize}
      borderRadius="50%"
      css={orbCss}
    />
  );
};
