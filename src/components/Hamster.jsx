import { Box, Button, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import React, { useState, useRef, forwardRef } from "react";
import Header from "./Header";
import { GiSeaDragon } from "react-icons/gi";
import { FaStar } from "react-icons/fa"; // Иконка для карты
import { css } from "@emotion/react";

// Оборачиваем GiSeaDragon в forwardRef
const GiSeaDragonWithRef = forwardRef((props, ref) => (
  <GiSeaDragon {...props} ref={ref} />
));

const MotionIcon = motion(GiSeaDragonWithRef);
const MotionBox = motion(Box);
const MotionText = motion(Box);

const Hamster = () => {
  const [count, setCount] = useState(0); // Счет монет
  const [plusOnes, setPlusOnes] = useState([]);
  const [card, setCard] = useState({
    level: 0,
    upgradeCost: 10, // Начальная стоимость прокачки
    icon: <FaStar size="40px" />
  });
  const [error, setError] = useState(""); // Состояние для ошибки
  const controls = useAnimation();
  const dragonControls = useAnimation();
  const upgradeSound = useRef(new Audio("/upgrade.mp3")); // Загрузка звука для прокачки
  const errorSound = useRef(new Audio("/error.mp3")); // Загрузка звука для ошибки

  // Получаем бонус за тап в зависимости от уровня прокачки
  const getBonus = () => {
    return card.level + 1; // +1 за каждый уровень
  };

  const playUpgradeSound = () => {
    const audio = upgradeSound.current;
    audio.play().catch((e) => console.error(e)); // Воспроизведение звука при успешной прокачке с обработкой ошибки
  };

  const playErrorSound = () => {
    const audio = errorSound.current;
    audio.play().catch((e) => console.error(e)); // Воспроизведение звука ошибки с обработкой ошибки
  };

  const handleTap = () => {
    const bonusValue = getBonus();
    setCount(prevCount => prevCount + bonusValue);
    setRandomPosition();

    // Анимация для круга
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.2, ease: "easeOut" }
    });

    // Анимация для дракона
    dragonControls.start({
      textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
      transition: { duration: 0.2, ease: "easeOut" }
    }).then(() => {
      dragonControls.start({
        textShadow: "0 0 10px rgba(255, 255, 255, 0.4)",
        transition: { duration: 0.5, ease: "easeInOut" }
      });
    });
  };

  // Прокачка карты
  const handleUpgrade = () => {
    if (count >= card.upgradeCost) {
      setCount(prevCount => prevCount - card.upgradeCost);
      setCard(prevCard => ({
        ...prevCard,
        level: prevCard.level + 1,
        upgradeCost: Math.floor(prevCard.upgradeCost * 1.5) // Увеличиваем стоимость прокачки
      }));
      setError(""); // Сброс ошибки
      playUpgradeSound(); // Воспроизведение звука при успешной прокачке
    } else {
      setError("Недостаточно монет для прокачки!");
      playErrorSound(); // Воспроизведение звука ошибки
    }
  };

  const setRandomPosition = () => {
    const radius = 160;
    const angle = Math.random() * 2 * Math.PI;
    const x = Math.cos(angle) * (radius + 30);
    const y = Math.sin(angle) * (radius + 30);
    const id = Date.now();
    setPlusOnes((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setPlusOnes((prev) => prev.filter((item) => item.id !== id));
    }, 2000);
  };

  return (
    <>
      <Header count={count} />
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={"9% auto"}
        css={css`
          backdrop-filter: blur(10px);
        `}
      >
        <MotionBox
          w={"300px"}
          border={"5px solid #0f0847"}
          height={"300px"}
          bgColor={"#30228cd8"}
          borderRadius={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          whileTap={{ scale: 0.9, rotate: 13 }}
          transition={{ type: "spring", stiffness: 300 }}
          onTap={handleTap}
          animate={controls}
          css={css`
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          `}
          _hover={{ boxShadow: "0 0 30px rgba(255, 255, 255, 0.8)" }}
        >
          <MotionIcon
            size={"100px"}
            style={{ backgroundColor: "transparent" }}
            color={"#ffffff"}
            animate={dragonControls}
            initial={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.4)" }}
          />
        </MotionBox>
        {plusOnes.map((plusOne) => (
          <MotionText
            key={plusOne.id}
            position="absolute"
            color="white"
            fontSize="24px"
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              top: `calc(50% + ${plusOne.y}px - 12px)`,
              left: `calc(50% + ${plusOne.x}px - 12px)`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {`+${getBonus()}`}
          </MotionText>
        ))}
        <Box position="absolute" top="10px" left="10px" color="white">
          <Box 
            mb="4" 
            w={"100%"}
            p="4" 
            bgGradient="linear(to-br, teal.300, blue.500)"
            borderRadius="md"
            boxShadow="lg"
            color="white"
            textAlign="center"
          >
            <Box mb="2">
              {card.icon}
            </Box>
            <Text fontSize="xl" mb="2">
              Card Level: {card.level}
            </Text>
            <Text fontSize="lg" mb="4">
              Upgrade Cost: {card.upgradeCost} Coins
            </Text>
            <Button
              colorScheme="teal"
              onClick={handleUpgrade}
              isDisabled={count < card.upgradeCost}
            >
              Upgrade
            </Button>
          </Box>
          {error && (
            <Alert status="error" mt="4">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Ошибка!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Hamster;
