-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 10-12-2020 a las 02:26:13
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `projectMMO`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Account`
--

CREATE TABLE `Account` (
  `ID` int(11) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` varchar(25) NOT NULL,
  `Creation_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Account`
--

INSERT INTO `Account` (`ID`, `Email`, `Password`, `Creation_Date`) VALUES
(1, 'prueba', '1234', '2020-02-20'),
(2, 'prueba2', '1234', '2020-02-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Character_Account`
--

CREATE TABLE `Character_Account` (
  `ID` int(11) NOT NULL,
  `ID_Account` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Skin_Base` varchar(25) NOT NULL,
  `Skin_Hair` varchar(25) NOT NULL,
  `Health` int(10) NOT NULL,
  `Level` int(3) NOT NULL,
  `XP` int(10) NOT NULL,
  `Money` int(11) NOT NULL,
  `ID_Map` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Character_Account`
--

INSERT INTO `Character_Account` (`ID`, `ID_Account`, `Name`, `Skin_Base`, `Skin_Hair`, `Health`, `Level`, `XP`, `Money`, `ID_Map`, `X`, `Y`) VALUES
(1, 1, 'Sody', 'H-1', 'H-1', 154, 1, 0, 0, 1, 16, 12),
(2, 2, 'prueba', 'H-1', 'H-1', 154, 1, 0, 0, 1, 16, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Npc`
--

CREATE TABLE `Npc` (
  `ID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Health` int(11) NOT NULL,
  `Skin` text NOT NULL,
  `Level` int(11) NOT NULL,
  `ID_Map` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `Vision_Distance` int(11) NOT NULL,
  `Reaction` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Npc`
--

INSERT INTO `Npc` (`ID`, `Name`, `Health`, `Skin`, `Level`, `ID_Map`, `X`, `Y`, `Vision_Distance`, `Reaction`) VALUES
(1, 'Pepe', 150, 'pj', 5, 1, 16, 13, 2, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `Character_Account`
--
ALTER TABLE `Character_Account`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `Npc`
--
ALTER TABLE `Npc`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Account`
--
ALTER TABLE `Account`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `Npc`
--
ALTER TABLE `Npc`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
