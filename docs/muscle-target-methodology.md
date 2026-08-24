# Metodologia dos músculos-alvo

Atualização: 24 de agosto de 2026.

## Critério usado no FitPlan

O campo **Músculo-alvo** descreve os principais motores do padrão de movimento e, quando útil, a porção anatômica mais favorecida. Sinergistas relevantes aparecem quando ajudam a interpretar corretamente um exercício composto, como romboides e trapézio médio nas remadas.

Atividade eletromiográfica aguda não é tratada como prova isolada de hipertrofia. A classificação combina ação articular, anatomia funcional, estudos de EMG/biomecânica e, quando disponíveis, estudos longitudinais com ultrassom ou ressonância magnética. As diferenças individuais de técnica, amplitude, antropometria e máquina continuam relevantes.

Os nomes foram normalizados em português anatômico, incluindo: latíssimo do dorso (grande dorsal), romboides, porções do trapézio e deltoide, músculos do manguito rotador, porções do peitoral maior, cabeças do tríceps braquial, flexores do cotovelo, quadríceps femoral, isquiotibiais, adutores, glúteos e tríceps sural.

## Decisões principais

| Família de exercício | Classificação principal |
| --- | --- |
| Remadas | Latíssimo do dorso, trapézio médio/inferior, romboides e deltoide posterior |
| Puxadas e barra fixa | Latíssimo do dorso, redondo maior e bíceps braquial |
| Face pull | Deltoide posterior, infraespinhal, redondo menor, trapézio médio e romboides |
| Supino reto/máquina | Peitoral maior, com tríceps braquial como motor relevante |
| Supino inclinado | Porção clavicular do peitoral maior e deltoide anterior |
| Elevação lateral | Deltoide lateral e supraespinhal |
| Desenvolvimento | Deltoide anterior/lateral e tríceps braquial |
| Roscas supinadas | Bíceps braquial e braquial |
| Rosca martelo | Braquial, braquiorradial e bíceps braquial |
| Tríceps acima da cabeça | Tríceps braquial, com ênfase na cabeça longa |
| Agachamentos e hack | Quadríceps femoral, glúteo máximo e adutor magno |
| Leg press | Quadríceps femoral e glúteo máximo; pés altos acrescentam maior relevância dos isquiotibiais |
| RDL/stiff | Isquiotibiais e glúteo máximo |
| Flexoras | Bíceps femoral, semitendíneo e semimembranáceo |
| Elevação pélvica/coice | Glúteo máximo |
| Abdutora | Glúteo médio e glúteo mínimo |
| Panturrilha em pé | Gastrocnêmio medial/lateral e sóleo |
| Panturrilha sentada | Sóleo |
| Abdominais com flexão do tronco | Reto abdominal e oblíquos |

## Literatura primária de apoio

- Plotkin et al. (2023), agachamento versus hip thrust, hipertrofia por ressonância magnética: [PMID 37877099](https://pubmed.ncbi.nlm.nih.gov/37877099/).
- Kinoshita et al. (2023), panturrilha em pé versus sentada e hipertrofia do tríceps sural: [PMID 38156065](https://pubmed.ncbi.nlm.nih.gov/38156065/).
- Coratella et al. (2022), RDL e stiff, glúteos, isquiotibiais e eretores da coluna: [PMID 35162922](https://pubmed.ncbi.nlm.nih.gov/35162922/).
- Maeo et al. (2021), flexora sentada versus deitada e hipertrofia dos isquiotibiais: [PMID 33009197](https://pubmed.ncbi.nlm.nih.gov/33009197/).
- Paz et al. (2022), abdutora e relação glúteo médio/tensor da fáscia lata: [PMID 35500965](https://pubmed.ncbi.nlm.nih.gov/35500965/).
- Maniar et al. (2023), forças nos glúteos em exercícios unilaterais: [PMID 36918403](https://pubmed.ncbi.nlm.nih.gov/36918403/).
- Rodríguez-Ridao et al. (2020), inclinação do supino e porções do peitoral maior: [PMID 33049982](https://pubmed.ncbi.nlm.nih.gov/33049982/).
- Larsen et al. (2025), elevação lateral com halter versus cabo e hipertrofia do deltoide lateral: [PMID 40692697](https://pubmed.ncbi.nlm.nih.gov/40692697/).
- Estudo com EMG de alta densidade (2026), remada sentada e distribuição de atividade no latíssimo, trapézio e deltoide posterior: [PMID 41562724](https://pubmed.ncbi.nlm.nih.gov/41562724/).
- Buonsenso et al. (2025), puxada alta, pegadas e atividade dos músculos das costas: [PMID 40981044](https://pubmed.ncbi.nlm.nih.gov/40981044/).
- Fujita et al. (2020), latíssimo do dorso, redondo maior, bíceps e deltoide posterior na remada: [PMID 32448047](https://pubmed.ncbi.nlm.nih.gov/32448047/).
- Uysal et al. (2026), pegadas da rosca e atividade do bíceps/braquiorradial: [PMID 42426831](https://pubmed.ncbi.nlm.nih.gov/42426831/).
- Maeo et al. (2023), extensão de cotovelo acima da cabeça e hipertrofia das cabeças do tríceps: [PMID 35819335](https://pubmed.ncbi.nlm.nih.gov/35819335/).
- Gomirato e Grenier (2024), segmentos do reto abdominal no crunch e elevação das pernas: [PMID 38288259](https://pubmed.ncbi.nlm.nih.gov/38288259/).

## Manutenção e teste

A resolução anatômica está centralizada em `inferPrepGroupFromName` no `index.html`. A categoria ampla usada para séries preparatórias permanece separada em `inferWarmupGroup`, evitando mudanças acidentais no aquecimento.

Execute `node scripts/audit-muscle-targets.js` sempre que um exercício for adicionado ou renomeado. O teste audita os nomes e variações e falha se algum item ficar sem classificação específica.
