-- $1: Proposal id
-- $2: Reviewer id

INSERT INTO review (reviewerid, proposalid, deadline)
    SELECT $2, $1, G.deadline + integer '14'
    FROM proposal P JOIN grant_call G ON P.callid = G.id
    WHERE P.id = $1;