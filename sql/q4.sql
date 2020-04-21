-- $1: Date, in UNIX time

WITH pg AS (
  SELECT p.id,p.awarded_amount
  FROM proposal p
  WHERE to_timestamp($1) > p.submission_date AND p.status = 'awarded'
)

SELECT pg.id
FROM pg
WHERE pg.awarded_amount >= ALL(
  SELECT pg2.awarded_amount
  FROM pg as pg2
);
