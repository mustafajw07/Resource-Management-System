CREATE TABLE OnShoreManager (
  id INT AUTO_INCREMENT PRIMARY KEY,
  manager_name VARCHAR(255) NOT NULL,
  project_id INT NOT NULL,
  client_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  CONSTRAINT fk_alloc_project FOREIGN KEY (project_id) REFERENCES Project(project_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_alloc_client FOREIGN KEY (client_id) REFERENCES Client(client_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_alloc_project (project_id)
  INDEX idx_alloc_client (client_id)
);