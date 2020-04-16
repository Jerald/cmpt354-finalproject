with rc as(
  SELECT r.reviewerid,c2.researcher1,c1.researcher2
  FROM review r
  JOIN conflict c1 on r.reviewerid = c1.researcher1
  JOIN conflict c2 on r.reviewerid = c2.researcher2
  WHERE r.proposalid = $1
), cc as(
  SELECT c.researcherid,c2.researcher1,c1.researcher2
  FROM  collaborator c
  JOIN conflict c1 on c.researcherid = c1.researcher1
  JOIN conflict c2 on c.researcherid = c2.researcher2
  WHERE r.proposalid = $1
)

SELECT r.id
FROM researcher r, rc, cc
WHERE r.id != rc.researcher1 AND r.id != rc.researcher2 AND r.id != rc.reviewerid AND
r.id != cc.researcher1 AND r.id != cc.researcher2 AND r.id != cc.researcherid AND
3 >  (SELECT COUNT(rv.reviewerid)
FROM review rv JOIN researcher r2 ON rv.reviewerid = r2.id
WHERE rv.reviewerid = r.id AND rv.submitted = 'false'
GROUP BY rv.reviewerid
);
