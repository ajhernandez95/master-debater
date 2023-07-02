import { defineStyleConfig, extendTheme } from "@chakra-ui/react";
import { StyleFunctionProps, mode } from "@chakra-ui/theme-tools";

const Button = defineStyleConfig({
  variants: {
    solid: {
      bg: "whiteAlpha.200",
      color: "white",
      _hover: {
        bg: "whiteAlpha.300",
      },
      _active: {
        bg: "whiteAlpha.400",
      },
    },
  },
});

export const theme = extendTheme({
  components: {
    Button,
  },
  fonts: {
    heading: `'Roboto Mono', sans-serif`,
    body: `'Roboto Mono', sans-serif`,
  },
  styles: {
    global: (props: Record<string, any> | StyleFunctionProps) => ({
      body: {
        fontFamily: "body",
        color: "white",
        bg: mode(
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)",
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)"
        )(props),
        background: mode(
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)",
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)"
        )(props),
        backgroundColor: mode(
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)",
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)"
        )(props),
        lineHeight: "base",
      },
      html: {
        bg: mode(
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)",
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)"
        )(props),
        background: mode(
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)",
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)"
        )(props),
        backgroundColor: mode(
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)",
          "linear-gradient(53deg, rgba(26,30,43,1) 0%, rgba(17,19,33,1) 52%, rgba(26,30,43,1) 100%)"
        )(props),
      },
    }),
  },
});
