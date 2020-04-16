-- CMPT354 - Project

-- For Q1 (and Q2), we will assume that all the calls in the table are set in a fixed year,
-- each deadline is at the end of some month, and every call is opened at the start of the
-- year.

-- $1: Date in UNIX time
-- $2: Area
-- $3: Principle investigator first name
-- $4: Principle investigator last name

WITH investigator AS (
    SELECT R.id
    FROM Researcher AS R
    WHERE R.firstname = $3 AND R.lastname = $4
)

SELECT G.id, G.title
FROM grant_call G
WHERE EXTRACT(MONTH FROM to_timestamp($1)) <= EXTRACT(MONTH FROM G.deadline) AND G.area = $2
AND EXISTS
    (SELECT *
    FROM proposal P
    WHERE P.callid = G.id
    AND P.investigator IN (SELECT * FROM investigator)
    AND (P.request_amount >= 20000.0 OR
        (SELECT COUNT(*)
        FROM collaborator C
        WHERE C.proposalid = P.id) > 10));