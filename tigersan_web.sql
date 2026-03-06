CREATE TABLE IF NOT EXISTS `tigersan_web`.`base_station_mgt` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `mac_addr` VARCHAR(30) NOT NULL,
  `eqp_name` VARCHAR(50) NOT NULL,
  `eqp_type` VARCHAR(50) NOT NULL,
  `online_state` TINYINT(1) NOT NULL,
  `update_time` DATETIME NOT NULL,
  `version` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE INDEX `mac_addr_UNIQUE` (`mac_addr` ASC) VISIBLE,
  UNIQUE INDEX `index_UNIQUE` (`index` ASC) VISIBLE)
ENGINE = InnoDB

INSERT INTO tigersan_web.base_station_mgt
(`index`, mac_addr, eqp_name, eqp_type, online_state, update_time, version)
VALUES(1, 'AC233FC21C39', 'EQP1', 'type1', 1, '2026-01-21 17:33:56', '3.7.0');
INSERT INTO tigersan_web.base_station_mgt
(`index`, mac_addr, eqp_name, eqp_type, online_state, update_time, version)
VALUES(2, 'AC233FC23E1F', 'EQP2', 'type2', 1, '2026-01-12 11:06:27', '3.7.0');
INSERT INTO tigersan_web.base_station_mgt
(`index`, mac_addr, eqp_name, eqp_type, online_state, update_time, version)
VALUES(3, 'AC233FC22827', 'EQP3', 'type3', 0, '2026-01-14 11:39:58', '3.7.0');