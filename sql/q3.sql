-- $1: Area

WITH pg AS(
  SELECT p.id,p.request_amount
  FROM proposal p JOIN grant_call g ON p.callid = g.id
  WHERE g.area = $1
)


SELECT pg.id
FROM pg
WHERE pg.request_amount >= ALL (
  SELECT pg2.request_amount
  FROM pg AS pg2
);