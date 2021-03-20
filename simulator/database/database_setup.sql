DROP TABLE IF EXISTS users CASCADE; 
DROP TABLE IF EXISTS courses CASCADE; 
DROP TABLE IF EXISTS instructs CASCADE; 
DROP TABLE IF EXISTS enrolled CASCADE; 
DROP TABLE IF EXISTS scenario CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS importance CASCADE;
DROP TABLE IF EXISTS score CASCADE;
DROP TABLE IF EXISTS partof CASCADE; -- contains
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS prompt CASCADE;
DROP TABLE IF EXISTS conversation_task CASCADE;
DROP TABLE IF EXISTS mcq CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS response CASCADE;
DROP TABLE IF EXISTS prompt_response CASCADE;
DROP TABLE IF EXISTS conversation_choices CASCADE;
DROP TABLE IF EXISTS mcq_response CASCADE;
DROP TABLE IF EXISTS stakeholders CASCADE;
DROP TABLE IF EXISTS conversation CASCADE;
DROP TABLE IF EXISTS question CASCADE;
DROP TABLE IF EXISTS mcq_option CASCADE; -- option

DROP TYPE IF EXISTS simulation_status CASCADE;

CREATE TABLE "users" (
	"id" SERIAL,
	PRIMARY KEY (id),
	"full_name" VARCHAR NOT NULL CHECK (full_name <> ''),
	"email" CHAR(254) NOT NULL CHECK (email <> ''),
	"demographics" VARCHAR
);  

CREATE TABLE "courses" (
	"id" SERIAL PRIMARY KEY,
	"webpage" VARCHAR NOT NULL,
	"name" VARCHAR NOT NULL CHECK (name <> ''),
	"semester" CHAR(10) NOT NULL CHECK (semester <> '')
);

CREATE TABLE "instructs" (
	"instructor_id" INT REFERENCES users,
	"webpage" VARCHAR NOT NULL,
	"course_id" INT REFERENCES courses,
	PRIMARY KEY("course_id", "instructor_id")
);

CREATE TABLE "enrolled" (
	"student_id" INT REFERENCES users,
	"course_id" INT REFERENCES courses,
	PRIMARY KEY("student_id", "course_id")
);

CREATE TYPE simulation_status AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TABLE "scenario" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR NOT NULL CHECK(name <> ''),
	"due_date" TIMESTAMP,
	"description" VARCHAR NOT NULL,
	"status" simulation_status DEFAULT 'DRAFT',
	"additional_data" VARCHAR
); 

CREATE TABLE "partof" (
	"course_id" INT REFERENCES courses,
	"scenario_id" INT REFERENCES scenario
);

-- TODO: make type below an ENUM
CREATE TABLE "pages" (
	"id" SERIAL PRIMARY KEY,
	"order" INT NOT NULL,
	"type" CHAR(5) NOT NULL,
	"body_text" VARCHAR NOT NULL,
	"scenario_id" INT REFERENCES scenario
);

CREATE TABLE "prompt" (
	"page_id" INT REFERENCES pages,
	"prompt" VARCHAR NOT NULL CHECK (prompt <> ''),
	"prompt_num" INT NOT NULL CHECK (prompt_num > 0),
	PRIMARY KEY(page_id, prompt_num)
);

CREATE TABLE "conversation_task" (
	"page_id" INT REFERENCES pages PRIMARY KEY,
	"conversation_limit" INT NOT NULL CHECK("conversation_limit" > 0)
);

CREATE TABLE "stakeholders" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR NOT NULL CHECK ("name" <> ''),
	"designation" VARCHAR,
	"description" VARCHAR NOT NULL,
	"conversation" VARCHAR NOT NULL,
	"scenario_id" INT REFERENCES scenario,
	"conversation_task_id" INT REFERENCES conversation_task
);

CREATE TABLE "conversation" (
	"id" SERIAL PRIMARY KEY,
	"stakeholder_id" INT REFERENCES stakeholders,
	"question" varchar,
	"conversation_text" VARCHAR
);

CREATE TABLE "issues" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR NOT NULL CHECK("name" <> ''),
	"description" VARCHAR NOT NULL,
	-- Do not need high precision so not using NUMERIC type
	"importance" REAL NOT NULL CHECK ("importance" >= 0 AND "importance" <= 1)
);


CREATE TABLE "score" (
	"stakeholder_id" INT REFERENCES stakeholders,
	"issue_id" INT REFERENCES issues,
	PRIMARY KEY (stakeholder_id, issue_id),
	"value" INT NOT NULL CHECK("value" >= 0 AND "value" <= 4)
);

-- Probably redundant
CREATE TABLE "mcq" (
	"page_id" INT REFERENCES pages PRIMARY KEY
);


CREATE TABLE "question" (
	"id" SERIAL PRIMARY KEY,
	"question" VARCHAR NOT NULL CHECK(question <> ''),
	"mcq_id" INT REFERENCES mcq
);

CREATE TABLE "mcq_option" (
	"id" SERIAL PRIMARY KEY,
	"option" VARCHAR NOT NULL CHECK("option" <> ''),
	"question_id" INT REFERENCES question,
	UNIQUE(question_id, "option")
);

CREATE TABLE "submissions" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES users,
	"scenario_id" INT REFERENCES scenario,
	"submission_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(user_id, scenario_id)
);

CREATE TABLE "response" (
	"id" SERIAL PRIMARY KEY,
	"submission_id" INT REFERENCES submissions,
	"page_id" INT REFERENCES pages,
	"time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(submission_id, page_id)
);

CREATE TABLE "prompt_response" (
	"id" INT REFERENCES response,
	"prompt_num" INT NOT NULL CHECK (prompt_num > 0),
	"response" VARCHAR NOT NULL,
	PRIMARY KEY (id, prompt_num)
);

CREATE TABLE "conversation_choices" (
	"id" INT REFERENCES response,
	"stakeholder_id" INT REFERENCES "stakeholders",
	PRIMARY KEY (id, stakeholder_id)
);

CREATE TABLE "mcq_response" (
	"id" INT REFERENCES response,
	"question_id" INT REFERENCES question,
	PRIMARY KEY (id, question_id),
	"choice_id" INT REFERENCES mcq_option
);
