CREATE OR REPLACE VIEW view_estatisticas_participante AS
SELECT
    p.id_usuario AS participante_id,
    u.nome AS participante_nome,
    p.instituicao AS universidade,
    COALESCE(COUNT(s.id_submissao), 0) AS total_submissoes,
    COALESCE(COUNT(CASE WHEN s.status = 'aceito' THEN 1 END), 0) AS problemas_resolvidos,
    0 AS tempo_total, -- Não há campo de tempo, ajuste se necessário
    RANK() OVER (
        ORDER BY COALESCE(COUNT(CASE WHEN s.status = 'aceito' THEN 1 END), 0) DESC
    ) AS ranking
FROM
    participante p
JOIN
    usuario u ON p.id_usuario = u.id_usuario
LEFT JOIN
    submissao s ON s.id_usuario = p.id_usuario
GROUP BY
    p.id_usuario, u.nome, p.instituicao; 