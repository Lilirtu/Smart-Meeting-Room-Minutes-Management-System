DROP TABLE IF EXISTS 
    GroupAssignment, Assignment, Notification,
    Reservation, Attachment, Attendance, Agenda,
    MinutesOfMeeting, Meeting, RoomFeature,
    Feature, Room, Users, Role;

-- ENUM type for Role
CREATE TYPE role_enum AS ENUM ('Admin', 'Employee', 'Guest');

CREATE TABLE Role (
    Id SERIAL PRIMARY KEY,
    RoleName role_enum NOT NULL,
    Description TEXT NOT NULL
);

CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(200) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    RoleId INT NOT NULL,
    FOREIGN KEY (RoleId) REFERENCES Role(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Room (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    Capacity SMALLINT NOT NULL
);

CREATE TABLE Feature (
    Id SERIAL PRIMARY KEY,
    FeatureName VARCHAR(100) NOT NULL,
    Description VARCHAR(250) NOT NULL
);

CREATE TABLE RoomFeature (
    Id SERIAL PRIMARY KEY,
    RoomId INT NOT NULL,
    FeatureId INT NOT NULL,
    FOREIGN KEY (RoomId) REFERENCES Room(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (FeatureId) REFERENCES Feature(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- AGENDA table created first to avoid circular references
CREATE TABLE Agenda (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(50) NOT NULL,
    Description VARCHAR(300) NOT NULL
);

-- MINUTESOFMEETING table created first to avoid circular references
CREATE TABLE MinutesOfMeeting (
    Id SERIAL PRIMARY KEY,
    Topic VARCHAR(100) NOT NULL,
    Summary VARCHAR(500) NOT NULL,
    DecisionMade VARCHAR(100) NOT NULL
);

-- RESERVATION table created first to avoid circular references
CREATE TABLE Reservation (
    Id SERIAL PRIMARY KEY,
    Status VARCHAR(30) NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Date DATE NOT NULL,
    UserId INT NOT NULL,
    RoomId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (RoomId) REFERENCES Room(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Meeting (
    Id SERIAL PRIMARY KEY,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Date DATE NOT NULL,
    Title VARCHAR(50) NOT NULL,
    NumberOfAttendance INT NOT NULL,
    ReservationId INT,
    MinutesOfMeetingId INT,
    AgendaId INT,
    FOREIGN KEY (ReservationId) REFERENCES Reservation(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (MinutesOfMeetingId) REFERENCES MinutesOfMeeting(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (AgendaId) REFERENCES Agenda(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

/*UPDATE Reservation, MinutesOfMeeting and Agenda now to include MeetingId 
to not have a circular reference to avoid errors of creating tables that depends on others*/
ALTER TABLE Reservation ADD COLUMN MeetingId INT;
ALTER TABLE Reservation
    ADD CONSTRAINT fk_meeting_reservation
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE MinutesOfMeeting ADD COLUMN MeetingId INT;
ALTER TABLE MinutesOfMeeting
    ADD CONSTRAINT fk_meeting_minutes
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE Agenda ADD COLUMN MeetingId INT;
ALTER TABLE Agenda
    ADD CONSTRAINT fk_meeting_agenda
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE Attendance (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    MeetingId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Attachment (
    Id SERIAL PRIMARY KEY,
    Link TEXT,
    FileName VARCHAR(255),
    MinutesOfMeetingId INT NOT NULL,
    FOREIGN KEY (MinutesOfMeetingId) REFERENCES MinutesOfMeeting(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Notification (
    Id SERIAL PRIMARY KEY,
    SenderId INT NOT NULL,
    ReceivedId INT NOT NULL,
    TimeSent TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (SenderId) REFERENCES Users(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (ReceivedId) REFERENCES Users(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Assignment (
    Id SERIAL PRIMARY KEY,
    NotificationId INT NOT NULL,
    MeetingId INT NOT NULL,
    Description TEXT NOT NULL,
    DueDate TIMESTAMP NOT NULL,
    FOREIGN KEY (NotificationId) REFERENCES Notification(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE GroupAssignment (
    Id SERIAL PRIMARY KEY,
    AssignmentId INT NOT NULL,
    UserId INT NOT NULL,
    FOREIGN KEY (AssignmentId) REFERENCES Assignment(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
