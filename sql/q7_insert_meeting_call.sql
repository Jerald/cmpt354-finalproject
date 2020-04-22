-- if the scheduling check query does return 0, then
-- we can insert the grant calls into the schedule

-- $1 - scheduled date
-- $2 - room location
-- $3 - grant call ID

INSERT INTO meeting_calls (calls, meet_date, meet_loc)
VALUES ($3, $1, $2);

