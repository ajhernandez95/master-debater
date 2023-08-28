import { ResponsiveValue } from "@chakra-ui/react";
import type { Property } from "csstype";

const useStyles = () => {
  const boxStyles = {
    display: "flex",
    justifyContent: "center",
    margin: "20px",
    width: "80%",
    maxWidth: "400px",
  };

  const cardStyles = {
    width: "100%",
  };

  const tabStyles: { fontSize: string[] } = {
    fontSize: ["sm", "md", "md"],
  };

  const formControlStyles: {
    mt: string;
    textAlign: ResponsiveValue<Property.TextAlign>;
  } = {
    mt: "15px",
    textAlign: "left",
  };

  const buttonStyles: { mt: string } = {
    mt: "15px",
  };

  return {
    boxStyles,
    cardStyles,
    tabStyles,
    formControlStyles,
    buttonStyles,
  };
};

export default useStyles;
