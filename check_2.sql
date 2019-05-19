SELECT
  item_purchased, amount,
  cu.name AS cust_name, -- aliasing
  co.name AS comp_name
FROM
  transaction AS tr, -- also aliasing
  customer AS cu,
  company AS co
WHERE
    tr.customer_id = cu.id AND
    tr.company_id = co.id;