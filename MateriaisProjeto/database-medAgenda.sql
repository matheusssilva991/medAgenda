-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 1.0.1
-- PostgreSQL version: 15.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: "medAgenda" | type: DATABASE --
-- DROP DATABASE IF EXISTS "medAgenda";
CREATE DATABASE "medAgenda";
-- ddl-end --


-- object: public.tbl_clinica | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_clinica CASCADE;
CREATE TABLE public.tbl_clinica (
	id serial NOT NULL,
	nome varchar(50) NOT NULL,
	cnes varchar(20) NOT NULL,
	id_tbl_endereco integer,
	id_tbl_user integer,
	id_tbl_telefone integer,
	CONSTRAINT tbl_clinica_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_clinica OWNER TO postgres;
-- ddl-end --

-- object: public.tbl_paciente | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_paciente CASCADE;
CREATE TABLE public.tbl_paciente (
	id serial NOT NULL,
	nome varchar(100) NOT NULL,
	cpf varchar(11) NOT NULL,
	data_nascimento date NOT NULL,
	id_tbl_endereco integer,
	id_tbl_telefone integer,
	id_tbl_user integer,
	CONSTRAINT tbl_paciente_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_paciente OWNER TO postgres;
-- ddl-end --

-- object: public.tbl_telefone | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_telefone CASCADE;
CREATE TABLE public.tbl_telefone (
	id serial NOT NULL,
	ddd varchar(2) NOT NULL,
	numero varchar(9) NOT NULL,
	CONSTRAINT tbl_telefone_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_telefone OWNER TO postgres;
-- ddl-end --

-- object: public.tbl_medico | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_medico CASCADE;
CREATE TABLE public.tbl_medico (
	id serial NOT NULL,
	crm varchar(20) NOT NULL,
	especialidade varchar(50) NOT NULL,
	id_tbl_clinica integer,
-- 	nome varchar(100) NOT NULL,
-- 	cpf varchar(11) NOT NULL,
-- 	data_nascimento date NOT NULL,
-- 	id_tbl_endereco integer,
-- 	id_tbl_user integer,
-- 	id_tbl_telefone integer,
	CONSTRAINT tbl_medico_pk PRIMARY KEY (id)
)
 INHERITS(public.tbl_paciente);
-- ddl-end --
ALTER TABLE public.tbl_medico OWNER TO postgres;
-- ddl-end --

-- object: public.tbl_consulta | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_consulta CASCADE;
CREATE TABLE public.tbl_consulta (
	id serial NOT NULL,
	data date NOT NULL,
	horario_inicio time NOT NULL,
	horario_fim time NOT NULL,
	id_tbl_paciente integer,
	id_tbl_medico integer,
	CONSTRAINT tbl_consulta_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_consulta OWNER TO postgres;
-- ddl-end --

-- object: public.tbl_avaliacao | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_avaliacao CASCADE;
CREATE TABLE public.tbl_avaliacao (
	id serial NOT NULL,
	nota numeric(2) NOT NULL,
	comentario varchar(100) NOT NULL,
	id_tbl_consulta integer,
	CONSTRAINT tbl_avaliacao_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_avaliacao OWNER TO postgres;
-- ddl-end --

-- object: public.tbl_endereco | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_endereco CASCADE;
CREATE TABLE public.tbl_endereco (
	id serial NOT NULL,
	rua varchar(100) NOT NULL,
	bairro varchar(50) NOT NULL,
	numero numeric(5) NOT NULL,
	complemento varchar(100),
	cidade varchar(50) NOT NULL,
	CONSTRAINT tbl_endereco_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_endereco OWNER TO postgres;
-- ddl-end --

-- object: public.tbl_lembrete | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_lembrete CASCADE;
CREATE TABLE public.tbl_lembrete (
	id serial NOT NULL,
	status varchar NOT NULL,
	mensagem varchar(150) NOT NULL,
	id_tbl_consulta integer,
	CONSTRAINT tbl_lembrete_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_lembrete OWNER TO postgres;
-- ddl-end --

-- object: tbl_consulta_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_avaliacao DROP CONSTRAINT IF EXISTS tbl_consulta_fk CASCADE;
ALTER TABLE public.tbl_avaliacao ADD CONSTRAINT tbl_consulta_fk FOREIGN KEY (id_tbl_consulta)
REFERENCES public.tbl_consulta (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_avaliacao_uq | type: CONSTRAINT --
-- ALTER TABLE public.tbl_avaliacao DROP CONSTRAINT IF EXISTS tbl_avaliacao_uq CASCADE;
ALTER TABLE public.tbl_avaliacao ADD CONSTRAINT tbl_avaliacao_uq UNIQUE (id_tbl_consulta);
-- ddl-end --

-- object: tbl_consulta_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_lembrete DROP CONSTRAINT IF EXISTS tbl_consulta_fk CASCADE;
ALTER TABLE public.tbl_lembrete ADD CONSTRAINT tbl_consulta_fk FOREIGN KEY (id_tbl_consulta)
REFERENCES public.tbl_consulta (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_paciente_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_consulta DROP CONSTRAINT IF EXISTS tbl_paciente_fk CASCADE;
ALTER TABLE public.tbl_consulta ADD CONSTRAINT tbl_paciente_fk FOREIGN KEY (id_tbl_paciente)
REFERENCES public.tbl_paciente (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_medico_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_consulta DROP CONSTRAINT IF EXISTS tbl_medico_fk CASCADE;
ALTER TABLE public.tbl_consulta ADD CONSTRAINT tbl_medico_fk FOREIGN KEY (id_tbl_medico)
REFERENCES public.tbl_medico (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_clinica_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_medico DROP CONSTRAINT IF EXISTS tbl_clinica_fk CASCADE;
ALTER TABLE public.tbl_medico ADD CONSTRAINT tbl_clinica_fk FOREIGN KEY (id_tbl_clinica)
REFERENCES public.tbl_clinica (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_endereco_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_paciente DROP CONSTRAINT IF EXISTS tbl_endereco_fk CASCADE;
ALTER TABLE public.tbl_paciente ADD CONSTRAINT tbl_endereco_fk FOREIGN KEY (id_tbl_endereco)
REFERENCES public.tbl_endereco (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: public.tbl_user | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_user CASCADE;
CREATE TABLE public.tbl_user (
	id serial NOT NULL,
	email varchar(100) NOT NULL,
	senha varchar(100) NOT NULL,
	nivel_permissao numeric(1) NOT NULL,
	CONSTRAINT tbl_user_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_user OWNER TO postgres;
-- ddl-end --

-- object: tbl_user_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_clinica DROP CONSTRAINT IF EXISTS tbl_user_fk CASCADE;
ALTER TABLE public.tbl_clinica ADD CONSTRAINT tbl_user_fk FOREIGN KEY (id_tbl_user)
REFERENCES public.tbl_user (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_clinica_uq | type: CONSTRAINT --
-- ALTER TABLE public.tbl_clinica DROP CONSTRAINT IF EXISTS tbl_clinica_uq CASCADE;
ALTER TABLE public.tbl_clinica ADD CONSTRAINT tbl_clinica_uq UNIQUE (id_tbl_user);
-- ddl-end --

-- object: tbl_user_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_paciente DROP CONSTRAINT IF EXISTS tbl_user_fk CASCADE;
ALTER TABLE public.tbl_paciente ADD CONSTRAINT tbl_user_fk FOREIGN KEY (id_tbl_user)
REFERENCES public.tbl_user (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_paciente_uq | type: CONSTRAINT --
-- ALTER TABLE public.tbl_paciente DROP CONSTRAINT IF EXISTS tbl_paciente_uq CASCADE;
ALTER TABLE public.tbl_paciente ADD CONSTRAINT tbl_paciente_uq UNIQUE (id_tbl_user);
-- ddl-end --

-- object: tbl_telefone_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_clinica DROP CONSTRAINT IF EXISTS tbl_telefone_fk CASCADE;
ALTER TABLE public.tbl_clinica ADD CONSTRAINT tbl_telefone_fk FOREIGN KEY (id_tbl_telefone)
REFERENCES public.tbl_telefone (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_clinica_uq1 | type: CONSTRAINT --
-- ALTER TABLE public.tbl_clinica DROP CONSTRAINT IF EXISTS tbl_clinica_uq1 CASCADE;
ALTER TABLE public.tbl_clinica ADD CONSTRAINT tbl_clinica_uq1 UNIQUE (id_tbl_telefone);
-- ddl-end --

-- object: tbl_endereco_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_clinica DROP CONSTRAINT IF EXISTS tbl_endereco_fk CASCADE;
ALTER TABLE public.tbl_clinica ADD CONSTRAINT tbl_endereco_fk FOREIGN KEY (id_tbl_endereco)
REFERENCES public.tbl_endereco (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: tbl_telefone_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_paciente DROP CONSTRAINT IF EXISTS tbl_telefone_fk CASCADE;
ALTER TABLE public.tbl_paciente ADD CONSTRAINT tbl_telefone_fk FOREIGN KEY (id_tbl_telefone)
REFERENCES public.tbl_telefone (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: public.tbl_horario_atendimento | type: TABLE --
-- DROP TABLE IF EXISTS public.tbl_horario_atendimento CASCADE;
CREATE TABLE public.tbl_horario_atendimento (
	id serial NOT NULL,
	dia_semana smallint NOT NULL,
	data_inicio date NOT NULL,
	data_fim date NOT NULL,
	horario_inicio time NOT NULL,
	horario_fim time NOT NULL,
	id_tbl_medico integer,
	CONSTRAINT tbl_horario_atendimento_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.tbl_horario_atendimento OWNER TO postgres;
-- ddl-end --

-- object: tbl_medico_fk | type: CONSTRAINT --
-- ALTER TABLE public.tbl_horario_atendimento DROP CONSTRAINT IF EXISTS tbl_medico_fk CASCADE;
ALTER TABLE public.tbl_horario_atendimento ADD CONSTRAINT tbl_medico_fk FOREIGN KEY (id_tbl_medico)
REFERENCES public.tbl_medico (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --


