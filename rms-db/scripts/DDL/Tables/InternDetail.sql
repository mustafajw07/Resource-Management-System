-- InternDetail
CREATE TABLE InternDetail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  internship_doj DATE NOT NULL,
  mentor_id INT,
  remarks TEXT,
  is_bgv_check_complete TINYINT(1) NOT NULL DEFAULT 0,
  graduation_year INT,
  unallocated_days INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  CONSTRAINT fk_intern_user FOREIGN KEY (user_id) REFERENCES `User`(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_intern_mentor FOREIGN KEY (mentor_id) REFERENCES `User`(user_id)
    ON DELETE SET NULL ON UPDATE CASCADE
);