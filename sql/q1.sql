-- CMPT354 - Project

-- For Q1 (and Q2), we will assume that all the calls in the table are set in a fixed year,
-- each deadline is at the end of some month, and every call is opened at the start of the
-- year.

WITH c_count AS (
     SELECT COUNT(*)
     FROM collaborator C
     WHERE C.proposalid = P.id
), large_proposal AS (
    SELECT *
    FROM proposal P
    WHERE P.callid = G.id AND (P.request_amount >= 20000.0 OR c_count > 10)
)
SELECT G.id, G.title
FROM grant_call G
WHERE EXTRACT(MONTH FROM DATE 'USER INPUT') <= EXTRACT(MONTH FROM DATE G.deadline)
AND EXISTS (large_proposal);
