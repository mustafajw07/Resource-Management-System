CREATE TABLE RequisitionNote (
  note_id INT AUTO_INCREMENT PRIMARY KEY,
  requisition_id INT NOT NULL,
  note_text TEXT NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
               ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_note_requisition
    FOREIGN KEY (requisition_id)
    REFERENCES Requisition(requisition_id)
    ON DELETE CASCADE
);
