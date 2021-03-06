--assume that request_amount is not NULL and amounts are >= 0.0

-- $1: Area

WITH pg AS(
  SELECT ABS(p.request_amount - p.awarded_amount) AS discrepancy
  FROM proposal p JOIN grant_call g ON p.callid = g.id
  WHERE g.area = $1 AND p.awarded_amount >= 0.0

)

SELECT  AVG(pg.discrepancy) AS average_discrepancy
FROM pg;
