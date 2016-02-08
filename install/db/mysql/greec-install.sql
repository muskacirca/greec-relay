--
-- DB: greec - MySql5   -ARA(,Zia4,9
--

USE greec;

CREATE TABLE IF NOT EXISTS User (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  creationDate datetime NOT NULL,
  updateDate datetime NULL,
  login varchar(255) NOT NULL,
  password varchar(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_Login (login)
);

CREATE TABLE IF NOT EXISTS wrecks (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  shortDescription TINYTEXT NOT NULL,
  latitude float NOT NULL,
  longitude float NOT NULL,
  description MEDIUMTEXT NOT NULL,
  sinkDate datetime NOT NULL,
  imagePath varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_Name (name)
);

--
-- Default Users / Roles
--

INSERT INTO User (creationDate,  login, password)
VALUES ('2014-07-20 00:00:00', 'admin', 'liberate');

INSERT INTO Wreck (name, shortDescription, latitude, longitude, description, sinkDate, imagePath)
VALUES ('Ray of Hope', 'Depth: Starts at 20 meters', -40.3356121, 10.2154984,
        'The ''Ray of Hope'' is a retired cargo ship that was donated by the Bahamian Government for use as an artificial reef.
        This 200 ft wreck rests on the sand in about 50ft of water with the wheelhouse at around 20ft. Stingrays can be seen in
        the sand around the wreck as well as resident Caribbean Reef sharks.',
        '2014-07-20 00:00:00', './app/resources/wreck/rayofhope/header-rayofhope.jpg');
