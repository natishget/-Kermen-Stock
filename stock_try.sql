-- phpMyAdmin SQL Dump
-- version 5.2.2deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 21, 2025 at 07:35 AM
-- Server version: 11.8.2-MariaDB-1 from Debian
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stock_try`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `HandleSale` (IN `product_id` INT, IN `sale_quantity` INT, IN `sale_date` DATETIME, IN `Description` VARCHAR(255), IN `Unit_Price` DECIMAL(10,2), IN `customer_name` VARCHAR(255), IN `in_color` VARCHAR(255) COLLATE utf8mb4_general_ci, IN `in_isimported` BOOLEAN)   BEGIN
    DECLARE current_quantity INT;
    DECLARE Total_Price DECIMAL(10,2);

    -- Handle case when no row is found
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET current_quantity = NULL;

    -- Calculate total price
    SET Total_Price = sale_quantity * Unit_Price;

    -- Start transaction
    START TRANSACTION;

    -- Get the current quantity from inventory_level
    SELECT Quantity INTO current_quantity
    FROM inventory_level
    WHERE PID = product_id AND Color = in_color AND isImported = in_isimported
    LIMIT 1
    FOR UPDATE;

    -- Check inventory state
    IF current_quantity IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product does not exist in inventory_level';
    ELSEIF current_quantity < sale_quantity THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient quantity in inventory_level';
    ELSE
        -- Record the sale
        INSERT INTO sales (
            PID, Quantity, Date, Description,
            Unit_price, Customer_Name, Total_Price,
            Color, isImported
        )
        VALUES (
            product_id, sale_quantity, sale_date, Description,
            Unit_Price, customer_name, Total_Price,
            in_color, in_isimported
        );

        -- Update inventory
        UPDATE inventory_level
        SET Quantity = Quantity - sale_quantity, Date = NOW()
        WHERE PID = product_id AND Color = in_color AND isImported = in_isimported;

        -- Finish transaction
        COMMIT;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateInventory` (IN `product_id` INT, IN `purchase_quantity` INT, IN `Invoice_No` VARCHAR(255), IN `Unit_Price` DECIMAL(10,2), IN `Description` VARCHAR(255), IN `Seller` VARCHAR(255), IN `Purchase_Date` DATETIME, IN `in_color` VARCHAR(255) COLLATE utf8mb4_general_ci, IN `in_isimported` BOOLEAN)   BEGIN
    DECLARE Total_Price DECIMAL(10, 2);
    DECLARE InventoryCount INT;

    -- Optional: handle errors gracefully
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    -- Compute total price
    SET Total_Price = purchase_quantity * Unit_Price;

    -- Start transaction
    START TRANSACTION;

    -- Check if product exists in inventory_level
    SELECT COUNT(*) INTO InventoryCount
    FROM inventory_level
    WHERE PID = product_id
      AND Color COLLATE utf8mb4_general_ci = in_color
      AND isImported = in_isimported;

    -- Lock row (if exists)
    SELECT * FROM inventory_level
    WHERE PID = product_id
      AND Color COLLATE utf8mb4_general_ci = in_color
      AND isImported = in_isimported
    FOR UPDATE;

    IF InventoryCount > 0 THEN
        -- Update existing inventory
        UPDATE inventory_level
        SET Quantity = Quantity + purchase_quantity,
            `Date` = NOW()
        WHERE PID = product_id
          AND Color COLLATE utf8mb4_general_ci = in_color
          AND isImported = in_isimported;
    ELSE
        -- Insert new inventory record
        INSERT INTO inventory_level (PID, Quantity, `Date`, Color, isImported)
        VALUES (product_id, purchase_quantity, NOW(), in_color, in_isimported);
    END IF;

    -- Insert into purchased_inventory
    INSERT INTO purchased_inventory (
        PID, Quantity, Invoice_No, Unit_Price, `Date`,
        Description, Total_Price, Seller, Color, isImported
    )
    VALUES (
        product_id, purchase_quantity, Invoice_No, Unit_Price, Purchase_Date,
        Description, Total_Price, Seller, in_color, in_isimported
    );

    -- Commit transaction
    COMMIT;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `beginning_inventory`
--

