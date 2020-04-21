-- if the scheduling check query does return 0, then
-- we can insert the grant calls into the schedule

-- $1 - scheduled date
-- $2 - room location
-- $3 - grant call ID (user input 1)
-- $4 - grant call ID (user input 2)
-- $5 - grant call ID (user input 3)

INSERT INTO meeting (scheduled, location)
VALUES ($1, $2);

INSERT INTO meeting_calls (calls, meet_date, meet_loc)
VALUES ($3, $1, $2);

INSERT INTO meeting_calls (calls, meet_date, meet_loc)
VALUES ($4, $1, $2);

INSERT INTO meeting_calls (calls, meet_date, meet_loc)
VALUES ($5, $1, $2);