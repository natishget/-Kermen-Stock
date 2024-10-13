
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `stock_try`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `HandleSale` (IN `product_id` INT, IN `sale_quantity` INT, IN `sale_date` DATETIME, IN `Description` VARCHAR(255), IN `Unit_Price` DECIMAL(10,2), IN `customer_name` VARCHAR(255), IN `color` VARCHAR(25))   BEGIN
    DECLARE current_quantity INT;
    DECLARE Total_Price DECIMAL(10, 2);

    -- Calculate the total price
    SET Total_Price = sale_quantity * Unit_Price;

    -- Start transaction
    START TRANSACTION;

    -- Get the current quantity from inventory_level
    SELECT Quantity INTO current_quantity
    FROM inventory_level
    WHERE PID = product_id AND Color = color
    FOR UPDATE;

    -- Check if sufficient quantity is available
    IF current_quantity IS NULL THEN
        -- Product does not exist in inventory_level
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product does not exist in inventory_level';
    ELSEIF current_quantity < sale_quantity THEN
        -- Insufficient quantity
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient quantity in inventory_level';
    ELSE
        -- Insert into sales table
        INSERT INTO sales (PID, Quantity, Date, Description, Unit_price, Customer_Name, Total_Price, Color)
        VALUES (product_id, sale_quantity, sale_date, Description, Unit_Price, customer_name, Total_Price, color);

        -- Update inventory_level table
        UPDATE inventory_level
        SET Quantity = Quantity - sale_quantity, Date = NOW()
        WHERE PID = product_id AND Color = color;

        -- Commit transaction
        COMMIT;
    END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateInventory` (IN `product_id` INT, IN `purchase_quantity` INT, IN `Invoice_No` VARCHAR(255), IN `Unit_Price` DECIMAL(10,2), IN `Description` VARCHAR(255), IN `Seller` VARCHAR(255), IN `Purchase_Date` DATETIME, IN `color` VARCHAR(25))   BEGIN
    DECLARE Total_Price DECIMAL(10, 2);

    -- Calculate the total price
    SET Total_Price = purchase_quantity * Unit_Price;

    -- Start transaction
    START TRANSACTION;

    -- Lock the inventory_level table to prevent other writes
    SELECT * FROM inventory_level WHERE PID = product_id AND Color = color FOR UPDATE;

    -- Check if the product exists in inventory_level
    IF EXISTS (SELECT 1 FROM inventory_level WHERE PID = product_id AND Color = color) THEN
        -- Update Inventory_Level table
        UPDATE inventory_level
        SET Quantity = Quantity + purchase_quantity, Date = NOW()
        WHERE PID = product_id;
    ELSE
        -- Insert the product into inventory_level if it does not exist
        INSERT INTO inventory_level (PID, Quantity, Date)
        VALUES (product_id, purchase_quantity, NOW());
    END IF;

    -- Insert into Purchased_Inventory table
    INSERT INTO purchased_inventory (PID, Quantity, Invoice_No, Unit_Price, Date, Description, Total_Price, Seller)
    VALUES (product_id, purchase_quantity, Invoice_No, Unit_Price, Purchase_Date, Description, Total_Price, Seller);

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
  `Color` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `inventory_level`
--

CREATE TABLE `inventory_level` (
  `ILID` int(11) NOT NULL,
  `PID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Color` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(0, 'aluminium plate', 'aluminium plate', 'number'),
(1, 'the first entry', 'panel', 'No'),
(2, 'second entry', 'hand rail', 'Quantity');

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
  `Color` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `Color` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
('natish', '$2b$10$v.UxwG.IFmj8dtN06Lc8M.zLKK7Rn2aC0cx8rNu3/bGwo2MqOwwnS', 'natishget@gmail.com', NULL);

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
  MODIFY `BIID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inventory_level`
--
ALTER TABLE `inventory_level`
  MODIFY `ILID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `purchased_inventory`
--
ALTER TABLE `purchased_inventory`
  MODIFY `PIID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `SID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

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
