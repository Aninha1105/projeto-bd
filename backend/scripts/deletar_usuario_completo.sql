CREATE OR REPLACE PROCEDURE deletar_usuario_completo(
  p_id_usuario INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Inicia bloco principal com tratamento de exceções
  BEGIN
    -- 1. Submissões (participante)
    IF EXISTS (SELECT 1 FROM submissao WHERE id_usuario = p_id_usuario) THEN
      DELETE FROM submissao WHERE id_usuario = p_id_usuario;
      RAISE NOTICE 'Submissões do usuário % deletadas', p_id_usuario;
    END IF;

    -- 2. Inscrições (participante)
    IF EXISTS (SELECT 1 FROM inscricao WHERE id_usuario = p_id_usuario) THEN
      DELETE FROM inscricao WHERE id_usuario = p_id_usuario;
      RAISE NOTICE 'Inscrições do usuário % deletadas', p_id_usuario;
    END IF;

    -- 3. Participante
    IF EXISTS (SELECT 1 FROM participante WHERE id_usuario = p_id_usuario) THEN
      DELETE FROM participante WHERE id_usuario = p_id_usuario;
      RAISE NOTICE 'Registro de participante % deletado', p_id_usuario;
    END IF;

    -- 4. Patrocinador
    IF EXISTS (SELECT 1 FROM patrocinador WHERE id_usuario = p_id_usuario) THEN
      DELETE FROM patrocinador WHERE id_usuario = p_id_usuario;
      RAISE NOTICE 'Registro de patrocinador % deletado', p_id_usuario;
    END IF;

    -- 5. Colaborador
    IF EXISTS (SELECT 1 FROM colaborador WHERE id_usuario = p_id_usuario) THEN
      DELETE FROM colaborador WHERE id_usuario = p_id_usuario;
      RAISE NOTICE 'Registro de colaborador % deletado', p_id_usuario;
    END IF;

    -- 6. Relações competicao_patrocinador
    IF EXISTS (SELECT 1 FROM competicao_patrocinador WHERE id_usuario_patro = p_id_usuario) THEN
      DELETE FROM competicao_patrocinador WHERE id_usuario_patro = p_id_usuario;
      RAISE NOTICE 'Relações de patrocínio do usuário % removidas', p_id_usuario;
    END IF;

    -- 7. Usuário
    IF EXISTS (SELECT 1 FROM usuario WHERE id_usuario = p_id_usuario) THEN
      DELETE FROM usuario WHERE id_usuario = p_id_usuario;
      RAISE NOTICE 'Usuário % deletado com sucesso', p_id_usuario;
    ELSE
      RAISE NOTICE 'Usuário % não encontrado', p_id_usuario;
    END IF;

  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE WARNING 'Não foi possível deletar, violação de chave estrangeira: %', SQLERRM;
    WHEN OTHERS THEN
      RAISE WARNING 'Erro ao excluir usuário %: %', p_id_usuario, SQLERRM;
      -- Não propague o erro, apenas registre
  END;
END;
$$;
