-- Drop table is used to prevent a recreation of the tables if they already existed in case a table was edited to avoid errors
DROP TABLE IF EXISTS Assignment, Notification, MinutesOfMeeting, Attendance, Agenda, MeetingReservation, RoomFeature, Feature, Room, Users, Role;


CREATE TABLE Role(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    RoleName ENUM('Admin','Employee','Guest') NOT NULL,
    Description TEXT NOT NULL
);

CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(200) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    RoleId INT NOT NULL,
    FOREIGN KEY (RoleId) REFERENCES Role(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE -- keeps foreign keys updated if the role's ID changes
); 

CREATE TABLE Room(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    Capacity TINYINT UNSIGNED NOT NULL
);

CREATE TABLE Feature(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    FeatureName VARCHAR(100) NOT NULL,
    Description VARCHAR(250) NOT NULL 
);

CREATE TABLE RoomFeature(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    RoomId INT NOT NULL,
    FeatureId INT NOT NULL,
    FOREIGN KEY (RoomId) REFERENCES Room(Id),
    FOREIGN KEY (FeatureId) REFERENCES Feature(Id)
);
