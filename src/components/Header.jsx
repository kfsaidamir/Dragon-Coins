import { Box } from "@chakra-ui/react";
import React from "react";
import { BsCoin } from "react-icons/bs";

const Header = ({ count }) => {
  return (
    <Box w={"100%"} height={"10vh"} >
      <Box display={"flex"} alignItems={"center"} gap={"10px"} justifyContent={"center"} marginTop={"1%"}  >
        <BsCoin fontSize={"50px"} color="#e0d209" />
        <Box  color={"white"}  fontSize={"24px"} >
        {count}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
