CREATE TABLE Requisition (
  requisition_id INT AUTO_INCREMENT PRIMARY KEY,
  requisition_date DATE NOT NULL,
  project_id INT,
  requisition_type_id INT,
  requisition_stage_id INT,
  hiring_poc_id INT,
  client_poc_name VARCHAR(255),
  fulfillment_medium_id INT,
  urgency_id INT,
  requisition_status_id INT,
  fte_head_count INT NOT NULL DEFAULT 1,
  fte_total_allocation INT,
  fulfilled_allocation INT NOT NULL DEFAULT 0,
  notes TEXT,
  tentative_onboarding_date DATE,
  ageing_days INT,
  capability_area_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  CONSTRAINT fk_req_project FOREIGN KEY (project_id) REFERENCES Project(project_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_req_requisition_type FOREIGN KEY (requisition_type_id) REFERENCES ReferenceData(reference_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_req_requisition_stage FOREIGN KEY (requisition_stage_id) REFERENCES ReferenceData(reference_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_req_hiring_poc FOREIGN KEY (hiring_poc_id) REFERENCES `User`(user_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_req_fulfillment_medium FOREIGN KEY (fulfillment_medium_id) REFERENCES ReferenceData(reference_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_req_urgency FOREIGN KEY (urgency_id) REFERENCES ReferenceData(reference_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_req_status FOREIGN KEY (requisition_status_id) REFERENCES ReferenceData(reference_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_req_capability_area FOREIGN KEY (capability_area_id) REFERENCES ReferenceData(reference_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_req_project (project_id),
  INDEX idx_req_status (requisition_status_id)
);