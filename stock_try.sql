SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `beginning_inventory` (
  `BIID` int(11) NOT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `PID` int(11) DEFAULT NULL,
  `Unit_Price` int(11) DEFAULT NULL,
  `Total_Price` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `beginning_inventory` (`BIID`, `Quantity`, `PID`, `Unit_Price`, `Total_Price`, `Date`) VALUES
(1, 50, 1, 5, 500, '0000-00-00'),
(2, 200, 1, 6, 1200, '0000-00-00');

CREATE TABLE `inventory_level` (
  `ILID` int(11) NOT NULL,
  `PID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `inventory_level` (`ILID`, `PID`, `Quantity`, `Date`) VALUES
(1, 1, 100, '2024-07-30');

CREATE TABLE `product` (
  `PID` int(11) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Product_name` varchar(255) DEFAULT NULL,
  `Unit_of_measurement` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `product` (`PID`, `Description`, `Product_name`, `Unit_of_measurement`) VALUES
(0, 'aluminium plate', 'aluminium plate', 'number'),
(1, 'the first entry', 'panel', 'No'),
(2, 'second entry', 'hand rail', 'Quantity');

CREATE TABLE `purchased_inventory` (
  `PIID` int(11) NOT NULL,
  `PID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Invoice_No` varchar(255) DEFAULT NULL,
  `Unit_Price` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Total_Price` int(11) NOT NULL,
  `Seller` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `purchased_inventory` (`PIID`, `PID`, `Quantity`, `Invoice_No`, `Unit_Price`, `Date`, `Description`, `Total_Price`, `Seller`) VALUES
(1, 1, 123, '12345', 123, '2024-08-08', '123', 0, NULL),
(2, 1, 123, '12345', 123, '2024-08-08', '123', 0, NULL),
(3, 2, 123, '5678', 456, '2024-08-08', 'what are you saying', 0, NULL),
(4, 2, 123, '5678', 456, '2024-08-08', 'what are you saying', 0, NULL),
(5, 2, 123, '5678', 456, '2024-08-08', 'what are you saying', 0, NULL),
(6, 2, 123, '5678', 456, '2024-08-08', 'we are the best', 56088, 'Dallol Aluminum'),
(7, 2, 123, '5678', 456, '2024-08-08', 'which one is better', 0, NULL),
(8, 1, 3, '765', 399, '2024-08-06', 'checking the total for the purchase', 1197, NULL);

CREATE TABLE `sales` (
  `SID` int(11) NOT NULL,
  `PID` int(11) DEFAULT NULL,
  `Quantity` int(11) NOT NULL,
  `Unit_price` int(11) NOT NULL,
  `Customer_Name` varchar(255) DEFAULT NULL,
  `Date` date NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Total_Price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sales` (`SID`, `PID`, `Quantity`, `Unit_price`, `Customer_Name`, `Date`, `Description`, `Total_Price`) VALUES
(4, 1, 50, 10, 'natnael', '2024-05-06', 'Our Aluminium Extrusion Profiles are engineered to meet the highest standards of quality and precision. Made from premium-grade aluminium, these profiles offer exceptional durability, lightweight strength, and corrosion resistance, making them ideal for a', 500),
(11, 0, 21, 7654, 'fitsum printing', '2024-08-09', 'hi there ', 160734),
(12, 0, 123, 12, 'nati', '2024-08-13', 'fix the error', 1476),
(13, 1, 123, 22, 'nahom', '2024-08-23', 'last fix', 2706),
(14, 0, 4, 3000, 'Dallol', '2024-08-16', 'test', 12000),
(15, 2, 12, 321, 'addis life', '2024-08-10', 'test2', 3852),
(16, 2, 12, 123, 'addis life', '2024-08-10', 'daily purchase', 1476),
(18, 2, 3, 300, 'fere', '2024-08-09', 'checking the total', 900),
(19, 0, 123, 234, 'teamer', '2024-06-20', 'monthly total check', 28782);

CREATE TABLE `user_table` (
  `User_Name` varchar(255) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `User_Type` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `user_table` (`User_Name`, `Password`, `Email`, `User_Type`) VALUES
('natish', '$2b$10$v.UxwG.IFmj8dtN06Lc8M.zLKK7Rn2aC0cx8rNu3/bGwo2MqOwwnS', 'natishget@gmail.com', NULL);

ALTER TABLE `beginning_inventory`
  ADD PRIMARY KEY (`BIID`),
  ADD KEY `PID` (`PID`);

ALTER TABLE `inventory_level`
  ADD PRIMARY KEY (`ILID`),
  ADD KEY `PID` (`PID`);

ALTER TABLE `product`
  ADD PRIMARY KEY (`PID`);

ALTER TABLE `purchased_inventory`
  ADD PRIMARY KEY (`PIID`),
  ADD KEY `PID` (`PID`);

ALTER TABLE `sales`
  ADD PRIMARY KEY (`SID`),
  ADD KEY `sales_ibfk_1` (`PID`);

ALTER TABLE `user_table`
  ADD PRIMARY KEY (`User_Name`);

ALTER TABLE `beginning_inventory`
  MODIFY `BIID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `inventory_level`
  MODIFY `ILID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `purchased_inventory`
  MODIFY `PIID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `sales`
  MODIFY `SID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;


ALTER TABLE `beginning_inventory`
  ADD CONSTRAINT `beginning_inventory_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`);


ALTER TABLE `inventory_level`
  ADD CONSTRAINT `inventory_level_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`);

ALTER TABLE `purchased_inventory`
  ADD CONSTRAINT `purchased_inventory_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`);

ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`);
COMMIT;

-- procedure for purchase

DELIMITER $$

CREATE PROCEDURE UpdateInventory(
    IN product_id INT,
    IN purchase_quantity INT,
    IN Invoice_No VARCHAR(255),
    IN Unit_Price DECIMAL(10, 2),
    IN Description VARCHAR(255),
    IN Seller VARCHAR(255),
    IN Purchase_Date DATETIME
)
BEGIN
    DECLARE Total_Price DECIMAL(10, 2);

    -- Calculate the total price
    SET Total_Price = purchase_quantity * Unit_Price;

    -- Start transaction
    START TRANSACTION;

    -- Lock the inventory_level table to prevent other writes
    SELECT * FROM inventory_level WHERE PID = product_id FOR UPDATE;

    -- Check if the product exists in inventory_level
    IF EXISTS (SELECT 1 FROM inventory_level WHERE PID = product_id) THEN
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

END $$

DELIMITER ;


-- sales handler producer
DELIMITER $$

CREATE PROCEDURE HandleSale(
    IN product_id INT,
    IN sale_quantity INT,
    IN sale_date DATETIME,
    IN Description VARCHAR(255),
    IN Unit_Price DECIMAL(10, 2),
    IN customer_name VARCHAR(255)
)
BEGIN
    DECLARE current_quantity INT;
    DECLARE Total_Price DECIMAL(10, 2);

    -- Calculate the total price
    SET Total_Price = sale_quantity * Unit_Price;

    -- Start transaction
    START TRANSACTION;

    -- Get the current quantity from inventory_level
    SELECT Quantity INTO current_quantity
    FROM inventory_level
    WHERE PID = product_id
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
        INSERT INTO sales (PID, Quantity, Date, Description, Unit_price, Customer_Name, Total_Price)
        VALUES (product_id, sale_quantity, sale_date, Description, Unit_Price, customer_name, Total_Price);

        -- Update inventory_level table
        UPDATE inventory_level
        SET Quantity = Quantity - sale_quantity, Date = NOW()
        WHERE PID = product_id;

        -- Commit transaction
        COMMIT;
    END IF;

END $$

DELIMITER ;
