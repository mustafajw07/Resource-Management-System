CREATE OR REPLACE VIEW vw_user_project_utilization_details AS
SELECT
  u.user_id,
  u.first_name,
  u.manager_id,
  u.last_name,
  u.email,
  l.location_id,
  l.location_name,
  p.project_id,
  pa.is_primary_project,
  p.project_name,
  pa.utilization_percentage,
  pa.start_date AS allocation_start_date,
  pa.end_date AS allocation_end_date
FROM ProjectAllocation pa
JOIN `User` u
  ON pa.user_id = u.user_id
LEFT JOIN Location l
  ON u.location_id = l.location_id
JOIN Project p
  ON pa.project_id = p.project_id;