CREATE TABLE `beginning_inventory` (
  `BIID` int(11) NOT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `PID` int(11) DEFAULT NULL,
  `Unit_Price` int(11) DEFAULT NULL,
  `Total_Price` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Color` varchar(255) NOT NULL,
  `isImported` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_level`
--

CREATE TABLE `inventory_level` (
  `ILID` int(11) NOT NULL,
  `PID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Color` varchar(255) NOT NULL,
  `isImported` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_level`
--

INSERT INTO `inventory_level` (`ILID`, `PID`, `Quantity`, `Date`, `Color`, `isImported`) VALUES
(11, 2, 0, '2025-06-29', 'PURPLE', 1),
(12, 2, 1, '2025-07-18', 'ORANGE', 1),
(13, 2, 1, '2025-06-29', 'PURPLE', 0),
(14, 2, 3, '2025-07-18', 'RED', 1),
(15, 3, 6, '2025-07-18', 'ORANGE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `PID` int(11) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Product_name` varchar(255) DEFAULT NULL,
  `Unit_of_measurement` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`PID`, `Description`, `Product_name`, `Unit_of_measurement`) VALUES
(1, 'aluminium plate', 'aluminium plate', 'Pcs'),
(2, 'the first entry', 'panel', 'Pcs'),
(3, 'second entry', 'hand rail', 'Pcs'),
(5, 'L-shaped aluminum bar for framing', 'L', 'Bar'),
(6, 'Right-angle aluminum connector', '90° Ferma', 'Bar'),
(7, 'Oval-shaped aluminum support bar', 'Oval Ferma', 'Bar'),
(8, 'T-shaped aluminum bar for joints', 'T', 'Bar'),
(9, 'Z-shaped aluminum bar for support', 'Z', 'Bar'),
(10, 'Midrail aluminum bar for reinforcement', 'Midrail', 'Bar'),
(11, 'Kick protection aluminum plate', 'Kick plate', 'Bar'),
(12, 'Balancing aluminum component', 'Compensate', 'Bar'),
(13, 'Sliding frame exterior bar', 'Slide Frame ex', 'Bar'),
(14, 'Sliding shatter interior bar', 'Slide Shatter in', 'Bar'),
(15, 'Aluminum cup for sliding mechanism', 'Slide Cup', 'Bar'),
(16, 'Rectangular hollow section bar', '45*45 RHS', 'Bar'),
(17, 'D-shaped aluminum grill bar', 'D-Grill', 'Bar'),
(18, 'Aluminum cladding component', 'Cladd.T', 'Bar'),
(19, 'Right-angle aluminum joint connector', 'Angle connector', 'Pcs'),
(20, 'T-shaped connector for aluminum bars', 'Tee Connector', 'Pcs'),
(21, 'Cross-section aluminum joint connector', 'Tee cross Connector (Cast)', 'Pcs'),
(22, 'Connector for sliding components', 'Sliding connector', 'Pcs'),
(23, 'Secure horizontal door lock', 'Door Lock Horizontal-Type B', 'Set'),
(24, 'Heavy-duty horizontal door lock', 'Door Lock Horizontal-Type A', 'Set'),
(25, 'Handle for curtain wall systems', 'Curtain Wall Handle', 'Pcs'),
(26, 'Support arm for curtain wall', 'Curtain wall Arm', 'Pcs'),
(27, 'Hinge for door or window', 'Hinge', 'Pcs'),
(28, 'Support arm for top opening', 'Arm for top opening', 'Pcs'),
(29, 'Plastic spring for flexible movement', 'Plastic Spring-Plastic', 'Pcs'),
(30, 'Double-wheeled sliding roller', 'Roller-Double wheel', 'Pcs'),
(31, 'Aluminum handle for sliding doors', 'Sliding handle-Aluminum-A', 'Pcs'),
(32, 'Brush for smooth sliding mechanism', 'Sliding Brush', 'Pcs'),
(33, '3mm thick rubber seal gasket', '3mm Seal Gasket', 'Mt'),
(34, '4mm thick rubber seal gasket', '4mm Seal Gasket', 'Mt'),
(35, '5mm thick rubber seal gasket', '5mm Seal Gasket', 'Mt'),
(36, '6mm thick rubber seal gasket', '6mm Seal Gasket', 'Mt'),
(37, '8mm thick rubber seal gasket', '8mm Seal Gasket', 'Mt'),
(38, 'Long Philips head screw', '4.8*80 Philips Screw', 'Pcs'),
(39, 'Self-drilling Philips screw', '4.8*60 Philips Screw self', 'Pcs'),
(40, 'Standard 60mm Philips screw', '4.8*60 Philips Screw normal', 'Pcs'),
(41, '50mm length Philips screw', '4.8*50 Philips Screw', 'Pcs'),
(42, '40mm length Philips screw', '4.8*40 Philips Screw', 'Pcs'),
(43, '30mm length Philips screw', '4.8*30 Philips Screw', 'Pcs'),
(44, '25mm length Philips screw', '4.8*25 Philips Screw', 'Pcs'),
(45, '20mm length Philips screw', '4.8*20 Philips Screw', 'Pcs'),
(46, 'Plastic anchors for fixing screws', 'Fisher 6mm 100pcs/pkt', 'Pkt');

-- --------------------------------------------------------

--
-- Table structure for table `purchased_inventory`
--

CREATE TABLE `purchased_inventory` (
  `PIID` int(11) NOT NULL,
  `PID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Invoice_No` varchar(255) DEFAULT NULL,
  `Unit_Price` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Total_Price` int(11) NOT NULL,
  `Seller` varchar(255) DEFAULT NULL,
  `Color` varchar(255) NOT NULL,
  `isImported` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchased_inventory`
--

INSERT INTO `purchased_inventory` (`PIID`, `PID`, `Quantity`, `Invoice_No`, `Unit_Price`, `Date`, `Description`, `Total_Price`, `Seller`, `Color`, `isImported`) VALUES
(26, 2, 3, '2345', 765, '2025-06-29', 'first purchase', 2295, 'dorkas', 'PURPLE', 1),
(27, 2, 3, '234', 543, '2025-06-29', 'second purchase', 1629, 'zenebe', 'ORANGE', 1),
(28, 2, 3, '987', 324, '2025-06-29', 'third purchase', 972, 'derarar', 'PURPLE', 0),
(29, 2, 3, '765', 123, '2025-06-30', 'fourth purchase', 369, 'neguse', 'ORANGE', 1),
(31, 3, 30, '653', 789, '2025-07-17', 'freiset ijkkjgy', 23670, 'dorka', 'ORANGE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `SID` int(11) NOT NULL,
  `PID` int(11) DEFAULT NULL,
  `Quantity` int(11) NOT NULL,
  `Unit_price` int(11) NOT NULL,
  `Customer_Name` varchar(255) DEFAULT NULL,
  `Date` date NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Total_Price` int(11) NOT NULL,
  `Color` varchar(255) NOT NULL,
  `isImported` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`SID`, `PID`, `Quantity`, `Unit_price`, `Customer_Name`, `Date`, `Description`, `Total_Price`, `Color`, `isImported`) VALUES
(153, 2, 2, 127, 'Dallol', '2025-06-30', 'first sales', 254, 'ORANGE', 1),
(154, 2, 1, 435, 'yenenesh', '2025-06-29', 'trying', 435, 'PURPLE', 0),
(155, 2, 1, 435, 'yenenesh', '2025-06-29', 'trying', 435, 'PURPLE', 0),
(156, 2, 3, 675432, 'fitsum printing', '2025-07-18', 'testing sales', 2026296, 'Orange', 1),
(157, 3, 4, 1234, 'addis life', '2025-07-18', 'zsdgsdfdfghj,', 4936, 'Orange', 1),
(158, 3, 4, 4321, 'yohannes', '2025-07-01', 'sdfsdvsdrf', 17284, 'Orange', 1),
(159, 3, 4, 1200, 'yenenesh', '2025-08-20', 'jkgryftsersefwstrer', 4800, 'ORANGE', 1),
(160, 3, 4, 4500, 'fitsum printing', '2025-05-29', 'alskdjhlasdivukasdilk', 18000, 'ORANGE', 1),
(161, 3, 4, 4567, 'yenenesh', '2025-04-22', 'kjvnsdkjvzxk', 18268, 'ORANGE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `User_Name` varchar(255) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `User_Type` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`User_Name`, `Password`, `Email`, `User_Type`) VALUES
('babi', '$2b$10$v.UxwG.IFmj8dtN06Lc8M.zLKK7Rn2aC0cx8rNu3/bGwo2MqOwwnS', NULL, 'user'),
('natish', '$2b$10$v.UxwG.IFmj8dtN06Lc8M.zLKK7Rn2aC0cx8rNu3/bGwo2MqOwwnS', 'natishget@gmail.com', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `beginning_inventory`
--
ALTER TABLE `beginning_inventory`
  ADD PRIMARY KEY (`BIID`),
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `inventory_level`
--
ALTER TABLE `inventory_level`
  ADD PRIMARY KEY (`ILID`),
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`PID`);

--
-- Indexes for table `purchased_inventory`
--
ALTER TABLE `purchased_inventory`
  ADD PRIMARY KEY (`PIID`),
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`SID`),
  ADD KEY `sales_ibfk_1` (`PID`);

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`User_Name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `beginning_inventory`
--
ALTER TABLE `beginning_inventory`
  MODIFY `BIID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `inventory_level`
--
ALTER TABLE `inventory_level`
  MODIFY `ILID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `purchased_inventory`
--
ALTER TABLE `purchased_inventory`
  MODIFY `PIID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `SID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=163;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `beginning_inventory`
--
ALTER TABLE `beginning_inventory`
  ADD CONSTRAINT `beginning_inventory_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`);

--
-- Constraints for table `inventory_level`
--
ALTER TABLE `inventory_level`
  ADD CONSTRAINT `inventory_level_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`);

--
-- Constraints for table `purchased_inventory`
--
ALTER TABLE `purchased_inventory`
  ADD CONSTRAINT `purchased_inventory_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
