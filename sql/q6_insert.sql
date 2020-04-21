WITH D AS (
  SELECT G.deadline + integer '14' AS deadline
  FROM proposal P JOIN grant_call G ON P.callid = G.id
  WHERE P.id = $1
)

INSERT INTO review (reviewerid, proposalid, deadline)
VALUES ($2, $1, D);
