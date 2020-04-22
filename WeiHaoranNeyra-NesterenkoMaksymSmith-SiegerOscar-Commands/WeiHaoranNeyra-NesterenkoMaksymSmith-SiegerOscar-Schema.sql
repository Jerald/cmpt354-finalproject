CREATE TABLE researcher(
       id SERIAL PRIMARY KEY,
       firstname TEXT NOT NULL,
       lastname TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       organization TEXT
);

CREATE TYPE CALLSTATUS AS ENUM('open','closed');
CREATE TYPE RESEARCH_AREA AS ENUM('Computer Science', 'Biology', 'Chemistry', 'Mathematics', 'Physics');

CREATE TABLE grant_call(
       id SERIAL PRIMARY KEY,
       title TEXT NOT NULL,
       deadline DATE NOT NULL,
       description TEXT,
       area RESEARCH_AREA NOT NULL,
       status CALLSTATUS DEFAULT 'open'
);

CREATE TYPE APPSTATUS AS ENUM('submitted','awarded','not awarded');

CREATE TABLE proposal(
       id SERIAL PRIMARY KEY,
       callid INT REFERENCES grant_call(id) NOT NULL,
       investigator INT REFERENCES researcher(id) NOT NULL,
       status APPSTATUS DEFAULT 'submitted' NOT NULL,
       submission_date DATE NOT NULL, -- subject to change, see https://piazza.com/class/k4f9y9b5hho5wg?cid=239
       request_amount NUMERIC(14,2) NOT NULL,
       awarded_amount NUMERIC(14,2)
);

CREATE TABLE collaborator(
       id SERIAL PRIMARY KEY,
       proposalid INT REFERENCES proposal(id) NOT NULL,
       researcherid INT REFERENCES researcher(id) NOT NULL,
       is_investigator BOOLEAN DEFAULT 'false' NOT NULL
);

CREATE TABLE conflict(
       id SERIAL PRIMARY KEY,
       researcher1 INT REFERENCES researcher(id) NOT NULL,
       researcher2 INT REFERENCES researcher(id) NOT NULL,
       reason TEXT,
       expiry DATE
);

CREATE TABLE review(
       id SERIAL PRIMARY KEY,
       reviewerid INT REFERENCES researcher(id) NOT NULL,
       proposalid INT REFERENCES proposal(id) NOT NULL,
       deadline DATE NOT NULL,
       submitted BOOLEAN DEFAULT 'false' NOT NULL
);

CREATE TABLE meeting(
       scheduled DATE NOT NULL,
       location TEXT NOT NULL,
       PRIMARY KEY (scheduled, location)
);

CREATE TABLE meeting_calls(
       calls INT REFERENCES grant_call(id) NOT NULL,
       meet_date DATE,
       meet_loc TEXT,
       FOREIGN KEY (meet_date, meet_loc) REFERENCES meeting(scheduled, location)
);

CREATE TABLE meeting_attendees(
       attendant INT REFERENCES researcher(id) NOT NULL,
       meet_date DATE,
       meet_loc TEXT,
       FOREIGN KEY (meet_date, meet_loc) REFERENCES meeting(scheduled, location)
);
