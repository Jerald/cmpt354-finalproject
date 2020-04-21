WITH pg AS (
  SELECT p.id,p.request_amount
  FROM proposal p
  WHERE $1 < p.submission_date
)

SELECT pg.id
FROM pg
WHERE pg.request_amount >= ALL (
  SELECT pg2.request_amount
  FROM pg AS pg2
  WHERE pg.id = pg2.id
);
