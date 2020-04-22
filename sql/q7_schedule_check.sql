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

-- $1: Meeting date
-- $2: Call 1
-- $3: Call 2
-- $4: Call 3


SELECT * FROM (
    SELECT R.reviewerid
    FROM grant_call G
    JOIN proposal P ON G.id = P.callid   
    JOIN review R ON R.proposalid = P.id
    WHERE G.id IN (
        SELECT calls FROM meeting_calls WHERE meet_date = to_timestamp($1)
    )
    INTERSECT
    SELECT R.reviewerid
    FROM grant_call G
    JOIN proposal P ON G.id = P.callid   
    JOIN review R ON R.proposalid = P.id
    WHERE G.id = $2 OR G.id = $3 OR G.id = $4
) SCHEDULE_CONFLICTS

UNION

SELECT 0
WHERE (
    SELECT COUNT(*) 
    FROM grant_call G 
    WHERE G.id = $2 OR G.id = $3 OR G.id = $4
) != 3;

-- if the count is non-zero (there are conflicts for scheduling), return impossible
