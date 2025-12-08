-- Reference Data
CREATE TABLE ReferenceData (
  reference_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  reference_name VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  CONSTRAINT fk_refdata_category FOREIGN KEY (category_id) REFERENCES ReferenceCategory(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY ux_refdata_category_name (category_id, name)
);