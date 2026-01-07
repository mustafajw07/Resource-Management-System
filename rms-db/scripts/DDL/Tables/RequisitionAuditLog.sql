CREATE TABLE RequisitionAuditLog (
  audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,

  requisition_id INT NOT NULL,

  field_name VARCHAR(100) NOT NULL,

  old_value TEXT,
  new_value TEXT,

  action_type ENUM('UPDATE', 'DELETE') NOT NULL DEFAULT 'UPDATE',

  changed_by VARCHAR(255) NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_audit_requisition
    FOREIGN KEY (requisition_id)
    REFERENCES Requisition(requisition_id)
    ON DELETE CASCADE,

  INDEX idx_audit_requisition (requisition_id),
  INDEX idx_audit_changed_at (changed_at),
  INDEX idx_audit_field (field_name)
);
