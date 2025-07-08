-- Cria ou substitui a procedure de estatística
CREATE OR REPLACE PROCEDURE public.sp_gerar_estatistica(p_competicao INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Apaga estatística anterior
  DELETE FROM estatistica WHERE id_competicao = p_competicao;

  -- Insere nova estatística agregada
  INSERT INTO estatistica (
    media_tempo,
    taxa_acerto,
    problema_mais_dificil,
    id_competicao
  )
  SELECT
    AVG(EXTRACT(EPOCH FROM (NOW() - s.timestamp))),                       -- média em segundos
    (SUM(CASE WHEN s.status = 'aceito' THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
    (
      SELECT p2.titulo
      FROM problema p2
      JOIN submissao s2 ON p2.id_problema = s2.id_problema
      WHERE p2.id_competicao = p_competicao
      GROUP BY p2.id_problema, p2.titulo
      ORDER BY SUM(CASE WHEN s2.status = 'aceito' THEN 1 ELSE 0 END) ASC
      LIMIT 1
    ),
    p_competicao
  FROM submissao s
  JOIN problema p ON s.id_problema = p.id_problema
  WHERE p.id_competicao = p_competicao;
END;
$$;
