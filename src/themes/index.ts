import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";

export const theme = extendTheme({
  fonts: {
    heading: `'Roboto Mono', sans-serif`,
    body: `'Roboto Mono', sans-serif`,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        fontFamily: "body",
        color: mode("whiteAlpha.900", "whiteAlpha.900")(props),
        bg: mode(
          "linear-gradient(73deg, rgba(28,33,45,1) 0%, rgba(11,31,111,1) 35%, rgba(0,97,255,1) 100%)",
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)"
        )(props),
        lineHeight: "base",
      },
    }),
  },
});
