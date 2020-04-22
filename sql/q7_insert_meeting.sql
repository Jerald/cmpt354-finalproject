-- if the scheduling check query does return 0, then
-- we can insert the grant calls into the schedule

-- $1 - scheduled date
-- $2 - room location

INSERT INTO meeting (scheduled, location)
VALUES ($1, $2);