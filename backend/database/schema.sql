CREATE TABLE Role(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    RoleName ENUM('Admin','Employee','Guest') NOT NULL,
    Description TEXT NOT NULL
);

Create TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(200) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    RoleId INT NOT NULL,
    FOREIGN KEY (RoleId) REFERENCES Role(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE -- keeps foreign keys updated if the role's ID changes
); 