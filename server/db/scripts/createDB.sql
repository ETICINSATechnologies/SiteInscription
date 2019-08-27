DROP TABLE IF EXISTS member_inscription;
CREATE TABLE member_inscription(
  firstName varchar(255) NOT NULL,
  lastName varchar(255) NOT NULL,
  genderId varchar(255) NOT NULL,
  birthday varchar(255) NOT NULL,
  departmentId varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phoneNumber varchar(255) DEFAULT NULL,
  outYear varchar(255) DEFAULT NULL,
  nationalityId varchar(255) NOT NULL,
  wantedPoleId varchar(255) NOT NULL,
  line1 varchar(255) NOT NULL,
  line2 varchar(255) DEFAULT NULL,
  city varchar(255) NOT NULL,
  postalCode varchar(255) NOT NULL,
  countryId varchar(255) NOT NULL,
  hasPaid varchar(255) DEFAULT "false",
  droitImage varchar(255) DEFAULT "false",
  createdDate DATE DEFAULT (datetime('now'))
);
