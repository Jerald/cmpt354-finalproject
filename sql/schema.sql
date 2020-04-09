CREATE TABLE researcher(
id SERIAL PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) NOT NULL,
email VARCHAR(50) UNIQUE NOT NULL,
organization VARCHAR(10)
);

CREATE TYPE callstatus AS ENUM('open','closed','paused','cancelled'); 

CREATE TABLE call(
id SERIAL PRIMARY KEY,
title VARCHAR(50) NOT NULL,
deadline DATE NOT NULL,
description VARCHAR(250),
area VARCHAR(30) NOT NULL,
status callstatus DEFAULT 'open'
);

CREATE TYPE appstatus AS ENUM('submitted','awarded','denied');

CREATE TABLE proposal(
id SERIAL PRIMARY KEY,
callid INT REFERENCES call(id) NOT NULL,
pi INT REFERENCES researcher(id) NOT NULL,
status appstatus DEFAULT 'submitted' NOT NULL,
amount NUMERIC(14,2)
); 

CREATE TABLE collaborator(
id SERIAL PRIMARY KEY,
proposalid INT REFERENCES proposal(id) NOT NULL,
researcherid INT REFERENCES researcher(id) NOT NULL,
ispi BOOLEAN DEFAULT 'false' NOT NULL
);

CREATE TABLE conflict(
id SERIAL PRIMARY KEY,
researcher1 INT REFERENCES researcher(id) NOT NULL,
researcher2 INT REFERENCES researcher(id) NOT NULL,
reason VARCHAR(50),
expiry DATE
);

CREATE TABLE review(
id SERIAL PRIMARY KEY,
reviewerid INT REFERENCES researcher(id) NOT NULL,
proposalid INT REFERENCES proposal(id) NOT NULL,
deadline DATE NOT NULL,
submitted BOOLEAN DEFAULT 'false' NOT NULL
);

INSERT INTO researcher VALUES
(DEFAULT,'Name','Lastname1','email@sfu.ca','SFU'),
(DEFAULT,'Name','Lastname2','email@uvic.ca','UVIC');

INSERT INTO call VALUES
(DEFAULT,'Canadian Inovation',now() + interval '2 week',NULL,'Computer Science',DEFAULT),
(DEFAULT,'Some Title',now() + interval '3 week',NULL,'Biology',DEFAULT),
(DEFAULT,'Reduce Carbon Footprint',now() + interval '4 week',NULL,'Engineering','closed');

INSERT INTO proposal VALUES 
(DEFAULT,2,5,'submitted',NULL),
(DEFAULT,3,3,'denied', NULL),
(DEFAULT,3,7,'awarded',5000.00);

INSERT INTO collaborator VALUES
(DEFAULT,1,5,'t'),
(DEFAULT,1,1,'f'),
(DEFAULT,2,7,'t'),
(DEFAULT,3,5,'t');

INSERT INTO conflict VALUES
(DEFAULT,1,2,'co-authered paper',now() + interval '2 year'),
(DEFAULT,4,5,'related',NULL),
(DEFAULT,3,7,'Same Department',NULL);

INSERT INTO review VALUES
(DEFAULT,6,3,now(),'t'),
(DEFAULT,7,1,now() + interval '2 week','f'),
(DEFAULT,6,1,now() + interval '2 week','t'),
(DEFAULT,1,2,now(),'t');

