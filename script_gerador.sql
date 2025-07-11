-- Criação dos tipos necessários
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_usuario') THEN
        CREATE TYPE tipo_usuario AS ENUM ('participante', 'colaborador', 'patrocinador');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'papel_colaborador') THEN
        CREATE TYPE papel_colaborador AS ENUM ('organizador', 'avaliador', 'outro');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nivel_problema') THEN
        CREATE TYPE nivel_problema AS ENUM ('facil', 'medio', 'dificil');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_submissao') THEN
        CREATE TYPE status_submissao AS ENUM ('aceita', 'rejeitada', 'pendente');
    END IF;
END$$;

CREATE TABLE public.alembic_version (
  version_num character varying NOT NULL,
  CONSTRAINT alembic_version_pkey PRIMARY KEY (version_num)
);

CREATE TABLE public.usuario (
  id_usuario integer NOT NULL DEFAULT nextval('usuario_id_usuario_seq'::regclass),
  nome character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  senha_hash character varying NOT NULL,
  tipo tipo_usuario NOT NULL,
  foto bytea,
  CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario)
);

CREATE TABLE public.equipe_colaboradores (
  id_equipe integer NOT NULL DEFAULT nextval('equipe_colaboradores_id_equipe_seq'::regclass),
  nome character varying NOT NULL,
  CONSTRAINT equipe_colaboradores_pkey PRIMARY KEY (id_equipe)
);

CREATE TABLE public.participante (
  id_usuario integer NOT NULL,
  instituicao character varying,
  CONSTRAINT participante_pkey PRIMARY KEY (id_usuario),
  CONSTRAINT participante_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario)
);

CREATE TABLE public.colaborador (
  id_usuario integer NOT NULL,
  papel papel_colaborador NOT NULL,
  id_equipe integer,
  instituicao character varying,
  CONSTRAINT colaborador_pkey PRIMARY KEY (id_usuario),
  CONSTRAINT colaborador_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario),
  CONSTRAINT colaborador_id_equipe_fkey FOREIGN KEY (id_equipe) REFERENCES public.equipe_colaboradores(id_equipe)
);

CREATE TABLE public.patrocinador (
  id_usuario integer NOT NULL,
  CONSTRAINT patrocinador_pkey PRIMARY KEY (id_usuario),
  CONSTRAINT patrocinador_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario)
);

CREATE TABLE public.competicao (
  id_competicao integer NOT NULL DEFAULT nextval('competicao_id_competicao_seq'::regclass),
  nome character varying NOT NULL,
  local character varying,
  data date NOT NULL,
  id_equipe integer NOT NULL,
  horario time without time zone,
  max_participantes integer,
  descricao text,
  finalizada boolean NOT NULL DEFAULT false,
  CONSTRAINT competicao_pkey PRIMARY KEY (id_competicao),
  CONSTRAINT competicao_id_equipe_fkey FOREIGN KEY (id_equipe) REFERENCES public.equipe_colaboradores(id_equipe)
);

CREATE TABLE public.estatistica (
  id_estatistica integer NOT NULL DEFAULT nextval('estatistica_id_estatistica_seq'::regclass),
  media_tempo numeric,
  taxa_acerto numeric,
  problema_mais_dificil character varying,
  id_competicao integer UNIQUE,
  CONSTRAINT estatistica_pkey PRIMARY KEY (id_estatistica),
  CONSTRAINT estatistica_id_competicao_fkey FOREIGN KEY (id_competicao) REFERENCES public.competicao(id_competicao)
);

CREATE TABLE public.problema (
  id_problema integer NOT NULL DEFAULT nextval('problema_id_problema_seq'::regclass),
  titulo character varying NOT NULL,
  nivel nivel_problema NOT NULL,
  link character varying NOT NULL,
  id_competicao integer,
  CONSTRAINT problema_pkey PRIMARY KEY (id_problema),
  CONSTRAINT problema_id_competicao_fkey FOREIGN KEY (id_competicao) REFERENCES public.competicao(id_competicao)
);

CREATE TABLE public.inscricao (
  id_inscricao integer NOT NULL DEFAULT nextval('inscricao_id_inscricao_seq'::regclass),
  categoria character varying,
  id_usuario integer,
  id_competicao integer,
  CONSTRAINT inscricao_pkey PRIMARY KEY (id_inscricao),
  CONSTRAINT inscricao_id_competicao_fkey FOREIGN KEY (id_competicao) REFERENCES public.competicao(id_competicao),
  CONSTRAINT inscricao_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.participante(id_usuario)
);

CREATE TABLE public.submissao (
  id_submissao integer NOT NULL DEFAULT nextval('submissao_id_submissao_seq'::regclass),
  timestamp timestamp without time zone NOT NULL,
  status status_submissao NOT NULL,
  id_problema integer,
  id_usuario integer,
  CONSTRAINT submissao_pkey PRIMARY KEY (id_submissao),
  CONSTRAINT submissao_id_problema_fkey FOREIGN KEY (id_problema) REFERENCES public.problema(id_problema),
  CONSTRAINT submissao_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.participante(id_usuario)
);

CREATE TABLE public.competicao_patrocinador (
  id_link integer NOT NULL DEFAULT nextval('competicao_patrocinador_id_link_seq'::regclass),
  id_competicao integer,
  id_usuario_patro integer,
  contribuicao numeric NOT NULL,
  CONSTRAINT competicao_patrocinador_pkey PRIMARY KEY (id_link),
  CONSTRAINT competicao_patrocinador_id_usuario_patro_fkey FOREIGN KEY (id_usuario_patro) REFERENCES public.patrocinador(id_usuario),
  CONSTRAINT competicao_patrocinador_id_competicao_fkey FOREIGN KEY (id_competicao) REFERENCES public.competicao(id_competicao)
);