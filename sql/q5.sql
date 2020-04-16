--assume that awarded and request_amount is not NULL

WITH pg AS(
  SELECT p.id,p.request_amount,p.awarded_amount
  FROM proposal p JOIN grant_call g ON p.callid = g.id
  WHERE g.area = $1
)

SELECT pg.id, ABS(AVG(pg.request_amount - pg.awarded_amount)) AS average_discrepancy
FROM pg;
