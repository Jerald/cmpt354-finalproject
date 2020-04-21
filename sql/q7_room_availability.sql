-- check if room is available
-- (the query returns zero only if the room is available)
--
-- assumptions:
-- * each room can be booked at most once per day
        
SELECT COUNT(*)
FROM meeting M
WHERE M.location = $1 AND M.scheduled = $2;