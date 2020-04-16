-- CMPT354 - Project

-- check if room is available
-- (the query returns zero only if the room is available)
--
-- assumptions:
-- * each room can be booked at most once per day
SELECT COUNT(*)
FROM meeting M
WHERE M.location = 'USER INPUT' AND M.scheduled = 'USER INPUT';

-- check if competition (call) can be discussed
--
-- assumptions:
-- * for each meeting, the set of reviwers for a call is non-empty
--
-- *NOTE*: we can do a small optimization where we check if a user input
-- call is already set to a meeting on the user input date
--
-- SELECT calls FROM meeting_calls WHERE meet_date = 'USER INPUT';
--
-- in which we can return impossible.

SELECT R.reviewerid
FROM grant_call G
     JOIN proposal P ON G.id = P.callid
     JOIN review R ON R.proposalid = P.id
WHERE G.id IN ...;

-- what to substitute in for ...
/*

Reviewer IDs for meetings scheduled that day:

( SELECT calls FROM meeting_calls WHERE meet_date = 'USER INPUT' )



User input grant calls (literally just make a tuple of constants):

(USER INPUT 1, USER INPUT 2, USER INPUT 3)



Suppose both of these queries are aliased as Q1 and Q2. Then compute

SELECT COUNT(*) FROM (Q1 INTERSECT Q2);

If the count is non-zero (there are conflicts for scheduling), return impossible.

*/
