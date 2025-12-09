-- ProjectAllocation
CREATE TABLE ProjectAllocation (
  project_allocation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT NOT NULL,
  utilization_percentage INT NOT NULL DEFAULT 100,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  CONSTRAINT fk_alloc_user FOREIGN KEY (user_id) REFERENCES `User`(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_alloc_project FOREIGN KEY (project_id) REFERENCES Project(project_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_alloc_user_dates (user_id, start_date, end_date),
  INDEX idx_alloc_project (project_id)
);