
SELECT I.id
FROM researcher I
WHERE NOT EXISTS (
      SELECT *
      FROM collaborator C
      WHERE C.proposalid = $1 AND (I.id, C.researcherid) IN (
            SELECT researcher1, researcher2 FROM conflict
            UNION
            SELECT researcher2, researcher1 FROM conflict
      )
) AND (
      SELECT COUNT(*)
      FROM review R
      WHERE R.reviewerid = I.id AND R.submitted = 'FALSE'
) < 3;
