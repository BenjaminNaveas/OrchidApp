-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2024 a las 02:02:33
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `orchid_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `environmental_records`
--

CREATE TABLE `environmental_records` (
  `id` int(11) NOT NULL,
  `sensor_id` int(11) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `zone` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `environmental_records`
--

INSERT INTO `environmental_records` (`id`, `sensor_id`, `value`, `recorded_at`, `zone`, `user_id`) VALUES
(193, 1, 42.30, '2024-12-01 22:25:49', NULL, NULL),
(194, 2, 57.10, '2024-12-01 22:25:49', NULL, NULL),
(195, 3, 23.78, '2024-12-01 22:25:49', NULL, NULL),
(196, 1, 40.13, '2024-12-02 02:25:08', NULL, NULL),
(197, 2, 55.53, '2024-12-02 02:25:08', NULL, NULL),
(198, 3, 82.77, '2024-12-02 02:25:08', NULL, NULL),
(199, 1, 71.35, '2024-12-02 02:27:30', NULL, NULL),
(200, 2, 92.68, '2024-12-02 02:27:30', NULL, NULL),
(201, 3, 86.76, '2024-12-02 02:27:30', NULL, NULL),
(202, 1, 69.72, '2024-12-02 02:27:31', NULL, NULL),
(203, 2, 20.16, '2024-12-02 02:27:31', NULL, NULL),
(204, 3, 77.10, '2024-12-02 02:27:31', NULL, NULL),
(205, 1, 77.23, '2024-12-02 02:27:36', NULL, NULL),
(206, 2, 86.14, '2024-12-02 02:27:36', NULL, NULL),
(207, 3, 33.74, '2024-12-02 02:27:36', NULL, NULL),
(208, 1, 9.02, '2024-12-02 02:27:48', NULL, NULL),
(209, 2, 8.48, '2024-12-02 02:27:48', NULL, NULL),
(210, 3, 6.90, '2024-12-02 02:27:48', NULL, NULL),
(211, 1, 43.59, '2024-12-02 02:27:50', NULL, NULL),
(212, 2, 95.32, '2024-12-02 02:27:50', NULL, NULL),
(213, 3, 17.22, '2024-12-02 02:27:50', NULL, NULL),
(214, 1, 97.52, '2024-12-02 02:27:50', NULL, NULL),
(215, 2, 46.56, '2024-12-02 02:27:50', NULL, NULL),
(216, 3, 14.35, '2024-12-02 02:27:50', NULL, NULL),
(217, 1, 3.79, '2024-12-02 02:27:51', NULL, NULL),
(218, 2, 34.26, '2024-12-02 02:27:51', NULL, NULL),
(219, 3, 63.30, '2024-12-02 02:27:51', NULL, NULL),
(220, 1, 65.04, '2024-12-02 02:27:51', NULL, NULL),
(221, 2, 41.81, '2024-12-02 02:27:51', NULL, NULL),
(222, 3, 81.10, '2024-12-02 02:27:51', NULL, NULL),
(223, 1, 7.43, '2024-12-02 02:27:52', NULL, NULL),
(224, 2, 33.87, '2024-12-02 02:27:52', NULL, NULL),
(225, 3, 3.55, '2024-12-02 02:27:52', NULL, NULL),
(226, 1, 59.07, '2024-12-02 02:27:58', NULL, NULL),
(227, 2, 7.64, '2024-12-02 02:27:58', NULL, NULL),
(228, 3, 1.36, '2024-12-02 02:27:58', NULL, NULL),
(229, 1, 33.08, '2024-12-02 02:27:59', NULL, NULL),
(230, 2, 68.66, '2024-12-02 02:27:59', NULL, NULL),
(231, 3, 10.43, '2024-12-02 02:27:59', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `irrigation_schedule`
--

CREATE TABLE `irrigation_schedule` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `scheduled_date` date NOT NULL,
  `scheduled_time` time NOT NULL,
  `duration` int(11) NOT NULL,
  `status` enum('pendiente','completado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sensors`
--

CREATE TABLE `sensors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sensors`
--

INSERT INTO `sensors` (`id`, `name`, `type`, `unit`, `created_at`) VALUES
(1, 'Sensor de Temperatura', 'Temperatura', '°C', '2024-11-25 02:11:23'),
(2, 'Sensor de Humedad', 'Humedad', '%', '2024-11-25 02:11:23'),
(3, 'Nivel de Agua', 'Nivel', 'm', '2024-11-25 02:11:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sensor_readings`
--

CREATE TABLE `sensor_readings` (
  `id` int(11) NOT NULL,
  `sensor_id` int(11) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'benja', '$2b$10$W7ZK8M22AYJVd9GGztF8XeciSakoeaBBc.b5YGIU5Oi6YVRMmzDBe'),
(2, 'jorell', '$2b$10$zIG64k89iWK9Fef6t.liAO8poBWpbYWQqsYKpmdOKYC0DjgJL2xD.'),
(3, 'nicolas', '$2b$10$yYWRA48XcyHiALpMEOqa2.Qg/L7/Z9evM9Dg.savHHcS4gLW.tefK'),
(4, 'alejandro', '$2b$10$aOxf.HfE3Qo8OKtWbjTwuu9kPFG6o/G8AOfRo76JiXT7Nrp6QPmQG'),
(5, 'paola', '$2b$10$rYfYgXOWkpDTK01Y91WVLOR2xFmn8xinLyAC84O4yHt//UY7ESi2u');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `environmental_records`
--
ALTER TABLE `environmental_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sensor_id` (`sensor_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `irrigation_schedule`
--
ALTER TABLE `irrigation_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `sensors`
--
ALTER TABLE `sensors`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `environmental_records`
--
ALTER TABLE `environmental_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=232;

--
-- AUTO_INCREMENT de la tabla `irrigation_schedule`
--
ALTER TABLE `irrigation_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `sensors`
--
ALTER TABLE `sensors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sensor_readings`
--
ALTER TABLE `sensor_readings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `environmental_records`
--
ALTER TABLE `environmental_records`
  ADD CONSTRAINT `environmental_records_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `environmental_records_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `irrigation_schedule`
--
ALTER TABLE `irrigation_schedule`
  ADD CONSTRAINT `irrigation_schedule_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD CONSTRAINT `sensor_readings_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
