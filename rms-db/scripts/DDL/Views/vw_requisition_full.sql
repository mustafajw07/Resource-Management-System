CREATE OR REPLACE VIEW launchpad.vw_requisition_full AS
SELECT
  r.id AS requisition_id,
  r.requisition_date,
  r.project_id,
  p.project_name,
  p.client_id,
  c.client_name,
  p.status AS project_status,
  p.start_date  AS project_start_date,
  p.end_date    AS project_end_date,

  r.requisition_type_id,
  rd_type.name AS requisition_type_name,

  r.requisition_stage_id,
  rd_stage.name AS requisition_stage_name,

  r.fulfillment_medium_id,
  rd_fulfillment.name AS fulfillment_medium_name,

  r.urgency_id,
  rd_urgency.name AS urgency_name,

  r.requisition_status_id,
  rd_status.name AS requisition_status_name,

  r.capability_area_id,
  rd_capability.name AS capability_area_name,

  -- People
  r.hiring_poc_id,
  hiring_poc.first_name || ' ' || COALESCE(hiring_poc.last_name, '') AS hiring_poc_name,
  hiring_poc.email AS hiring_poc_email,

  r.client_poc_name,

  -- counts and allocations
  r.fte_head_count,
  r.fte_total_allocation,
  r.fulfilled_allocation,

  r.notes,
  r.tentative_onboarding_date,

  -- metadata
  r.created_at,
  r.updated_at,
  r.created_by AS created_by_id,
  creator.first_name || ' ' || COALESCE(creator.last_name, '') AS created_by_name,
  creator.email AS created_by_email,
  r.updated_by AS updated_by_id,
  updater.first_name || ' ' || COALESCE(updater.last_name, '') AS updated_by_name,
  updater.email AS updated_by_email,

  -- computed ageing (days since requisition_date). Null-safe.
  CASE
    WHEN r.requisition_date IS NULL THEN NULL
    ELSE (CURRENT_DATE - r.requisition_date)
  END AS ageing_days

FROM Requisition r
-- Project & client
LEFT JOIN Project p
  ON p.id = r.project_id
LEFT JOIN Client c
  ON c.id = p.client_id

-- Hiring POC user
LEFT JOIN `User` hiring_poc
  ON hiring_poc.id = r.hiring_poc_id

-- Creator / Updater users
LEFT JOIN `User` creator
  ON creator.id = r.created_by
LEFT JOIN `User` updater
  ON updater.id = r.updated_by

-- ReferenceData joins (each alias corresponds to the meaning in the Requisition row)
LEFT JOIN ReferenceData rd_type
  ON rd_type.id = r.requisition_type_id
LEFT JOIN ReferenceData rd_stage
  ON rd_stage.id = r.requisition_stage_id
LEFT JOIN ReferenceData rd_fulfillment
  ON rd_fulfillment.id = r.fulfillment_medium_id
LEFT JOIN ReferenceData rd_urgency
  ON rd_urgency.id = r.urgency_id
LEFT JOIN ReferenceData rd_status
  ON rd_status.id = r.requisition_status_id
LEFT JOIN ReferenceData rd_capability
  ON rd_capability.id = r.capability_area_id
;
