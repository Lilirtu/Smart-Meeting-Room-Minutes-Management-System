-- Drop table is used to prevent a recreation of the tables if they already existed in case a table was edited to avoid errors
DROP TABLE IF EXISTS Attendance, Agenda, MinutesOfMeeting, Reservation, RoomFeature, Feature, Meeting, Room, Users, Role;


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
    FOREIGN KEY (RoomId) REFERENCES Room(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE, -- keeps foreign keys updated if the role's ID changes
    FOREIGN KEY (FeatureId) REFERENCES Feature(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE -- keeps foreign keys updated if the role's ID changes
);

CREATE TABLE Meeting(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Date DATE NOT NULL,
    Title VARCHAR(50) NOT NULL,
    NumberOfAttendance INT NOT NULL
    );

CREATE TABLE Agenda(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(50) NOT NULL,
    Description VARCHAR (300) NOT NULL,
    MeetingId INT NOT NULL,
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE -- keeps foreign keys updated if the role's ID changes
    );

CREATE TABLE Attendance(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    MeetingId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE, -- keeps foreign keys updated if the role's ID changes
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE -- keeps foreign keys updated if the role's ID changes
    );

CREATE TABLE MinutesOfMeeting(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Topic VARCHAR(100) NOT NULL,
    Summary VARCHAR(500) NOT NULL,
    DecisionMade VARCHAR(100) NOT NULL,
    MeetingId INT NOT NULL,
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE -- keeps foreign keys updated if the role's ID changes
    );
    
CREATE TABLE Reservation(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Status VARCHAR(30) NOT NULL,
    StartTime TIME NOT NULL,
    EndTime  TIME NOT NULL,
    Date DATE NOT NULL,
    MeetingId INT NOT NULL,
    UserId INT NOT NULL,
    RoomId INT NOT NULL,
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE, -- keeps foreign keys updated if the role's ID changes
    FOREIGN KEY (UserId) REFERENCES Users(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE, -- keeps foreign keys updated if the role's ID changes
    FOREIGN KEY (RoomId) REFERENCES Room(Id)
        ON DELETE RESTRICT -- prevents deleting a role if users still use it
        ON UPDATE CASCADE -- keeps foreign keys updated if the role's ID changes
    );


    
