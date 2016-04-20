-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mer 20 Avril 2016 à 23:53
-- Version du serveur :  5.5.47-MariaDB
-- Version de PHP :  5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `MeetingHaters`
--

-- --------------------------------------------------------

--
-- Structure de la table `m2m_user_meeting`
--

CREATE TABLE IF NOT EXISTS `m2m_user_meeting` (
  `_id` int(11) NOT NULL,
  `id_user` varchar(255) NOT NULL,
  `id_meeting` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `expected_status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `meeting`
--

CREATE TABLE IF NOT EXISTS `meeting` (
  `_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `time_pre` datetime DEFAULT NULL,
  `time_start` datetime DEFAULT NULL,
  `time_post` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `mail` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `last_connection` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `m2m_user_meeting`
--
ALTER TABLE `m2m_user_meeting`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_meeting` (`id_meeting`);

--
-- Index pour la table `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`mail`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `m2m_user_meeting`
--
ALTER TABLE `m2m_user_meeting`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `m2m_user_meeting`
--
ALTER TABLE `m2m_user_meeting`
  ADD CONSTRAINT `m2m_user_meeting_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`mail`) ON DELETE CASCADE,
  ADD CONSTRAINT `m2m_user_meeting_ibfk_2` FOREIGN KEY (`id_meeting`) REFERENCES `meeting` (`_id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;