-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 11, 2025 at 12:04 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `user_db_licenta`
--

-- --------------------------------------------------------

--
-- Table structure for table `AcceptedApplication`
--

CREATE TABLE `AcceptedApplication` (
  `id` int(11) NOT NULL,
  `id_thesis` int(11) NOT NULL,
  `faculty` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `id_prof` int(11) NOT NULL,
  `prof_name` varchar(100) NOT NULL,
  `prof_email` varchar(100) NOT NULL,
  `stud_id` int(11) NOT NULL,
  `stud_email` varchar(100) NOT NULL,
  `stud_name` varchar(100) NOT NULL,
  `stud_program` varchar(100) NOT NULL,
  `data` date DEFAULT NULL,
  `origin` varchar(255) DEFAULT 'theses',
  `cover_letter` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Applies`
--

CREATE TABLE `Applies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `id_thesis` int(11) NOT NULL,
  `id_prof` int(11) NOT NULL,
  `prof_name` varchar(255) NOT NULL,
  `id_stud` int(11) NOT NULL,
  `stud_name` varchar(255) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `student_program` varchar(255) NOT NULL,
  `stud_email` varchar(255) NOT NULL,
  `prof_email` varchar(255) NOT NULL,
  `applied_data` date NOT NULL,
  `study_year` int(11) DEFAULT NULL,
  `cover_letter` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `confirmed`
--

CREATE TABLE `confirmed` (
  `id` int(11) NOT NULL,
  `id_thesis` int(11) NOT NULL,
  `id_prof` int(11) NOT NULL,
  `id_stud` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `origin` varchar(255) DEFAULT 'theses',
  `cover_letter` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Facultati`
--

CREATE TABLE `Facultati` (
  `faculty_id` int(11) NOT NULL,
  `nume_facultate` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Facultati`
--

INSERT INTO `Facultati` (`faculty_id`, `nume_facultate`) VALUES
(1, 'Facultatea de Științe Politice, Filosofie și Științe ale Comunicării'),
(2, 'Facultatea de Economie și de Administrare a Afacerilor'),
(3, 'Facultatea de Educație Fizică și Sport'),
(4, 'Facultatea de Drept'),
(5, 'Facultatea de Muzică și Teatru'),
(6, 'Facultatea de Chimie, Biologie, Geografie'),
(7, 'Facultatea de Matematică și Informatică'),
(8, 'Facultatea de Arte și Design'),
(9, 'Facultatea de Sociologie și Psihologie'),
(10, 'Facultatea de Fizică'),
(11, 'Facultatea de Litere, Istorie și Teologie');

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

CREATE TABLE `favorite` (
  `favorite_id` int(11) NOT NULL,
  `id_thesis` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `id_stud` int(11) NOT NULL,
  `id_prof` int(11) NOT NULL,
  `mesaje` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sender` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages_selection`
--

CREATE TABLE `messages_selection` (
  `id` int(11) NOT NULL,
  `stud_id` int(11) NOT NULL,
  `prof_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sender` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profesorii`
--

CREATE TABLE `profesorii` (
  `id` int(11) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gmail_password` varchar(255) DEFAULT NULL,
  `entered` tinyint(1) DEFAULT 0,
  `cv_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profesorii`
--

INSERT INTO `profesorii` (`id`, `faculty`, `email`, `name`, `password`, `gmail_password`, `entered`, `cv_link`) VALUES
(1, 'Facultatea de Matematică și Informatică', 'adriana.tanasie@e-uvt.ro', 'Adriana Tănasie', NULL, NULL, 0, NULL),
(2, 'Facultatea de Matematică și Informatică', 'adrian.craciun@e-uvt.ro', 'Adrian Crăciun', NULL, NULL, 0, NULL),
(3, 'Facultatea de Matematică și Informatică', 'adrian.spataru@e-uvt.ro', 'Adrian Spătaru', NULL, NULL, 0, 'https://drive.google.com/file/d/1T9zmexCU9zb_51f4yhO8R92y79zd1LpK/view?usp=drive_link'),
(4, 'Facultatea de Matematică și Informatică', 'adriana.popovici@e-uvt.ro', 'Adriana Popovici', NULL, NULL, 0, 'https://drive.google.com/file/d/1c5dhuo17_mLSanCm3P2z1goyV6fGzLS9/view?usp=drive_link'),
(5, 'Facultatea de Matematică și Informatică', 'alexandra.fortis@e-uvt.ro', 'Alexandra Fortiș', NULL, NULL, 0, 'https://drive.google.com/file/d/1guFht4Dda5wbx7XVhieqVX1mlQJawSVw/view?usp=drive_link'),
(6, 'Facultatea de Matematică și Informatică', 'alexandru.munteanu@e-uvt.ro', 'Alexandru Munteanu', NULL, NULL, 0, NULL),
(7, 'Facultatea de Matematică și Informatică', 'ciprian.pungila@e-uvt.ro', 'Ciprian Pungilă', NULL, NULL, 0, 'http://info.uvt.ro/wp-content/uploads/2022/03/Academic_Curriculum_Vitae-_Ciprian_Pungila.pdf'),
(8, 'Facultatea de Matematică și Informatică', 'cosmin.bonchis@e-uvt.ro', 'Cosmin Bonchiș', NULL, NULL, 0, 'https://drive.google.com/file/d/1aUNJzOHm4-ag_OPBbnVd0zGJ02n2HvV7/view?usp=drive_link'),
(9, 'Facultatea de Matematică și Informatică', 'cristian.cira@e-uvt.ro', 'Cristian Cira', NULL, NULL, 0, NULL),
(10, 'Facultatea de Matematică și Informatică', 'daniel.pop@e-uvt.ro', 'Daniel Pop', NULL, NULL, 0, 'https://drive.google.com/file/d/1XdqClkciEbzV5N5Ljt0gwWuNZkvpS6sO/view?usp=drive_link'),
(11, 'Facultatea de Matematică și Informatică', 'daniela.zaharie@e-uvt.ro', 'Daniela Zaharie', NULL, NULL, 0, 'https://drive.google.com/file/d/1ZBYiPkAVJdkzpJdJSbiP_uD3s_8kYX2f/view?usp=drive_link'),
(12, 'Facultatea de Matematică și Informatică', 'dana.petcu@e-uvt.ro', 'Dana Petcu', NULL, NULL, 0, 'https://drive.google.com/file/d/1Ig0ZLkaOZCv-DR85Z8cgf8afFuToBmrw/view?usp=drive_link'),
(13, 'Facultatea de Matematică și Informatică', 'darian.onchis@e-uvt.ro', 'Darian Onchiș', NULL, NULL, 0, 'https://drive.google.com/file/d/1cEg8etrdsDIyAQmT9CjXG2rnIOblamHD/view?usp=drive_link'),
(14, 'Facultatea de Matematică și Informatică', 'eva.kaslik@e-uvt.ro', 'Eva Kaslik', NULL, NULL, 0, 'https://drive.google.com/file/d/1QbQ2mrRngA427j2mnr9_NZ1doQoHlR_s/view?usp=drive_link'),
(15, 'Facultatea de Matematică și Informatică', 'darius.galis@e-uvt.ro', 'Darius Galiș', NULL, NULL, 0, NULL),
(16, 'Facultatea de Matematică și Informatică', 'flavia.micota@e-uvt.ro', 'Flavia Micota', NULL, NULL, 0, 'https://drive.google.com/file/d/1hzCeiIrJxFQbqX_roioRE9n48JWXM7FM/view?usp=drive_link'),
(17, 'Facultatea de Matematică și Informatică', 'florin.fortis@e-uvt.ro', 'Florin Fortiș', NULL, NULL, 0, 'https://drive.google.com/file/d/1yi904xKsOHtHbyLIJJkhPmdSU-2fltlM/view?usp=drive_link'),
(18, 'Facultatea de Matematică și Informatică', 'florin.rosu@e-uvt.ro', 'Florin Rosu', NULL, NULL, 0, NULL),
(19, 'Facultatea de Matematică și Informatică', 'iuhasz.gabriel@e-uvt.ro', 'Gabriel Iuhasz', NULL, NULL, 0, NULL),
(20, 'Facultatea de Matematică și Informatică', 'horia.popa@e-uvt.ro', 'Horia Popa Andreescu', NULL, NULL, 0, NULL),
(21, 'Facultatea de Matematică și Informatică', 'ioan.dragan@e-uvt.ro', 'Ioan Drăgan', NULL, NULL, 0, 'https://drive.google.com/file/d/102bF-_h0-TXtDFfVJzop0eFusNIjWfPA/view?usp=drive_link'),
(22, 'Facultatea de Matematică și Informatică', 'isabela.dramnesc@e-uvt.ro', 'Isabela Drămnesc', NULL, NULL, 0, 'https://drive.google.com/file/d/1WaWVzF5ukQHIEDNyN-HB5rT0V8gxPQ7P/view?usp=drive_link'),
(23, 'Facultatea de Matematică și Informatică', 'laurentiu.coroban@e-uvt.ro', 'Laurențiu Coroban', NULL, NULL, 0, 'https://drive.google.com/file/d/1ixQci50mcUT4lf6LeyhuxrcsvRvQJDXA/view?usp=drive_link'),
(24, 'Facultatea de Matematică și Informatică', 'liviu.mafteiu@e-uvt.ro', 'Liviu Mafteiu – Scai', NULL, NULL, 0, 'https://drive.google.com/file/d/105FBLT9Wb1Y6ZXWuIqVII32nS5KGqqPy/view?usp=drive_link'),
(25, 'Facultatea de Matematică și Informatică', 'madalina.erascu@e-uvt.ro', 'Mădălina Erașcu', NULL, NULL, 0, NULL),
(26, 'Facultatea de Matematică și Informatică', 'marc.frincu@e-uvt.ro', 'Marc Frîncu', NULL, NULL, 0, 'https://drive.google.com/file/d/1Hri_oGaNJxxOum-CeTU0lkOkT8BBfFiJ/view?usp=drive_link'),
(27, 'Facultatea de Matematică și Informatică', 'mario.reja@e-uvt.ro', 'Mario Reja', NULL, NULL, 0, NULL),
(28, 'Facultatea de Matematică și Informatică', 'mircea.dragan@e-uvt.ro', 'Mircea Drăgan', NULL, NULL, 0, NULL),
(29, 'Facultatea de Matematică și Informatică', 'mihai.chis@e-uvt.ro', 'Mihai Chiș', NULL, NULL, 0, NULL),
(30, 'Facultatea de Matematică și Informatică', 'mihail.gaianu@e-uvt.ro', 'Mihail Găianu', NULL, NULL, 0, NULL),
(31, 'Facultatea de Matematică și Informatică', 'raluca.muresan@e-uvt.ro', 'Raluca Mureșan', NULL, NULL, 0, NULL),
(32, 'Facultatea de Matematică și Informatică', 'mircea.marin@e-uvt.ro', 'Mircea Marin', NULL, NULL, 0, 'https://drive.google.com/file/d/1iv440xKsOHtHbyLIJJkhPmdSU-2fltlM/view?usp=drive_link'),
(33, 'Facultatea de Matematică și Informatică', 'monica.tirea@e-uvt.ro', 'Monica Sancira', NULL, NULL, 0, 'https://drive.google.com/file/d/1DyJBZJNbaGavBGsvOk-Y9GHUf3hBBWwU/view?usp=drive_link'),
(34, 'Facultatea de Matematică și Informatică', 'todor.ivascu@e-uvt.ro', 'Todor Ivașcu', NULL, NULL, 0, 'https://drive.google.com/file/d/1yGWolo7IGoBJSTJdfy-jrWHDQRvGV2pb/view?usp=drive_link'),
(35, 'Facultatea de Matematică și Informatică', 'sebastian.stefaniga@e-uvt.ro', 'Sebastian Ștefănigă', NULL, NULL, 0, 'https://drive.google.com/file/d/1O7C-M35emxsyYgkdqV99FdlV5dUH_knW/view?usp=drive_link'),
(38, 'Facultatea de Științe Politice, Filosofie și Științe ale Comunicării', 'andreisv178@gmail.com', 'Andrei Sviridov', NULL, NULL, 1, NULL),
(44, 'Informatica', 'email', 'Ion Popescu', 'hashedPassword1', 'gmailPassword1', 1, 'https://link-cv1.com'),
(45, 'Matematica', 'test_email', 'Maria Ionescu', 'hashedPassword2', 'gmailPassword2', 0, 'https://link-cv2.com');

-- --------------------------------------------------------

--
-- Table structure for table `profesorii_neverificati`
--

CREATE TABLE `profesorii_neverificati` (
  `id` int(11) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gmail_password` varchar(255) DEFAULT NULL,
  `entered` tinyint(1) DEFAULT 0,
  `cv_link` varchar(255) DEFAULT NULL,
  `prof` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ProgrameStudii`
--

CREATE TABLE `ProgrameStudii` (
  `program_id` int(11) NOT NULL,
  `nume_program` varchar(255) NOT NULL,
  `tip_program` enum('licenta','masterat') NOT NULL,
  `faculty_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ProgrameStudii`
--

INSERT INTO `ProgrameStudii` (`program_id`, `nume_program`, `tip_program`, `faculty_id`) VALUES
(138, 'Administrație publică', 'licenta', 1),
(139, 'Comunicare și relații publice', 'licenta', 1),
(140, 'Filosofie', 'licenta', 1),
(141, 'Jurnalism', 'licenta', 1),
(142, 'Media digitală', 'licenta', 1),
(143, 'Publicitate', 'licenta', 1),
(144, 'Relații internaționale și studii europene', 'licenta', 1),
(145, 'Științe politice', 'licenta', 1),
(146, 'Studii de securitate', 'licenta', 1),
(147, 'Comunicare publicitară în medii digitale', 'masterat', 1),
(148, 'Comunicare și mediere în conflicte sociale', 'masterat', 1),
(149, 'International development and management of global affairs', 'masterat', 1),
(150, 'Mass media și relații publice. Tehnici de redactare și comunicare', 'masterat', 1),
(151, 'Philosophical counselling and consultancy', 'masterat', 1),
(152, 'Politici publice și advocacy', 'masterat', 1),
(153, 'Studii de securitate globală', 'masterat', 1),
(154, 'Economia, comerţului, turismului şi serviciilor (IF)', 'licenta', 2),
(155, 'Contabilitate şi informatică de gestiune (IF - în limba română)', 'licenta', 2),
(156, 'Contabilitate şi informatică de gestiune (IF - în limba germană)', 'licenta', 2),
(157, 'Contabilitate şi informatică de gestiune (ID)', 'licenta', 2),
(158, 'Economie generală şi comunicare economică (IF)', 'licenta', 2),
(159, 'Economie și afaceri internaționale (IF)', 'licenta', 2),
(160, 'Finanţe și bănci (IF – în limba română)', 'licenta', 2),
(161, 'Finanţe și bănci (IF – în limba engleză)', 'licenta', 2),
(162, 'Finanţe și bănci (ID)', 'licenta', 2),
(163, 'Management (IF – în limba română)', 'licenta', 2),
(164, 'Management (IF – în limba franceză)', 'licenta', 2),
(165, 'Management (ID)', 'licenta', 2),
(166, 'Marketing (IF)', 'licenta', 2),
(167, 'Informatică economică (IF)', 'licenta', 2),
(168, 'Administrarea afacerilor în turism și industria ospitalității', 'masterat', 2),
(169, 'Auditul și managementul financiar al fondurilor europene', 'masterat', 2),
(170, 'Audit financiar-contabil', 'masterat', 2),
(171, 'Expertiză contabilă și evaluarea afacerilor', 'masterat', 2),
(172, 'Contabilitate, control și guvernanță', 'masterat', 2),
(173, 'Contabilitate și audit în instituțiile publice', 'masterat', 2),
(174, 'Studii europene și economia integrării', 'masterat', 2),
(175, 'Management și integrare europeană', 'masterat', 2),
(176, 'Guvernanță organizațională și consultanță fiscală', 'masterat', 2),
(177, 'Piețe financiare, bănci și asigurări', 'masterat', 2),
(178, 'Master in Sustainable Finance', 'masterat', 2),
(179, 'Sisteme informaționale pentru afaceri', 'masterat', 2),
(180, 'Administrarea organizațiilor de afaceri', 'masterat', 2),
(181, 'Diagnostic, evaluare și consultanță în afaceri', 'masterat', 2),
(182, 'Global entrepreneurship, economics and management', 'masterat', 2),
(183, 'Le management des affaires en contexte europeen', 'masterat', 2),
(184, 'Le management des affaires en contexte europeen (IFR)', 'masterat', 2),
(185, 'Managementul resurselor umane', 'masterat', 2),
(186, 'Managementul strategic al organizațiilor. Dezvoltarea spațiului de afaceri', 'masterat', 2),
(187, 'Management of business organizations', 'masterat', 2),
(188, 'Marketing și managementul vânzărilor', 'masterat', 2),
(189, 'Publicitate și promovarea vânzărilor', 'masterat', 2),
(190, 'Marketing strategic și marketing digital', 'masterat', 2),
(191, 'Educație fizică și sportivă', 'licenta', 3),
(192, 'Educație fizică și sportivă (învățământ cu frecvență redusă)', 'licenta', 3),
(193, 'Kinetoterapie și motricitate specială', 'licenta', 3),
(194, 'Sport și performanță motrică', 'licenta', 3),
(195, 'Educație fizică și sportivă', 'masterat', 3),
(196, 'Fitness și performanță motrică', 'masterat', 3),
(197, 'Managementul activităților și organizațiilor de educație fizică și sportive', 'masterat', 3),
(198, 'Kinetoterapie în patologia ortopedico-traumatică', 'masterat', 3),
(199, 'Kinetoprofilaxie și recuperare fizică', 'masterat', 3),
(200, 'Masterat didactic în Educație fizică și sport', 'masterat', 3),
(201, 'Drept (învățământ cu frecvență)', 'licenta', 4),
(202, 'Drept (învățământ cu frecvență redusă)', 'licenta', 4),
(203, 'Drept european și internațional (bilingv română-engleză) (învățământ cu frecvență)', 'licenta', 4),
(204, 'Dreptul afacerilor (învățământ cu frecvență)', 'masterat', 4),
(205, 'Drept fiscal (învățământ cu frecvență redusă)', 'masterat', 4),
(206, 'Științe penale (învățământ cu frecvență)', 'masterat', 4),
(207, 'Dreptul Uniunii Europene/European Union Law (învățământ cu frecvență)', 'masterat', 4),
(208, 'Carieră judiciară (învățământ cu frecvență)', 'masterat', 4),
(209, 'Contenciosul administrativ și fiscal (învățământ cu frecvență)', 'masterat', 4),
(210, 'Interpretare muzicală - instrumente', 'licenta', 5),
(211, 'Interpretare muzicală - canto', 'licenta', 5),
(212, 'Muzică', 'licenta', 5),
(213, 'Artele spectacolului (actorie)', 'licenta', 5),
(214, 'Artele spectacolului (actorie) (în limba germană)', 'licenta', 5),
(215, 'Stilistica interpretării muzicale', 'masterat', 5),
(216, 'Artele spectacolului de teatru', 'masterat', 5),
(217, 'Biologie', 'licenta', 6),
(218, 'Biochimie', 'licenta', 6),
(219, 'Chimie', 'licenta', 6),
(220, 'Chimie medicală', 'licenta', 6),
(221, 'Geografie', 'licenta', 6),
(222, 'Geografia turismului', 'licenta', 6),
(223, 'Geoinformatică', 'licenta', 6),
(224, 'Planificare teritorială', 'licenta', 6),
(225, 'Științe aplicate în criminalistică', 'licenta', 6),
(226, 'Biologia dezvoltării și influența factorilor exogeni asupra organismelor', 'masterat', 6),
(227, 'Masterat didactic în Biologie', 'masterat', 6),
(228, 'Chimie clinică şi de laborator sanitar', 'masterat', 6),
(229, 'Chimie criminalistică', 'masterat', 6),
(230, 'Masterat didactic în Chimie', 'masterat', 6),
(231, 'Planificarea şi dezvoltarea durabilă a teritoriului', 'masterat', 6),
(232, 'Dezvoltare şi amenajare turistică', 'masterat', 6),
(233, 'Geografia resurselor naturale', 'masterat', 6),
(234, 'Informatică', 'licenta', 7),
(235, 'Matematică', 'licenta', 7),
(236, 'Matematică informatică', 'licenta', 7),
(237, 'Informatică (în limba engleză)', 'licenta', 7),
(238, 'Inteligență artificială (în limba engleză)', 'licenta', 7),
(239, 'Informatica (forma de învățământ la distanță)', 'licenta', 7),
(240, 'Modelări analitice şi geometrice ale sistemelor', 'masterat', 7),
(241, 'Matematici financiare', 'masterat', 7),
(242, 'Artificial Intelligence and Distributed Computing (în limba engleză)', 'masterat', 7),
(243, 'Intelligent Software Robotics (în limba engleză)', 'masterat', 7),
(244, 'Inginerie software', 'masterat', 7),
(245, 'Big Data – Data Science, Analytics and Technologies (în limba engleză)', 'masterat', 7),
(246, 'Bioinformatică', 'masterat', 7),
(247, 'Cybersecurity (în limba engleză)', 'masterat', 7),
(248, 'Arte plastice (fotografie - videoprocesare computerizată a imaginii)', 'licenta', 8),
(249, 'Arte plastice (Pictură)', 'licenta', 8),
(250, 'Arte plastice (Grafică)', 'licenta', 8),
(251, 'Arte plastice (Sculptură)', 'licenta', 8),
(252, 'Arte decorative (rute: Ceramică, Arte textile)', 'licenta', 8),
(253, 'Conservare și restaurare', 'licenta', 8),
(254, 'Design (rute: Design grafic, Design de produs, Design de interior)', 'licenta', 8),
(255, 'Modă - design vestimentar', 'licenta', 8),
(256, 'Design interior și de produs', 'masterat', 8),
(257, 'Design grafic – Comunicare vizuală', 'masterat', 8),
(258, 'Design vestimentar – Design textil', 'masterat', 8),
(259, 'Foto video', 'masterat', 8),
(260, 'Grafică publicitară și de carte', 'masterat', 8),
(261, 'Patrimoniu, restaurare și curatoriat în artele vizuale', 'masterat', 8),
(262, 'Sculptură și ceramică', 'masterat', 8),
(263, 'Pictură - Surse și resurse ale imaginii', 'masterat', 8),
(264, 'Artă eclezială și restaurare', 'masterat', 8),
(265, 'Game Art (în limba engleză)', 'masterat', 8),
(266, 'Asistență socială cu frecvență română', 'licenta', 9),
(267, 'Asistență socială la distanță română', 'licenta', 9),
(268, 'Psihologie', 'licenta', 9),
(269, 'Psihologie – Științe cognitive (în limba engleză) cu frecvență engleză', 'licenta', 9),
(270, 'Sociologie cu frecvență română', 'licenta', 9),
(271, 'Resurse umane cu frecvență română', 'licenta', 9),
(272, 'Pedagogie română', 'licenta', 9),
(273, 'Pedagogia învățământului primar și preșcolar', 'licenta', 9),
(274, 'Psihopedagogie specială', 'licenta', 9),
(275, 'Management și supervizare în bunăstarea copilului și a familiei', 'masterat', 9),
(276, 'Asistență socială', 'masterat', 9),
(277, 'Psihologia muncii, psihologie organizațională și a transporturilor', 'masterat', 9),
(278, 'Psihologie clinică și psihoterapie', 'masterat', 9),
(279, 'Antreprenoriat social și dezvoltare comunitară', 'masterat', 9),
(280, 'Sociologie', 'masterat', 9),
(281, 'Managementul resurselor umane în administrarea organizațiilor', 'masterat', 9),
(282, 'Management educațional și dezvoltare curriculară', 'masterat', 9),
(283, 'Consiliere și integrare educațională', 'masterat', 9),
(284, 'Terapii specifice ale limbajului și comunicării', 'masterat', 9),
(285, 'Fizică', 'licenta', 10),
(286, 'Fizică medicală', 'licenta', 10),
(287, 'Fizică informatică', 'licenta', 10),
(288, 'Fizică aplicată în medicină', 'masterat', 10),
(289, 'Advanced research methods in physics', 'masterat', 10),
(290, 'Masterat didactic în Fizică', 'masterat', 10),
(291, 'TEOLOGIE ORTODOXĂ PASTORALĂ', 'licenta', 11),
(292, 'LIMBĂ ȘI LITERATURĂ', 'licenta', 11),
(293, 'Literatură şi cultură - contexte româneşti, contexte europene', 'masterat', 11),
(294, 'Tendinţe actuale în studiul limbii române', 'masterat', 11),
(295, 'Teoria şi practica traducerii (engleză și franceză)', 'masterat', 11),
(296, 'Studii americane', 'masterat', 11),
(297, 'Studii romanice culturale şi lingvistice (latină, franceză, italiană, spaniolă)', 'masterat', 11),
(298, 'Germana în context european - studii interdisciplinare şi multiculturale', 'masterat', 11),
(299, 'Digital Technologies for Language Research and Applications', 'masterat', 11),
(300, 'Istorie conceptuală românească în context european', 'masterat', 11),
(301, 'Teologie Ortodoxă și Misiune Creștină', 'masterat', 11);

-- --------------------------------------------------------

--
-- Table structure for table `Propouses`
--

CREATE TABLE `Propouses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `study_program` varchar(255) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `prof_id` int(11) NOT NULL,
  `prof_name` varchar(255) NOT NULL,
  `stud_name` varchar(255) NOT NULL,
  `stud_email` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `motivation` text DEFAULT NULL,
  `state` varchar(255) DEFAULT 'waiting',
  `date` datetime DEFAULT current_timestamp(),
  `stud_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentii`
--

CREATE TABLE `studentii` (
  `id` int(11) NOT NULL,
  `Faculty` varchar(255) NOT NULL,
  `ProgramStudy` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `gmail_pass` varchar(255) DEFAULT NULL,
  `prof` tinyint(1) DEFAULT 0,
  `thesis_confirmed` int(11) DEFAULT 0,
  `study_year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentii`
--

INSERT INTO `studentii` (`id`, `Faculty`, `ProgramStudy`, `name`, `email`, `pass`, `gmail_pass`, `prof`, `thesis_confirmed`, `study_year`) VALUES
(35, 'Faculty', 'ProgramStudy', 'admin', 'admin', '$2b$10$fAU5v8S2AhkRK213KLGNdOzeGTw6DdBMShwZWdzMgNm5yxW5qxQP6', NULL, 3, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `theses`
--

CREATE TABLE `theses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `faculty` varchar(100) NOT NULL,
  `prof_id` int(11) NOT NULL,
  `prof_name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `requirements` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `state` varchar(50) NOT NULL,
  `cv_link` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `limita` int(11) DEFAULT NULL,
  `isLetterRequired` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AcceptedApplication`
--
ALTER TABLE `AcceptedApplication`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Applies`
--
ALTER TABLE `Applies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `confirmed`
--
ALTER TABLE `confirmed`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Facultati`
--
ALTER TABLE `Facultati`
  ADD PRIMARY KEY (`faculty_id`);

--
-- Indexes for table `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`favorite_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages_selection`
--
ALTER TABLE `messages_selection`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profesorii`
--
ALTER TABLE `profesorii`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Indexes for table `profesorii_neverificati`
--
ALTER TABLE `profesorii_neverificati`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ProgrameStudii`
--
ALTER TABLE `ProgrameStudii`
  ADD PRIMARY KEY (`program_id`),
  ADD KEY `faculty_id` (`faculty_id`);

--
-- Indexes for table `Propouses`
--
ALTER TABLE `Propouses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `studentii`
--
ALTER TABLE `studentii`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `theses`
--
ALTER TABLE `theses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AcceptedApplication`
--
ALTER TABLE `AcceptedApplication`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=243;

--
-- AUTO_INCREMENT for table `Applies`
--
ALTER TABLE `Applies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=377;

--
-- AUTO_INCREMENT for table `confirmed`
--
ALTER TABLE `confirmed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `Facultati`
--
ALTER TABLE `Facultati`
  MODIFY `faculty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `favorite`
--
ALTER TABLE `favorite`
  MODIFY `favorite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `messages_selection`
--
ALTER TABLE `messages_selection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `profesorii`
--
ALTER TABLE `profesorii`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `profesorii_neverificati`
--
ALTER TABLE `profesorii_neverificati`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `ProgrameStudii`
--
ALTER TABLE `ProgrameStudii`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=302;

--
-- AUTO_INCREMENT for table `Propouses`
--
ALTER TABLE `Propouses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `studentii`
--
ALTER TABLE `studentii`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `theses`
--
ALTER TABLE `theses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ProgrameStudii`
--
ALTER TABLE `ProgrameStudii`
  ADD CONSTRAINT `programestudii_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `Facultăți` (`faculty_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
