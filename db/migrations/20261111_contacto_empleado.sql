-- RN-65: los empleados pueden mantener teléfono y dirección en su perfil laboral.
ALTER TABLE empleado
    ADD COLUMN telefono VARCHAR(20) NULL AFTER apellido;

ALTER TABLE empleado
    ADD COLUMN calle VARCHAR(120) NULL AFTER telefono;
