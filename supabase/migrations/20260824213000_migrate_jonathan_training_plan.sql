begin;

do $$
declare
  payload jsonb := $payload${
  "profile_key": "jonathan",
  "plan": {
    "id": "8080b379-a054-57d9-88b0-1c0996ed976d",
    "title": "PPL + Upper/Lower 5x",
    "goal": "Reduzir gordura preservando massa muscular e desempenho.",
    "methodology": "PPL + Lower/Upper, cinco sessões semanais, autorregulação por RIR e progressão dupla.",
    "science_rationale": "A disponibilidade e a experiência permitem distribuir o volume em cinco sessões. PPL organiza o trabalho específico e Lower/Upper fornece um segundo estímulo aos grupos prioritários. A maior parte das séries termina com 1–2 repetições em reserva para equilibrar estímulo e fadiga durante a redução de gordura.",
    "status": "active",
    "version": 1,
    "starts_on": "2026-08-09"
  },
  "days": [
    {
      "id": "840fbc26-d0fe-5d22-b689-98d8823d674f",
      "plan_id": "8080b379-a054-57d9-88b0-1c0996ed976d",
      "day_key": "legsA",
      "title": "Segunda • Lower A • Quadríceps",
      "weekday": 1,
      "position": 0,
      "notes": "Aquecimento: 5 min cardio + mobilidade de quadril/tornozelo + séries preparatórias no hack\n18 séries • ~70–85 min"
    },
    {
      "id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "plan_id": "8080b379-a054-57d9-88b0-1c0996ed976d",
      "day_key": "pushA",
      "title": "Terça • Push A • Peito + Tríceps pesado",
      "weekday": 2,
      "position": 1,
      "notes": "Aquecimento: 5 min cardio + séries preparatórias no primeiro supino e no primeiro tríceps\n22 séries • ~75–90 min"
    },
    {
      "id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "plan_id": "8080b379-a054-57d9-88b0-1c0996ed976d",
      "day_key": "pullA",
      "title": "Quarta • Pull • Costas + Bíceps pesado",
      "weekday": 3,
      "position": 2,
      "notes": "Aquecimento: 5 min cardio + séries preparatórias na primeira remada e na primeira rosca\n18 séries • ~70–85 min"
    },
    {
      "id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "plan_id": "8080b379-a054-57d9-88b0-1c0996ed976d",
      "day_key": "legsB",
      "title": "Sexta • Lower B • Quadríceps + Posterior/Glúteo",
      "weekday": 5,
      "position": 3,
      "notes": "Aquecimento: 5 min cardio + mobilidade de quadril/tornozelo + séries preparatórias no leg press\n21 séries + cardio • ~75–90 min"
    },
    {
      "id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "plan_id": "8080b379-a054-57d9-88b0-1c0996ed976d",
      "day_key": "pullB",
      "title": "Sábado • Upper • Costas + Peito + Braços",
      "weekday": 6,
      "position": 4,
      "notes": "Aquecimento: 5 min cardio + mobilidade de ombro + séries preparatórias na primeira puxada e no primeiro supino\n26 séries • ~85–90 min"
    }
  ],
  "catalog": [
    {
      "id": "a3cc42df-48e6-531d-8542-01a52663cb2f",
      "slug": "legacy-lower-a-squat",
      "name": "Hack squat",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "adutor magno"
      ],
      "equipment": "Máquina",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/sled-hack-squat.webp",
      "instructions": []
    },
    {
      "id": "165d01d2-21dd-592f-9589-2738f3bf1c8c",
      "slug": "legacy-lower-a-squat-smith",
      "name": "Agachamento no Smith",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "adutor magno"
      ],
      "equipment": "Smith",
      "media_url": "https://static.exercisedb.dev/media/jFtipLl.gif",
      "instructions": []
    },
    {
      "id": "9fa6b4eb-6fdc-5d42-bd2b-0a763ddef0d2",
      "slug": "legacy-lower-a-squat-leg-press",
      "name": "Leg press 45° — pés médios",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/2Qh2J1e.gif",
      "instructions": []
    },
    {
      "id": "536e3081-d90e-5764-940c-ebf40bc6918a",
      "slug": "legacy-lower-a-leg-press",
      "name": "Leg press 45°",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/2Qh2J1e.gif",
      "instructions": []
    },
    {
      "id": "a14bc479-8629-5ec1-88a7-786b69e369cc",
      "slug": "legacy-lower-a-leg-press-horizontal",
      "name": "Leg press horizontal",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/9KU9TYF.gif",
      "instructions": []
    },
    {
      "id": "baab6572-5f0a-5cef-bd4c-fa8666cecc1c",
      "slug": "legacy-fernando-la-smith-squat",
      "name": "Agachamento no Smith",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "adutor magno"
      ],
      "equipment": "Smith",
      "media_url": "https://static.exercisedb.dev/media/jFtipLl.gif",
      "instructions": []
    },
    {
      "id": "dd9ecb2a-91f3-5559-bbca-847d1b0b2738",
      "slug": "legacy-fernando-la-smith-squat-hack",
      "name": "Hack squat",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "adutor magno"
      ],
      "equipment": "Máquina",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/sled-hack-squat.webp",
      "instructions": []
    },
    {
      "id": "b23a0567-14a1-57e4-b349-3b12fa0ab3a1",
      "slug": "legacy-lower-a-ext",
      "name": "Cadeira extensora bilateral",
      "target_muscles": [
        "Quadríceps femoral: reto femoral e vastos"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/my33uHU.gif",
      "instructions": []
    },
    {
      "id": "f4619f7b-32be-5af6-9345-02a340220782",
      "slug": "legacy-lower-a-ext-unilateral",
      "name": "Cadeira extensora unilateral",
      "target_muscles": [
        "Quadríceps femoral: reto femoral e vastos"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/my33uHU.gif",
      "instructions": []
    },
    {
      "id": "94ebb980-58d8-523a-9a2e-6f7688a2932a",
      "slug": "legacy-lower-b-hamstring",
      "name": "Cadeira flexora",
      "target_muscles": [
        "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo"
      ],
      "equipment": "Máquina",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/lever-seated-leg-curl.webp",
      "instructions": []
    },
    {
      "id": "133b0a02-9d5e-5d2f-ae1d-6d1c67a038ec",
      "slug": "legacy-lower-b-hamstring-deitada",
      "name": "Mesa flexora",
      "target_muscles": [
        "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/17lJ1kr.gif",
      "instructions": []
    },
    {
      "id": "4bf6126e-9f95-5ceb-9e4c-c312c649ab05",
      "slug": "legacy-lower-a-calf",
      "name": "Panturrilha em pé na máquina",
      "target_muscles": [
        "Gastrocnêmio medial e lateral",
        "sóleo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/ykUOVze.gif",
      "instructions": []
    },
    {
      "id": "ccc8658d-5a69-5bbc-8532-43042bfaa0c1",
      "slug": "legacy-lower-a-calf-sentada",
      "name": "Panturrilha sentada",
      "target_muscles": [
        "Sóleo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/bOOdeyc.gif",
      "instructions": []
    },
    {
      "id": "ddaaae45-5940-5414-8082-fb6ca23caa5b",
      "slug": "legacy-upper-a-incline-db",
      "name": "Supino inclinado com halteres — pegada neutra",
      "target_muscles": [
        "Peitoral maior (porção clavicular)",
        "deltoide anterior"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/PG1kcIb.gif",
      "instructions": []
    },
    {
      "id": "d2883784-cd24-58f5-be3e-b1d6aa05f1ac",
      "slug": "legacy-upper-a-incline-db-maquina",
      "name": "Supino inclinado na máquina",
      "target_muscles": [
        "Peitoral maior (porção clavicular)",
        "deltoide anterior"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/jHAnWmT.gif",
      "instructions": []
    },
    {
      "id": "4ca9deaa-5382-53e4-9d0d-a0e026175b9f",
      "slug": "legacy-upper-a-incline-db-smith",
      "name": "Supino inclinado no Smith",
      "target_muscles": [
        "Peitoral maior (porção clavicular)",
        "deltoide anterior"
      ],
      "equipment": "Smith",
      "media_url": "https://static.exercisedb.dev/media/5v7KYld.gif",
      "instructions": []
    },
    {
      "id": "6fd1965c-3608-59ce-9b7b-2a724d3a24b3",
      "slug": "legacy-upper-b-chest-machine",
      "name": "Supino reto máquina convergente",
      "target_muscles": [
        "Peitoral maior (porções esternocostal e clavicular)",
        "tríceps braquial"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/DOoWcnA.gif",
      "instructions": []
    },
    {
      "id": "6f82b2d6-0d2a-5460-bea0-acdeb5319923",
      "slug": "legacy-upper-b-chest-machine-halteres",
      "name": "Supino reto com halteres",
      "target_muscles": [
        "Peitoral maior (porções esternocostal e clavicular)",
        "tríceps braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/SpYC0Kp.gif",
      "instructions": []
    },
    {
      "id": "6f1abacb-c071-59dd-8168-93673b2c14af",
      "slug": "legacy-upper-b-chest-machine-declinado",
      "name": "Supino declinado com halteres",
      "target_muscles": [
        "Peitoral maior (porção esternocostal)"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/1qrWgZ2.gif",
      "instructions": []
    },
    {
      "id": "3b3b2c19-0da2-5ec3-a8d7-ebf49317d564",
      "slug": "legacy-upper-a-fly",
      "name": "Crossover de cima para baixo",
      "target_muscles": [
        "Peitoral maior (porção esternocostal)"
      ],
      "equipment": "Polia",
      "media_url": "https://gymvisual.com/img/p/4/8/8/8/4888.gif",
      "instructions": []
    },
    {
      "id": "c36b37b3-8ea2-5326-864e-17e931ec6ba2",
      "slug": "legacy-upper-a-fly-peck-deck",
      "name": "Crucifixo no peck deck",
      "target_muscles": [
        "Peitoral maior (porções esternocostal e clavicular)"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/v3xmPAR.gif",
      "instructions": []
    },
    {
      "id": "f1d159ef-b48c-5966-97af-633c4e468d23",
      "slug": "legacy-upper-a-fly-crossover-medio",
      "name": "Crossover na linha do peito",
      "target_muscles": [
        "Peitoral maior (porções esternocostal e clavicular)"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/0CXGHya.gif",
      "instructions": []
    },
    {
      "id": "778086cc-8b23-5a40-8026-d3b2d5e6a532",
      "slug": "legacy-full-body-shoulder-press",
      "name": "Desenvolvimento máquina pegada neutra",
      "target_muscles": [
        "Deltoide anterior e lateral",
        "tríceps braquial"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/vqsbmL0.gif",
      "instructions": []
    },
    {
      "id": "04d166c3-742b-55e9-b931-315aeb4df34e",
      "slug": "legacy-full-body-shoulder-press-halteres",
      "name": "Desenvolvimento sentado com halteres",
      "target_muscles": [
        "Deltoide anterior e lateral",
        "tríceps braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/znQUdHY.gif",
      "instructions": []
    },
    {
      "id": "38a26550-4cbf-5003-80a9-0701981c7260",
      "slug": "legacy-upper-a-lateral",
      "name": "Elevação lateral com halteres",
      "target_muscles": [
        "Deltoide lateral",
        "supraespinhal"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/DsgkuIt.gif",
      "instructions": []
    },
    {
      "id": "7bdbe3d3-c8c0-50a2-b2f5-5c94902a8477",
      "slug": "legacy-upper-a-lateral-polia",
      "name": "Elevação lateral na polia",
      "target_muscles": [
        "Deltoide lateral",
        "supraespinhal"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/goJ6ezq.gif",
      "instructions": []
    },
    {
      "id": "b61230d3-93b5-5fe3-aa26-7ccc1c4af76e",
      "slug": "legacy-upper-a-triceps",
      "name": "Tríceps francês no cabo",
      "target_muscles": [
        "Tríceps braquial (ênfase na cabeça longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/2IxROQ1.gif",
      "instructions": []
    },
    {
      "id": "319d5ba6-8ba3-5cc0-8793-a8f223653f72",
      "slug": "legacy-upper-a-triceps-frances-ez",
      "name": "Tríceps francês com barra EZ",
      "target_muscles": [
        "Tríceps braquial (ênfase na cabeça longa)"
      ],
      "equipment": "Barra EZ",
      "media_url": "https://static.exercisedb.dev/media/1cTf2Ux.gif",
      "instructions": []
    },
    {
      "id": "66b2e5d0-a127-53ea-abc0-0810013ff7b4",
      "slug": "legacy-upper-a-triceps-testa-cabo",
      "name": "Tríceps testa no cabo",
      "target_muscles": [
        "Tríceps braquial (ênfase na cabeça longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/cable-lying-triceps-extension.webp",
      "instructions": []
    },
    {
      "id": "2eb2655c-e000-5401-857e-6a21d06993ae",
      "slug": "legacy-upper-b-triceps-rope",
      "name": "Tríceps na polia com corda",
      "target_muscles": [
        "Tríceps braquial (cabeças lateral, medial e longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/dU605di.gif",
      "instructions": []
    },
    {
      "id": "98e47b95-427f-5fbd-ab95-adaea94b7899",
      "slug": "legacy-upper-b-triceps-rope-barra-v",
      "name": "Tríceps na polia com barra V",
      "target_muscles": [
        "Tríceps braquial (cabeças lateral, medial e longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://gymvisual.com/img/p/1/0/4/7/2/10472.gif",
      "instructions": []
    },
    {
      "id": "7bcfc3b5-6e07-512e-8bce-09f6bc684ada",
      "slug": "legacy-upper-a-abs-machine",
      "name": "Abdominal máquina",
      "target_muscles": [
        "Reto abdominal",
        "oblíquos"
      ],
      "equipment": "Máquina",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/lever-seated-crunch.gif",
      "instructions": []
    },
    {
      "id": "604c12eb-e609-55ac-90fe-5c773034f9d7",
      "slug": "legacy-upper-a-row",
      "name": "Remada máquina com peito apoiado",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/X3cqyXz.gif",
      "instructions": []
    },
    {
      "id": "ddee806f-660b-5f5b-9d6d-7281b926c251",
      "slug": "legacy-upper-a-row-remada-t-apoiada",
      "name": "Remada T com apoio no peito",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/aaXr7ld.gif",
      "instructions": []
    },
    {
      "id": "fb78ad9e-e390-5259-a92a-5d1957bc672a",
      "slug": "legacy-upper-a-row-polia-triangulo",
      "name": "Remada baixa na polia com triângulo",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/fUBheHs.gif",
      "instructions": []
    },
    {
      "id": "631a1af0-2590-5cd2-a1c8-2616f4c047f0",
      "slug": "legacy-upper-a-pulldown",
      "name": "Puxada alta neutra",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "redondo maior",
        "bíceps braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/rkg41Fb.gif",
      "instructions": []
    },
    {
      "id": "08a467fd-71f2-5ed6-a385-78e3d2727d8b",
      "slug": "legacy-upper-a-pulldown-supinada",
      "name": "Puxada alta supinada",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "redondo maior",
        "bíceps braquial"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/ky8FLU8.gif",
      "instructions": []
    },
    {
      "id": "d35ab691-2b3d-53a8-8202-32c58417c603",
      "slug": "legacy-upper-a-pulldown-pronada-media",
      "name": "Puxada alta pronada pegada média",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "redondo maior",
        "bíceps braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/RVwzP10.gif",
      "instructions": []
    },
    {
      "id": "2137684d-98bb-5da3-9086-462f4f20619e",
      "slug": "legacy-upper-b-unilateral-row",
      "name": "Remada unilateral articulada",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Máquina",
      "media_url": "https://gymvisual.com/img/p/6/6/1/4/6614.gif",
      "instructions": []
    },
    {
      "id": "bc113e9e-ccbb-531b-bc59-324f5e26beab",
      "slug": "legacy-upper-b-unilateral-row-halter-apoiado",
      "name": "Remada unilateral com halter apoiado",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/C0MA9bC.gif",
      "instructions": []
    },
    {
      "id": "fed8700f-d67a-5387-8537-f025049571e4",
      "slug": "legacy-full-body-straight-arm-pulldown",
      "name": "Pulldown com braços estendidos na polia",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "redondo maior"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/x69MAlq.gif",
      "instructions": []
    },
    {
      "id": "37c4f328-7fea-5ea0-9e60-3d423a2bd7bf",
      "slug": "legacy-full-body-straight-arm-pulldown-pullover-maquina",
      "name": "Pullover na máquina",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "redondo maior"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/4U7iLb5.gif",
      "instructions": []
    },
    {
      "id": "43aff30b-9ebd-5704-af24-89bf0d5e9c51",
      "slug": "legacy-upper-b-face-pull",
      "name": "Face pull na corda",
      "target_muscles": [
        "Deltoide posterior",
        "infraespinhal",
        "redondo menor",
        "trapézio médio",
        "romboides"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/ZfyAGhK.gif",
      "instructions": []
    },
    {
      "id": "2d68e92e-3a5f-5aeb-a728-a0aee1ca8d81",
      "slug": "legacy-upper-b-face-pull-peck-deck-inverso",
      "name": "Crucifixo inverso no peck deck",
      "target_muscles": [
        "Deltoide posterior",
        "trapézio médio",
        "romboides"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/myfUsKf.gif",
      "instructions": []
    },
    {
      "id": "2a31876a-0816-5d60-a4e0-99891016316e",
      "slug": "legacy-upper-a-curl",
      "name": "Rosca direta com barra EZ",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Barra EZ",
      "media_url": "https://static.exercisedb.dev/media/6TG6x2w.gif",
      "instructions": []
    },
    {
      "id": "02cabebc-c4d2-56da-97a3-aec1de54cc91",
      "slug": "legacy-upper-a-curl-polia",
      "name": "Rosca direta na polia",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/G08RZcQ.gif",
      "instructions": []
    },
    {
      "id": "36e89ca6-a408-50f0-9de7-3a50b7215b61",
      "slug": "legacy-upper-a-curl-halteres",
      "name": "Rosca direta com halteres",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/3s4NnTh.gif",
      "instructions": []
    },
    {
      "id": "2b81834f-9cad-5132-9ca7-aa984e704264",
      "slug": "legacy-upper-b-incline-curl",
      "name": "Rosca inclinada com halteres",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-incline-curl.webp",
      "instructions": []
    },
    {
      "id": "69203d96-b01e-5fcc-af3f-4274869042ce",
      "slug": "legacy-upper-b-incline-curl-scott-maquina",
      "name": "Rosca Scott na máquina",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/b6hQYMb.gif",
      "instructions": []
    },
    {
      "id": "10e97135-d4bd-5028-977b-84a2698fa775",
      "slug": "legacy-upper-b-incline-curl-polia",
      "name": "Rosca direta na polia",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/G08RZcQ.gif",
      "instructions": []
    },
    {
      "id": "f01c541f-6ba4-5787-a4ff-eb38afefefaf",
      "slug": "legacy-upper-b-hammer",
      "name": "Rosca martelo com halteres",
      "target_muscles": [
        "Braquial",
        "braquiorradial",
        "bíceps braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/IGtBdNT.gif",
      "instructions": []
    },
    {
      "id": "b6b34b0b-165b-5e1a-8687-307b2421ba77",
      "slug": "legacy-upper-b-hammer-corda",
      "name": "Rosca martelo com corda",
      "target_muscles": [
        "Braquial",
        "braquiorradial",
        "bíceps braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/HPlPoQA.gif",
      "instructions": []
    },
    {
      "id": "08b05742-5815-5eb0-bf9a-97ed394e3988",
      "slug": "legacy-full-body-horizontal-leg-press",
      "name": "Leg press horizontal",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/9KU9TYF.gif",
      "instructions": []
    },
    {
      "id": "73fe9e29-2108-5cb9-83f5-00ec0cc5ab5d",
      "slug": "legacy-full-body-horizontal-leg-press-45-graus",
      "name": "Leg press 45°",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/2Qh2J1e.gif",
      "instructions": []
    },
    {
      "id": "261a3b53-2264-596b-a2ac-1cdb57c2eaee",
      "slug": "legacy-jonathan-legs-b-hack",
      "name": "Hack squat com pés mais baixos",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "adutor magno"
      ],
      "equipment": "Máquina",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/sled-hack-squat.webp",
      "instructions": []
    },
    {
      "id": "eb4717cb-97be-5173-a572-c12bea61278f",
      "slug": "legacy-jonathan-legs-b-hack-smith",
      "name": "Agachamento no Smith com calcanhares elevados",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "adutor magno"
      ],
      "equipment": "Smith",
      "media_url": "https://static.exercisedb.dev/media/jFtipLl.gif",
      "instructions": []
    },
    {
      "id": "98860f74-192d-5242-869e-4f5ae09d0c5f",
      "slug": "legacy-jonathan-legs-b-ext",
      "name": "Cadeira extensora unilateral",
      "target_muscles": [
        "Quadríceps femoral: reto femoral e vastos"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/my33uHU.gif",
      "instructions": []
    },
    {
      "id": "538aa28a-e374-5c94-92ac-68a8c9959556",
      "slug": "legacy-jonathan-legs-b-ext-bilateral",
      "name": "Cadeira extensora bilateral",
      "target_muscles": [
        "Quadríceps femoral: reto femoral e vastos"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/my33uHU.gif",
      "instructions": []
    },
    {
      "id": "acf89de0-a553-5e88-bf7e-f3dbceefceae",
      "slug": "legacy-lower-b-hip-thrust",
      "name": "Elevação pélvica com barra",
      "target_muscles": [
        "Glúteo máximo"
      ],
      "equipment": "Barra",
      "media_url": "https://static.exercisedb.dev/media/qg2PGl6.gif",
      "instructions": []
    },
    {
      "id": "e6158bc7-c7db-528a-b794-fc99b2b4c7e2",
      "slug": "legacy-lower-b-hip-thrust-smith",
      "name": "Elevação pélvica no Smith",
      "target_muscles": [
        "Glúteo máximo"
      ],
      "equipment": "Smith",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/smith-hip-raise.webp",
      "instructions": []
    },
    {
      "id": "0c386a4b-7d0a-55d8-b86f-e8b7d58e1eaa",
      "slug": "legacy-jonathan-legs-b-curl",
      "name": "Cadeira flexora",
      "target_muscles": [
        "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo"
      ],
      "equipment": "Máquina",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/lever-seated-leg-curl.webp",
      "instructions": []
    },
    {
      "id": "5696504f-63ce-5cf3-9aff-9699818a36b6",
      "slug": "legacy-jonathan-legs-b-curl-deitada",
      "name": "Mesa flexora",
      "target_muscles": [
        "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/17lJ1kr.gif",
      "instructions": []
    },
    {
      "id": "92587fa7-d831-5746-8e9e-1f8716d83dc2",
      "slug": "legacy-jonathan-legs-b-lying-curl",
      "name": "Mesa flexora",
      "target_muscles": [
        "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/17lJ1kr.gif",
      "instructions": []
    },
    {
      "id": "0b8eb27a-98a8-5799-b8f4-def3b5147cb4",
      "slug": "legacy-jonathan-legs-b-lying-curl-sentada",
      "name": "Cadeira flexora",
      "target_muscles": [
        "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo"
      ],
      "equipment": "Máquina",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/lever-seated-leg-curl.webp",
      "instructions": []
    },
    {
      "id": "9f424d52-2ce7-54c8-b31a-ecc79353ee42",
      "slug": "legacy-lower-b-abductor",
      "name": "Abdução de quadril na máquina",
      "target_muscles": [
        "Glúteo médio",
        "glúteo mínimo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/CHpahtl.gif",
      "instructions": []
    },
    {
      "id": "777d6221-37a7-59c0-97ae-5c699b8e022e",
      "slug": "legacy-lower-b-abductor-polia",
      "name": "Abdução de quadril na polia",
      "target_muscles": [
        "Glúteo médio",
        "glúteo mínimo"
      ],
      "equipment": "Polia",
      "media_url": "https://gymvisual.com/img/p/2/9/5/3/9/29539.gif",
      "instructions": []
    },
    {
      "id": "c867f766-c308-559a-bd63-5d440e41a238",
      "slug": "legacy-lower-b-seated-calf",
      "name": "Panturrilha sentada",
      "target_muscles": [
        "Sóleo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/bOOdeyc.gif",
      "instructions": []
    },
    {
      "id": "474c514b-400c-5d57-9edf-1ec2f0e0abc6",
      "slug": "legacy-lower-b-seated-calf-em-pe",
      "name": "Panturrilha em pé na máquina",
      "target_muscles": [
        "Gastrocnêmio medial e lateral",
        "sóleo"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/ykUOVze.gif",
      "instructions": []
    },
    {
      "id": "d7bf5f01-85a6-5d3d-8933-bb96d42cb6d6",
      "slug": "legacy-eduarda-la-bike",
      "name": "Cardio zona 2 na bike",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "isquiotibiais",
        "tríceps sural"
      ],
      "equipment": "Bike",
      "media_url": "https://static.exercisedb.dev/media/a8VDgLw.gif",
      "instructions": []
    },
    {
      "id": "1f7801b6-fe58-59e2-8420-2ac2235578d2",
      "slug": "legacy-eduarda-la-bike-esteira",
      "name": "Cardio zona 2 na esteira inclinada",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "isquiotibiais",
        "tríceps sural"
      ],
      "equipment": "Esteira",
      "media_url": "https://gymvisual.com/img/p/1/4/4/5/7/14457.gif",
      "instructions": []
    },
    {
      "id": "caa0181b-577c-5c9c-afea-af285cad59a6",
      "slug": "legacy-eduarda-la-bike-eliptico",
      "name": "Cardio zona 2 no elíptico",
      "target_muscles": [
        "Quadríceps femoral",
        "glúteo máximo",
        "isquiotibiais",
        "tríceps sural"
      ],
      "equipment": "Elíptico",
      "media_url": "https://static.exercisedb.dev/media/rjtuP6X.gif",
      "instructions": []
    },
    {
      "id": "bff048cf-44a4-53cd-ac4c-22c83f8c9765",
      "slug": "legacy-eduarda-ba-pulldown-wide",
      "name": "Puxada alta pronada aberta",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "redondo maior",
        "bíceps braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/RVwzP10.gif",
      "instructions": []
    },
    {
      "id": "0886ff56-0ca6-5dd0-95a9-49799173420f",
      "slug": "legacy-eduarda-ba-pulldown-wide-neutra",
      "name": "Puxada alta neutra",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "redondo maior",
        "bíceps braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/rkg41Fb.gif",
      "instructions": []
    },
    {
      "id": "5b519d54-9ac1-5a00-ac81-84e0a54eba99",
      "slug": "legacy-eduarda-ba-pulldown-wide-supinada",
      "name": "Puxada alta supinada",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "redondo maior",
        "bíceps braquial"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/ky8FLU8.gif",
      "instructions": []
    },
    {
      "id": "1a7da11d-1286-57b0-ae2c-c7caf98b2e2e",
      "slug": "legacy-fernando-ua-row-low",
      "name": "Remada baixa com triângulo",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/hvV79Si.gif",
      "instructions": []
    },
    {
      "id": "800e3c32-3e22-52a4-b1bb-8d2475f5e6b5",
      "slug": "legacy-fernando-ua-row-low-maquina-bilateral",
      "name": "Remada baixa na máquina",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/7I6LNUG.gif",
      "instructions": []
    },
    {
      "id": "0a95c7aa-f719-566e-b6da-eb217ed9ac9f",
      "slug": "legacy-fernando-ua-row-low-maquina-unilateral",
      "name": "Remada baixa unilateral na máquina",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Máquina",
      "media_url": "https://gymvisual.com/img/p/5/9/2/3/5923.gif",
      "instructions": []
    },
    {
      "id": "10ee6cc7-890b-5b17-b812-aff54cb05277",
      "slug": "legacy-jonathan-pull-b-unilateral-row",
      "name": "Remada máquina articulada unilateral",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Máquina",
      "media_url": "https://gymvisual.com/img/p/6/6/1/4/6614.gif",
      "instructions": []
    },
    {
      "id": "8823f067-95c2-58aa-b36d-a8797de6a9c8",
      "slug": "legacy-jonathan-pull-b-unilateral-row-halter-apoiado",
      "name": "Remada unilateral com halter apoiado",
      "target_muscles": [
        "Latíssimo do dorso (grande dorsal)",
        "trapézio médio/inferior",
        "romboides",
        "deltoide posterior"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/C0MA9bC.gif",
      "instructions": []
    },
    {
      "id": "7a5ef1b0-35c6-530a-82da-19e8b707a0ec",
      "slug": "legacy-sara-ub-incline",
      "name": "Supino inclinado na máquina",
      "target_muscles": [
        "Peitoral maior (porção clavicular)",
        "deltoide anterior"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/jHAnWmT.gif",
      "instructions": []
    },
    {
      "id": "ab422415-2b47-55e7-b93c-9e8c78354de8",
      "slug": "legacy-sara-ub-incline-halteres",
      "name": "Supino inclinado com halteres",
      "target_muscles": [
        "Peitoral maior (porção clavicular)",
        "deltoide anterior"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/ns0SIbU.gif",
      "instructions": []
    },
    {
      "id": "0cd025d4-28f9-5760-a632-ad480ccda5fa",
      "slug": "legacy-sara-ub-incline-smith",
      "name": "Supino inclinado no Smith",
      "target_muscles": [
        "Peitoral maior (porção clavicular)",
        "deltoide anterior"
      ],
      "equipment": "Smith",
      "media_url": "https://static.exercisedb.dev/media/5v7KYld.gif",
      "instructions": []
    },
    {
      "id": "ba1119d4-3044-5709-aafc-723cb8264144",
      "slug": "legacy-jonathan-push-b-chest",
      "name": "Chest press unilateral",
      "target_muscles": [
        "Peitoral maior (porções esternocostal e clavicular)",
        "tríceps braquial"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/DOoWcnA.gif",
      "instructions": []
    },
    {
      "id": "66fdb57c-1e09-5647-bbb2-9c6ab1791bd4",
      "slug": "legacy-jonathan-push-b-chest-convergente",
      "name": "Supino reto máquina convergente",
      "target_muscles": [
        "Peitoral maior (porções esternocostal e clavicular)",
        "tríceps braquial"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/DOoWcnA.gif",
      "instructions": []
    },
    {
      "id": "36a64a5a-5213-5975-a5df-9e1741228d92",
      "slug": "legacy-jonathan-push-b-chest-halteres",
      "name": "Supino reto com halteres",
      "target_muscles": [
        "Peitoral maior (porções esternocostal e clavicular)",
        "tríceps braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/SpYC0Kp.gif",
      "instructions": []
    },
    {
      "id": "87854030-68c4-530e-89ee-203d5c39215a",
      "slug": "legacy-full-body-cable-curl",
      "name": "Rosca direta na polia",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/G08RZcQ.gif",
      "instructions": []
    },
    {
      "id": "1df9a8f5-0231-523e-a186-57c00d031cce",
      "slug": "legacy-full-body-cable-curl-halteres",
      "name": "Rosca direta com halteres",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/3s4NnTh.gif",
      "instructions": []
    },
    {
      "id": "924d6dea-ea5b-58d5-a8fa-2a71fbcdc126",
      "slug": "legacy-full-body-cable-curl-barra-ez",
      "name": "Rosca direta com barra EZ",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Barra EZ",
      "media_url": "https://static.exercisedb.dev/media/6TG6x2w.gif",
      "instructions": []
    },
    {
      "id": "dd90fba4-7582-5b77-9126-14bda92d0366",
      "slug": "legacy-fernando-fb-scott",
      "name": "Rosca Scott na máquina",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Máquina",
      "media_url": "https://static.exercisedb.dev/media/b6hQYMb.gif",
      "instructions": []
    },
    {
      "id": "a2973bcb-c956-5451-84fe-3df40668e2e4",
      "slug": "legacy-fernando-fb-scott-halter",
      "name": "Rosca Scott unilateral com halter",
      "target_muscles": [
        "Bíceps braquial",
        "braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/7D5bgLT.gif",
      "instructions": []
    },
    {
      "id": "a48f8b6d-612a-5ed9-8b67-d6159fb62002",
      "slug": "legacy-eduarda-bb-hammer",
      "name": "Rosca martelo com corda",
      "target_muscles": [
        "Braquial",
        "braquiorradial",
        "bíceps braquial"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/HPlPoQA.gif",
      "instructions": []
    },
    {
      "id": "0278a702-ecf8-5a6b-a6f1-f4071302396b",
      "slug": "legacy-eduarda-bb-hammer-halteres",
      "name": "Rosca martelo com halteres",
      "target_muscles": [
        "Braquial",
        "braquiorradial",
        "bíceps braquial"
      ],
      "equipment": "Halteres",
      "media_url": "https://static.exercisedb.dev/media/IGtBdNT.gif",
      "instructions": []
    },
    {
      "id": "d3c7c3cf-7862-5560-b9aa-a9026989c410",
      "slug": "legacy-fernando-ub-triceps-french",
      "name": "Tríceps francês no cabo",
      "target_muscles": [
        "Tríceps braquial (ênfase na cabeça longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/2IxROQ1.gif",
      "instructions": []
    },
    {
      "id": "686126ca-95e5-5918-8c8c-23162353bd95",
      "slug": "legacy-fernando-ub-triceps-french-testa-cabo",
      "name": "Tríceps testa no cabo",
      "target_muscles": [
        "Tríceps braquial (ênfase na cabeça longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://liftmanual.com/wp-content/uploads/2023/04/cable-lying-triceps-extension.webp",
      "instructions": []
    },
    {
      "id": "7346a569-d4cb-5fad-a18b-1fe0d3650661",
      "slug": "legacy-fernando-ub-triceps-french-frances-ez",
      "name": "Tríceps francês com barra EZ",
      "target_muscles": [
        "Tríceps braquial (ênfase na cabeça longa)"
      ],
      "equipment": "Barra EZ",
      "media_url": "https://static.exercisedb.dev/media/1cTf2Ux.gif",
      "instructions": []
    },
    {
      "id": "158c297e-4eb0-5a50-821f-1b5e0345437d",
      "slug": "legacy-full-body-triceps",
      "name": "Tríceps unilateral no cabo",
      "target_muscles": [
        "Tríceps braquial (cabeças lateral, medial e longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/qRZ5S1N.gif",
      "instructions": []
    },
    {
      "id": "8d4d7284-7988-5408-ac62-d110b5f50934",
      "slug": "legacy-full-body-triceps-corda",
      "name": "Tríceps na polia com corda",
      "target_muscles": [
        "Tríceps braquial (cabeças lateral, medial e longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://static.exercisedb.dev/media/dU605di.gif",
      "instructions": []
    },
    {
      "id": "1f31dc21-0612-5c85-9cf3-e599742c2006",
      "slug": "legacy-full-body-triceps-barra-v",
      "name": "Tríceps na polia com barra V",
      "target_muscles": [
        "Tríceps braquial (cabeças lateral, medial e longa)"
      ],
      "equipment": "Polia",
      "media_url": "https://gymvisual.com/img/p/1/0/4/7/2/10472.gif",
      "instructions": []
    }
  ],
  "plan_exercises": [
    {
      "id": "7a7433ff-6809-5465-8c16-fec45e926ed7",
      "workout_day_id": "840fbc26-d0fe-5d22-b689-98d8823d674f",
      "exercise_id": "a3cc42df-48e6-531d-8542-01a52663cb2f",
      "position": 0,
      "sets": 3,
      "reps_min": 6,
      "reps_max": 8,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 180,
      "track_load": true,
      "coach_note": "Quadríceps pesado, sem búlgaro/afundo\nPrescrição original: 3 × 6–8; RIR 1–2; descanso 2–3 min"
    },
    {
      "id": "1fc1e111-0012-5b58-b6e2-4bfcf7195cdc",
      "workout_day_id": "840fbc26-d0fe-5d22-b689-98d8823d674f",
      "exercise_id": "536e3081-d90e-5764-940c-ebf40bc6918a",
      "position": 1,
      "sets": 3,
      "reps_min": 8,
      "reps_max": 12,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Quadríceps complementar, amplitude estável\nPrescrição original: 3 × 8–12; RIR 1–2; descanso 2 min"
    },
    {
      "id": "de51c42d-1c5a-52a7-b354-c0a27745cded",
      "workout_day_id": "840fbc26-d0fe-5d22-b689-98d8823d674f",
      "exercise_id": "baab6572-5f0a-5cef-bd4c-fa8666cecc1c",
      "position": 2,
      "sets": 2,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Volume adicional de quadríceps com trajetória guiada\nPrescrição original: 2 × 8–10; RIR 1–2; descanso 90–120 s"
    },
    {
      "id": "1a0373e4-eead-5034-8584-2329e3cd6262",
      "workout_day_id": "840fbc26-d0fe-5d22-b689-98d8823d674f",
      "exercise_id": "b23a0567-14a1-57e4-b349-3b12fa0ab3a1",
      "position": 3,
      "sets": 3,
      "reps_min": 10,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Isolado de quadríceps, controle excêntrico\nPrescrição original: 3 × 10–15; RIR 0–1; descanso 60–90 s"
    },
    {
      "id": "6ceb31ae-9417-5971-8f00-98de398851ec",
      "workout_day_id": "840fbc26-d0fe-5d22-b689-98d8823d674f",
      "exercise_id": "94ebb980-58d8-523a-9a2e-6f7688a2932a",
      "position": 4,
      "sets": 3,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Posterior em manutenção ativa\nPrescrição original: 3 × 10–12; RIR 0–1; descanso 75–90 s"
    },
    {
      "id": "74540005-3a4a-5aa1-bddb-81da3a817e79",
      "workout_day_id": "840fbc26-d0fe-5d22-b689-98d8823d674f",
      "exercise_id": "4bf6126e-9f95-5ceb-9e4c-c312c649ab05",
      "position": 5,
      "sets": 4,
      "reps_min": 10,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Amplitude completa e pausa no topo\nPrescrição original: 4 × 10–15; RIR 0–1; descanso 60 s"
    },
    {
      "id": "ebe0c973-6ccc-5e99-b4ba-4861f456e942",
      "workout_day_id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "exercise_id": "ddaaae45-5940-5414-8082-fb6ca23caa5b",
      "position": 0,
      "sets": 3,
      "reps_min": 6,
      "reps_max": 8,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 180,
      "track_load": true,
      "coach_note": "Peito principal, ainda com margem de progressão\nPrescrição original: 3 × 6–8; RIR 1–2; descanso 2–3 min"
    },
    {
      "id": "9d2fedef-c1f0-5abf-a672-394bea3f67ae",
      "workout_day_id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "exercise_id": "6fd1965c-3608-59ce-9b7b-2a724d3a24b3",
      "position": 1,
      "sets": 3,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Peito com estabilidade e boa relação estímulo/fadiga\nPrescrição original: 3 × 8–10; RIR 1–2; descanso 2 min"
    },
    {
      "id": "0f67143f-e433-561b-bd3f-6cf737ba8c89",
      "workout_day_id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "exercise_id": "3b3b2c19-0da2-5ec3-a8d7-ebf49317d564",
      "position": 2,
      "sets": 2,
      "reps_min": 12,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 75,
      "track_load": true,
      "coach_note": "Peitoral inferior, amplitude controlada\nPrescrição original: 2 × 12–15; RIR 0–1; descanso 60–75 s"
    },
    {
      "id": "fb76e5a5-111a-54ff-b992-7387de55a745",
      "workout_day_id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "exercise_id": "778086cc-8b23-5a40-8026-d3b2d5e6a532",
      "position": 3,
      "sets": 2,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Ombro guiado, sem travar cotovelos\nPrescrição original: 2 × 8–10; RIR 1–2; descanso 90 s"
    },
    {
      "id": "a319243a-0ba9-5283-8687-f007c0add84f",
      "workout_day_id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "exercise_id": "38a26550-4cbf-5003-80a9-0701981c7260",
      "position": 4,
      "sets": 3,
      "reps_min": 12,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Deltoide medial em manutenção/progresso leve\nPrescrição original: 3 × 12–15; RIR 0–1; descanso 60 s"
    },
    {
      "id": "e8251284-dea2-551c-a5c5-575b68c66f27",
      "workout_day_id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "exercise_id": "b61230d3-93b5-5fe3-aa26-7ccc1c4af76e",
      "position": 5,
      "sets": 3,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Cabeça longa, descanso suficiente para progredir\nPrescrição original: 3 × 8–10; RIR 0–1; descanso 60–90 s"
    },
    {
      "id": "ded94a6a-aef2-5f10-acf6-d6b2ae5868a4",
      "workout_day_id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "exercise_id": "2eb2655c-e000-5401-857e-6a21d06993ae",
      "position": 6,
      "sets": 3,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Cotovelos fixos, extensão completa\nPrescrição original: 3 × 10–12; RIR 0–1; descanso 60–90 s"
    },
    {
      "id": "194cfe1f-b609-5c58-a493-e2f9c436b397",
      "workout_day_id": "6797f4bc-e872-51f6-b359-5fd356321b9d",
      "exercise_id": "7bcfc3b5-6e07-512e-8bce-09f6bc684ada",
      "position": 7,
      "sets": 3,
      "reps_min": 12,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Core com carga progressiva\nPrescrição original: 3 × 12–15; RIR 0–1; descanso 45–60 s"
    },
    {
      "id": "f357d8b8-5bc3-5cf1-9548-8002d1bc6750",
      "workout_day_id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "exercise_id": "604c12eb-e609-55ac-90fe-5c773034f9d7",
      "position": 0,
      "sets": 3,
      "reps_min": 6,
      "reps_max": 8,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 180,
      "track_load": true,
      "coach_note": "Costas pesado sem roubar com lombar/trapézio\nPrescrição original: 3 × 6–8; RIR 1–2; descanso 2–3 min"
    },
    {
      "id": "973a207c-9f7f-57c5-8a44-88ad4fe5759f",
      "workout_day_id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "exercise_id": "631a1af0-2590-5cd2-a1c8-2616f4c047f0",
      "position": 1,
      "sets": 3,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Dorsais, trajetória estável\nPrescrição original: 3 × 8–10; RIR 1–2; descanso 90–120 s"
    },
    {
      "id": "4faa3a78-13ec-5b0f-bb14-7c53bdcca800",
      "workout_day_id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "exercise_id": "2137684d-98bb-5da3-9086-462f4f20619e",
      "position": 2,
      "sets": 2,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Controle escapular e simetria lado a lado\nPrescrição original: 2 × 8–10 cada lado; RIR 1–2; descanso 2 min"
    },
    {
      "id": "d363a211-db6b-5030-949f-1c813c3e90e9",
      "workout_day_id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "exercise_id": "fed8700f-d67a-5387-8537-f025049571e4",
      "position": 3,
      "sets": 2,
      "reps_min": 12,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 75,
      "track_load": true,
      "coach_note": "Isolador de dorsal, braços quase estendidos\nPrescrição original: 2 × 12–15; RIR 0–1; descanso 60–75 s"
    },
    {
      "id": "46f70ab3-ecd7-5052-9235-e3c719f6219a",
      "workout_day_id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "exercise_id": "43aff30b-9ebd-5704-af24-89bf0d5e9c51",
      "position": 4,
      "sets": 2,
      "reps_min": 15,
      "reps_max": 20,
      "rir_min": 2,
      "rir_max": 2,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Deltoide posterior e estabilidade escapular; leve se o trapézio estiver sensível\nPrescrição original: 2 × 15–20; RIR 2; descanso 60 s"
    },
    {
      "id": "918ef62e-e203-5dfc-9fd0-e2a2d6b0b61a",
      "workout_day_id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "exercise_id": "2a31876a-0816-5d60-a4e0-99891016316e",
      "position": 5,
      "sets": 3,
      "reps_min": 6,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Bíceps pesado, progressão dupla\nPrescrição original: 3 × 6–10; RIR 1–2; descanso 90–120 s"
    },
    {
      "id": "08f3ed71-9cc0-5437-bcf7-96d5c1f7e5da",
      "workout_day_id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "exercise_id": "2b81834f-9cad-5132-9ca7-aa984e704264",
      "position": 6,
      "sets": 2,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Bíceps alongado, técnica estrita\nPrescrição original: 2 × 10–12; RIR 1–2; descanso 90 s"
    },
    {
      "id": "d3a157c2-af97-5f9f-a268-709f897073cb",
      "workout_day_id": "9ce9f125-0b26-57e1-ba33-b742240fb5cc",
      "exercise_id": "f01c541f-6ba4-5787-a4ff-eb38afefefaf",
      "position": 7,
      "sets": 1,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 75,
      "track_load": true,
      "coach_note": "Braquial e antebraço; volume enxuto para favorecer progressão\nPrescrição original: 1 × 10–12; RIR 0–1; descanso 60–75 s"
    },
    {
      "id": "200ee9f6-5a50-5666-8122-97ea8f83bb88",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "08b05742-5815-5eb0-bf9a-97ed394e3988",
      "position": 0,
      "sets": 3,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Segundo estímulo pesado de quadríceps\nPrescrição original: 3 × 10–12; RIR 1–2; descanso 2 min"
    },
    {
      "id": "d569255e-4cb6-560f-b5bc-5d7a1dbc5e6b",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "261a3b53-2264-596b-a2ac-1cdb57c2eaee",
      "position": 1,
      "sets": 2,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Ênfase quadríceps, amplitude controlada\nPrescrição original: 2 × 8–10; RIR 1–2; descanso 2 min"
    },
    {
      "id": "f769556a-1f07-5d86-b491-0da9d108ba8f",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "98860f74-192d-5242-869e-4f5ae09d0c5f",
      "position": 2,
      "sets": 1,
      "reps_min": 12,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Correção de assimetria e pico de contração\nPrescrição original: 1 × 12–15 cada lado; RIR 0–1; descanso 60 s"
    },
    {
      "id": "d986c913-85f7-544f-8f80-3f397f1857aa",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "acf89de0-a553-5e88-bf7e-f3dbceefceae",
      "position": 3,
      "sets": 3,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Glúteo principal, pausa no topo\nPrescrição original: 3 × 8–10; RIR 1–2; descanso 90–120 s"
    },
    {
      "id": "96df0940-74be-551e-9014-3c68c6edecea",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "0c386a4b-7d0a-55d8-b86f-e8b7d58e1eaa",
      "position": 4,
      "sets": 4,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Posterior sem stiff/RDL\nPrescrição original: 4 × 10–12; RIR 0–1; descanso 75–90 s"
    },
    {
      "id": "b6391e7c-6aeb-5e55-bd62-3643eba2daea",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "92587fa7-d831-5746-8e9e-1f8716d83dc2",
      "position": 5,
      "sets": 2,
      "reps_min": 12,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 75,
      "track_load": true,
      "coach_note": "Posterior complementar com joelho flexionado\nPrescrição original: 2 × 12–15; RIR 0–1; descanso 60–75 s"
    },
    {
      "id": "e2f61a3b-4c6a-5706-934c-a8d624dbb3f8",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "9f424d52-2ce7-54c8-b31a-ecc79353ee42",
      "position": 6,
      "sets": 2,
      "reps_min": 15,
      "reps_max": 20,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Glúteo médio, controle na volta\nPrescrição original: 2 × 15–20; RIR 0–1; descanso 60 s"
    },
    {
      "id": "883fa0d7-ff04-576c-afe2-83759fd48e18",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "c867f766-c308-559a-bd63-5d440e41a238",
      "position": 7,
      "sets": 4,
      "reps_min": 12,
      "reps_max": 20,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Sóleo, amplitude completa\nPrescrição original: 4 × 12–20; RIR 0–1; descanso 60 s"
    },
    {
      "id": "ab32d43e-17e0-5170-b767-c69dbfc74270",
      "workout_day_id": "fbc4b9de-3858-57ac-9c5b-8e2a39a0bbd2",
      "exercise_id": "d7bf5f01-85a6-5d3d-8933-bb96d42cb6d6",
      "position": 8,
      "sets": 1,
      "reps_min": null,
      "reps_max": null,
      "rir_min": null,
      "rir_max": null,
      "rest_seconds": 0,
      "track_load": false,
      "coach_note": "Bike/esteira inclinada 20–30 min se a recuperação estiver boa\nPrescrição original: 1 × 20–30 min; RIR moderado; descanso —"
    },
    {
      "id": "8fbf36b8-c71b-50b3-87c5-da4ff309a49a",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "bff048cf-44a4-53cd-ac4c-22c83f8c9765",
      "position": 0,
      "sets": 3,
      "reps_min": 8,
      "reps_max": 12,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Costas vertical, foco em dorsais\nPrescrição original: 3 × 8–12; RIR 1–2; descanso 90 s"
    },
    {
      "id": "94dca598-52a3-5e22-b20a-3461da904396",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "1a7da11d-1286-57b0-ae2c-c7caf98b2e2e",
      "position": 1,
      "sets": 3,
      "reps_min": 8,
      "reps_max": 12,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Costas horizontal, sem elevar ombros\nPrescrição original: 3 × 8–12; RIR 1–2; descanso 90 s"
    },
    {
      "id": "2cb7fb6e-e7f5-51a4-b739-35790398215e",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "10ee6cc7-890b-5b17-b812-aff54cb05277",
      "position": 2,
      "sets": 2,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Controle de assimetria, execução limpa\nPrescrição original: 2 × 10–12 cada lado; RIR 1–2; descanso 90–120 s"
    },
    {
      "id": "701f9240-0fac-59eb-9df3-f0f42584be81",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "7a5ef1b0-35c6-530a-82da-19e8b707a0ec",
      "position": 3,
      "sets": 3,
      "reps_min": 8,
      "reps_max": 10,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 120,
      "track_load": true,
      "coach_note": "Peito superior, carga moderada\nPrescrição original: 3 × 8–10; RIR 1–2; descanso 90–120 s"
    },
    {
      "id": "b22c12bc-98b6-5431-b617-df037196b4e8",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "ba1119d4-3044-5709-aafc-723cb8264144",
      "position": 4,
      "sets": 2,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 1,
      "rir_max": 2,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Peito com estabilidade e simetria\nPrescrição original: 2 × 10–12 cada lado; RIR 1–2; descanso 90 s"
    },
    {
      "id": "1a74499c-06c5-5d8a-b581-68fcc9d1e7eb",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "87854030-68c4-530e-89ee-203d5c39215a",
      "position": 5,
      "sets": 3,
      "reps_min": 12,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 75,
      "track_load": true,
      "coach_note": "Tensão constante, foco em reps altas\nPrescrição original: 3 × 12–15; RIR 0–1; descanso 60–75 s"
    },
    {
      "id": "945c9c6f-f678-540a-be44-8aee8812dad5",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "dd90fba4-7582-5b77-9126-14bda92d0366",
      "position": 6,
      "sets": 2,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 75,
      "track_load": true,
      "coach_note": "Base estável para reduzir balanço\nPrescrição original: 2 × 10–12; RIR 0–1; descanso 60–75 s"
    },
    {
      "id": "cd01d56d-842b-53bb-9e31-4f187f237914",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "a48f8b6d-612a-5ed9-8b67-d6159fb62002",
      "position": 7,
      "sets": 2,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Braquial e antebraço\nPrescrição original: 2 × 10–12; RIR 0–1; descanso 60 s"
    },
    {
      "id": "b824101a-f7fb-5805-8fab-35d4d672c105",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "d3c7c3cf-7862-5560-b9aa-a9026989c410",
      "position": 8,
      "sets": 3,
      "reps_min": 10,
      "reps_max": 12,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 90,
      "track_load": true,
      "coach_note": "Tríceps em alongamento, técnica limpa\nPrescrição original: 3 × 10–12; RIR 0–1; descanso 60–90 s"
    },
    {
      "id": "a1d1b41b-3ec2-5b5c-a2a1-f3619921aa3b",
      "workout_day_id": "91a08ee9-d994-5ea3-bd07-076bdefd0967",
      "exercise_id": "158c297e-4eb0-5a50-821f-1b5e0345437d",
      "position": 9,
      "sets": 3,
      "reps_min": 12,
      "reps_max": 15,
      "rir_min": 0,
      "rir_max": 1,
      "rest_seconds": 60,
      "track_load": true,
      "coach_note": "Simetria lado a lado\nPrescrição original: 3 × 12–15 cada lado; RIR 0–1; descanso 60 s"
    }
  ],
  "alternatives": [
    {
      "id": "dc763665-00d5-5a72-a50d-5f2526fb6949",
      "plan_exercise_id": "7a7433ff-6809-5465-8c16-fec45e926ed7",
      "exercise_id": "165d01d2-21dd-592f-9589-2738f3bf1c8c",
      "label": "Smith",
      "position": 0,
      "reps_min": 6,
      "reps_max": 8,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "9b51aefd-0d94-5fa7-96cc-3f10dc08666b",
      "plan_exercise_id": "7a7433ff-6809-5465-8c16-fec45e926ed7",
      "exercise_id": "9fa6b4eb-6fdc-5d42-bd2b-0a763ddef0d2",
      "label": "Leg press 45°",
      "position": 1,
      "reps_min": 6,
      "reps_max": 8,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "4809f869-e7af-5dbd-938b-e1ddddd2b58f",
      "plan_exercise_id": "1fc1e111-0012-5b58-b6e2-4bfcf7195cdc",
      "exercise_id": "a14bc479-8629-5ec1-88a7-786b69e369cc",
      "label": "Horizontal",
      "position": 0,
      "reps_min": 8,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "ad947334-d53c-5cc9-b678-bae179c89495",
      "plan_exercise_id": "de51c42d-1c5a-52a7-b354-c0a27745cded",
      "exercise_id": "dd9ecb2a-91f3-5559-bbca-847d1b0b2738",
      "label": "Hack squat",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "fa5aabd8-4770-5519-8802-f92636d57e5f",
      "plan_exercise_id": "1a0373e4-eead-5034-8584-2329e3cd6262",
      "exercise_id": "f4619f7b-32be-5af6-9345-02a340220782",
      "label": "Unilateral",
      "position": 0,
      "reps_min": 10,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "0d0d758d-c863-52df-ab2d-467432a76e39",
      "plan_exercise_id": "6ceb31ae-9417-5971-8f00-98de398851ec",
      "exercise_id": "133b0a02-9d5e-5d2f-ae1d-6d1c67a038ec",
      "label": "Mesa flexora",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "6717364a-f41a-5e00-939d-6691f99ed7ee",
      "plan_exercise_id": "74540005-3a4a-5aa1-bddb-81da3a817e79",
      "exercise_id": "ccc8658d-5a69-5bbc-8532-43042bfaa0c1",
      "label": "Sentada",
      "position": 0,
      "reps_min": 10,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "95e6123c-0eb8-5c17-9525-112ae95e9269",
      "plan_exercise_id": "ebe0c973-6ccc-5e99-b4ba-4861f456e942",
      "exercise_id": "d2883784-cd24-58f5-be3e-b1d6aa05f1ac",
      "label": "Máquina inclinada",
      "position": 0,
      "reps_min": 6,
      "reps_max": 8,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "faaa2150-f1e2-5eb4-9df6-eb738c5e2c2f",
      "plan_exercise_id": "ebe0c973-6ccc-5e99-b4ba-4861f456e942",
      "exercise_id": "4ca9deaa-5382-53e4-9d0d-a0e026175b9f",
      "label": "Smith inclinado",
      "position": 1,
      "reps_min": 6,
      "reps_max": 8,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "507df896-3cad-50bf-983e-dd6d9717d9d2",
      "plan_exercise_id": "9d2fedef-c1f0-5abf-a672-394bea3f67ae",
      "exercise_id": "6f82b2d6-0d2a-5460-bea0-acdeb5319923",
      "label": "Halteres",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "e3a5c35b-f2db-5d84-a827-8f6f69e0e476",
      "plan_exercise_id": "9d2fedef-c1f0-5abf-a672-394bea3f67ae",
      "exercise_id": "6f1abacb-c071-59dd-8168-93673b2c14af",
      "label": "Supino declinado",
      "position": 1,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "b66db758-71f8-580b-a1a9-d6f82078cff8",
      "plan_exercise_id": "0f67143f-e433-561b-bd3f-6cf737ba8c89",
      "exercise_id": "c36b37b3-8ea2-5326-864e-17e931ec6ba2",
      "label": "Peck deck",
      "position": 0,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "2dbc5c0d-1f89-516f-9d08-014aac0682de",
      "plan_exercise_id": "0f67143f-e433-561b-bd3f-6cf737ba8c89",
      "exercise_id": "f1d159ef-b48c-5966-97af-633c4e468d23",
      "label": "Crossover médio",
      "position": 1,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "7c8a61dc-c6ce-543f-bf81-81594e6f60f3",
      "plan_exercise_id": "fb76e5a5-111a-54ff-b992-7387de55a745",
      "exercise_id": "04d166c3-742b-55e9-b931-315aeb4df34e",
      "label": "Halteres",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "dd24ad4e-117e-53b3-bce6-6702c58d8ac5",
      "plan_exercise_id": "a319243a-0ba9-5283-8687-f007c0add84f",
      "exercise_id": "7bdbe3d3-c8c0-50a2-b2f5-5c94902a8477",
      "label": "Polia",
      "position": 0,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "55a9e5c6-d550-5d7e-8ded-0d64dea06377",
      "plan_exercise_id": "e8251284-dea2-551c-a5c5-575b68c66f27",
      "exercise_id": "319d5ba6-8ba3-5cc0-8793-a8f223653f72",
      "label": "Francês com EZ",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "4fa880c7-9207-5aab-b0da-7c092420eab1",
      "plan_exercise_id": "e8251284-dea2-551c-a5c5-575b68c66f27",
      "exercise_id": "66b2e5d0-a127-53ea-abc0-0810013ff7b4",
      "label": "Testa no cabo",
      "position": 1,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "126ae246-0bab-5f0c-a3f7-f2e67856def8",
      "plan_exercise_id": "ded94a6a-aef2-5f10-acf6-d6b2ae5868a4",
      "exercise_id": "98e47b95-427f-5fbd-ab95-adaea94b7899",
      "label": "Barra V",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "737381d9-27d4-5ee9-b530-b2b104f7cb4e",
      "plan_exercise_id": "f357d8b8-5bc3-5cf1-9548-8002d1bc6750",
      "exercise_id": "ddee806f-660b-5f5b-9d6d-7281b926c251",
      "label": "Remada T apoiada",
      "position": 0,
      "reps_min": 6,
      "reps_max": 8,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "cdf4590e-838a-5e58-a0f0-f75458454dac",
      "plan_exercise_id": "f357d8b8-5bc3-5cf1-9548-8002d1bc6750",
      "exercise_id": "fb78ad9e-e390-5259-a92a-5d1957bc672a",
      "label": "Polia com triângulo",
      "position": 1,
      "reps_min": 6,
      "reps_max": 8,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "5425bc55-9700-5ec0-93fa-73d3be7ae534",
      "plan_exercise_id": "973a207c-9f7f-57c5-8a44-88ad4fe5759f",
      "exercise_id": "08a467fd-71f2-5ed6-a385-78e3d2727d8b",
      "label": "Pegada supinada",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "f61360f9-d418-5c4e-942c-b511fa543b8a",
      "plan_exercise_id": "973a207c-9f7f-57c5-8a44-88ad4fe5759f",
      "exercise_id": "d35ab691-2b3d-53a8-8202-32c58417c603",
      "label": "Pronada média",
      "position": 1,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "90a554ee-d9ef-520f-b67c-554f89dcdee2",
      "plan_exercise_id": "4faa3a78-13ec-5b0f-bb14-7c53bdcca800",
      "exercise_id": "bc113e9e-ccbb-531b-bc59-324f5e26beab",
      "label": "Halter apoiado",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "f71a9798-cde7-53d9-8748-b944aa01189c",
      "plan_exercise_id": "d363a211-db6b-5030-949f-1c813c3e90e9",
      "exercise_id": "37c4f328-7fea-5ea0-9e60-3d423a2bd7bf",
      "label": "Pullover máquina",
      "position": 0,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "fba1c742-b1c8-542c-9a8e-45cc9ddd3039",
      "plan_exercise_id": "46f70ab3-ecd7-5052-9235-e3c719f6219a",
      "exercise_id": "2d68e92e-3a5f-5aeb-a728-a0aee1ca8d81",
      "label": "Peck deck inverso",
      "position": 0,
      "reps_min": 15,
      "reps_max": 20,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "9bf1f6e1-ce01-54ad-bc07-e141fa79d2e9",
      "plan_exercise_id": "918ef62e-e203-5dfc-9fd0-e2a2d6b0b61a",
      "exercise_id": "02cabebc-c4d2-56da-97a3-aec1de54cc91",
      "label": "Polia",
      "position": 0,
      "reps_min": 6,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "03eb65ef-8f06-51b5-acf2-3051a905dd08",
      "plan_exercise_id": "918ef62e-e203-5dfc-9fd0-e2a2d6b0b61a",
      "exercise_id": "36e89ca6-a408-50f0-9de7-3a50b7215b61",
      "label": "Halteres",
      "position": 1,
      "reps_min": 6,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "54888885-f50a-52fb-bc3d-ebfd4c6a8978",
      "plan_exercise_id": "08f3ed71-9cc0-5437-bcf7-96d5c1f7e5da",
      "exercise_id": "69203d96-b01e-5fcc-af3f-4274869042ce",
      "label": "Scott máquina",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "681b7be3-a22c-5d31-aa83-db9bc035628b",
      "plan_exercise_id": "08f3ed71-9cc0-5437-bcf7-96d5c1f7e5da",
      "exercise_id": "10e97135-d4bd-5028-977b-84a2698fa775",
      "label": "Polia",
      "position": 1,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "25f5c766-50a3-57b2-b729-ddfd9701e766",
      "plan_exercise_id": "d3a157c2-af97-5f9f-a268-709f897073cb",
      "exercise_id": "b6b34b0b-165b-5e1a-8687-307b2421ba77",
      "label": "Corda na polia",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "04b18c43-903d-5ffe-a500-a6d21a24ec7c",
      "plan_exercise_id": "200ee9f6-5a50-5666-8122-97ea8f83bb88",
      "exercise_id": "73fe9e29-2108-5cb9-83f5-00ec0cc5ab5d",
      "label": "45°",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "2aed7a5c-3f5a-5e9c-9ec1-30f3a43a68f3",
      "plan_exercise_id": "d569255e-4cb6-560f-b5bc-5d7a1dbc5e6b",
      "exercise_id": "eb4717cb-97be-5173-a572-c12bea61278f",
      "label": "Smith",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "2e83e182-4063-5a08-aefc-b78c889eef56",
      "plan_exercise_id": "f769556a-1f07-5d86-b491-0da9d108ba8f",
      "exercise_id": "538aa28a-e374-5c94-92ac-68a8c9959556",
      "label": "Bilateral",
      "position": 0,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "810545f2-b2ff-54ba-a3fa-cf59e888764b",
      "plan_exercise_id": "d986c913-85f7-544f-8f80-3f397f1857aa",
      "exercise_id": "e6158bc7-c7db-528a-b794-fc99b2b4c7e2",
      "label": "Smith",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "2e1bfd58-a7e4-516c-a520-0163ecb68f3b",
      "plan_exercise_id": "96df0940-74be-551e-9014-3c68c6edecea",
      "exercise_id": "5696504f-63ce-5cf3-9aff-9699818a36b6",
      "label": "Mesa flexora",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "c4123efe-8065-57cf-9385-b971b1d75669",
      "plan_exercise_id": "b6391e7c-6aeb-5e55-bd62-3643eba2daea",
      "exercise_id": "0b8eb27a-98a8-5799-b8f4-def3b5147cb4",
      "label": "Cadeira flexora",
      "position": 0,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "78e2d466-8b69-5a97-bb2b-729d1a4ba35f",
      "plan_exercise_id": "e2f61a3b-4c6a-5706-934c-a8d624dbb3f8",
      "exercise_id": "777d6221-37a7-59c0-97ae-5c699b8e022e",
      "label": "Polia",
      "position": 0,
      "reps_min": 15,
      "reps_max": 20,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "e8a2e3b0-ae10-5a20-b16d-bc1d74833a1e",
      "plan_exercise_id": "883fa0d7-ff04-576c-afe2-83759fd48e18",
      "exercise_id": "474c514b-400c-5d57-9edf-1ec2f0e0abc6",
      "label": "Em pé",
      "position": 0,
      "reps_min": 12,
      "reps_max": 20,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "33314a97-4f9d-5cbf-85a9-0ae5b6651fef",
      "plan_exercise_id": "ab32d43e-17e0-5170-b767-c69dbfc74270",
      "exercise_id": "1f7801b6-fe58-59e2-8420-2ac2235578d2",
      "label": "Esteira inclinada",
      "position": 0,
      "reps_min": null,
      "reps_max": null,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "1b990166-7353-5662-85e9-673a6053b028",
      "plan_exercise_id": "ab32d43e-17e0-5170-b767-c69dbfc74270",
      "exercise_id": "caa0181b-577c-5c9c-afea-af285cad59a6",
      "label": "Elíptico",
      "position": 1,
      "reps_min": null,
      "reps_max": null,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "a7fa2593-908f-5b93-b5c6-627e3c0db3c1",
      "plan_exercise_id": "8fbf36b8-c71b-50b3-87c5-da4ff309a49a",
      "exercise_id": "0886ff56-0ca6-5dd0-95a9-49799173420f",
      "label": "Pegada neutra",
      "position": 0,
      "reps_min": 8,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "26636212-6b9d-5d5a-b4ce-e72584befb65",
      "plan_exercise_id": "8fbf36b8-c71b-50b3-87c5-da4ff309a49a",
      "exercise_id": "5b519d54-9ac1-5a00-ac81-84e0a54eba99",
      "label": "Pegada supinada",
      "position": 1,
      "reps_min": 8,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "fd964e23-f73a-55c0-9407-970c81402a01",
      "plan_exercise_id": "94dca598-52a3-5e22-b20a-3461da904396",
      "exercise_id": "800e3c32-3e22-52a4-b1bb-8d2475f5e6b5",
      "label": "Máquina bilateral",
      "position": 0,
      "reps_min": 8,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "199f5732-3c7a-5fd5-8d5d-771d185c063c",
      "plan_exercise_id": "94dca598-52a3-5e22-b20a-3461da904396",
      "exercise_id": "0a95c7aa-f719-566e-b6da-eb217ed9ac9f",
      "label": "Máquina unilateral",
      "position": 1,
      "reps_min": 8,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "87db8bb2-ce86-5b19-8a34-bc7d1c8c0f67",
      "plan_exercise_id": "2cb7fb6e-e7f5-51a4-b739-35790398215e",
      "exercise_id": "8823f067-95c2-58aa-b36d-a8797de6a9c8",
      "label": "Halter apoiado",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "e53991dc-1a2f-5b8d-8779-00d93f8f3850",
      "plan_exercise_id": "701f9240-0fac-59eb-9df3-f0f42584be81",
      "exercise_id": "ab422415-2b47-55e7-b93c-9e8c78354de8",
      "label": "Halteres",
      "position": 0,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "29795a5b-6da0-5786-b930-a2044d2a024f",
      "plan_exercise_id": "701f9240-0fac-59eb-9df3-f0f42584be81",
      "exercise_id": "0cd025d4-28f9-5760-a632-ad480ccda5fa",
      "label": "Smith inclinado",
      "position": 1,
      "reps_min": 8,
      "reps_max": 10,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "1142e5e3-74a7-5352-9614-85d3c1a238f9",
      "plan_exercise_id": "b22c12bc-98b6-5431-b617-df037196b4e8",
      "exercise_id": "66fdb57c-1e09-5647-bbb2-9c6ab1791bd4",
      "label": "Supino convergente",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "336ff96b-1677-5b70-a7ad-d5d1a01c0c75",
      "plan_exercise_id": "b22c12bc-98b6-5431-b617-df037196b4e8",
      "exercise_id": "36a64a5a-5213-5975-a5df-9e1741228d92",
      "label": "Halteres",
      "position": 1,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "191d7184-9211-5f8a-a9de-e83edc574b8b",
      "plan_exercise_id": "1a74499c-06c5-5d8a-b581-68fcc9d1e7eb",
      "exercise_id": "1df9a8f5-0231-523e-a186-57c00d031cce",
      "label": "Halteres",
      "position": 0,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "cf2b9458-7ed1-5e25-9dee-b09013b43a39",
      "plan_exercise_id": "1a74499c-06c5-5d8a-b581-68fcc9d1e7eb",
      "exercise_id": "924d6dea-ea5b-58d5-a8fa-2a71fbcdc126",
      "label": "Barra EZ",
      "position": 1,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "bff66ae0-9503-526e-b5b1-77d1a2d185cf",
      "plan_exercise_id": "945c9c6f-f678-540a-be44-8aee8812dad5",
      "exercise_id": "a2973bcb-c956-5451-84fe-3df40668e2e4",
      "label": "Scott unilateral",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "25b2b1d9-71ff-5563-9e35-7cd92e0afaed",
      "plan_exercise_id": "cd01d56d-842b-53bb-9e31-4f187f237914",
      "exercise_id": "0278a702-ecf8-5a6b-a6f1-f4071302396b",
      "label": "Halteres",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "d74804a6-b520-52a7-a2c4-822206fd3671",
      "plan_exercise_id": "b824101a-f7fb-5805-8fab-35d4d672c105",
      "exercise_id": "686126ca-95e5-5918-8c8c-23162353bd95",
      "label": "Testa no cabo",
      "position": 0,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "caf4ad4a-9b84-56e4-b4f2-656fa8724937",
      "plan_exercise_id": "b824101a-f7fb-5805-8fab-35d4d672c105",
      "exercise_id": "7346a569-d4cb-5fad-a18b-1fe0d3650661",
      "label": "Francês com EZ",
      "position": 1,
      "reps_min": 10,
      "reps_max": 12,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "e4e126b0-e28f-5c68-9a0b-c381607e37ea",
      "plan_exercise_id": "a1d1b41b-3ec2-5b5c-a2a1-f3619921aa3b",
      "exercise_id": "8d4d7284-7988-5408-ac62-d110b5f50934",
      "label": "Corda",
      "position": 0,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    },
    {
      "id": "0edd6f82-c738-5340-b592-73f3015a2b68",
      "plan_exercise_id": "a1d1b41b-3ec2-5b5c-a2a1-f3619921aa3b",
      "exercise_id": "1f31dc21-0612-5c85-9cf3-e599742c2006",
      "label": "Barra V",
      "position": 1,
      "reps_min": 12,
      "reps_max": 15,
      "note": "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
    }
  ]
}$payload$::jsonb;
  athlete uuid;
begin
  select id into athlete
  from public.profiles
  where legacy_profile_key = payload->>'profile_key';

  if athlete is null then
    raise exception 'Perfil legado % ainda não está vinculado a um usuário', payload->>'profile_key';
  end if;

  update public.training_plans
  set status = 'archived'
  where athlete_id = athlete
    and status = 'active'
    and id <> (payload->'plan'->>'id')::uuid;

  insert into public.training_plans (id, athlete_id, title, goal, methodology, science_rationale, status, version, starts_on)
  select
    (p->>'id')::uuid, athlete, p->>'title', p->>'goal', p->>'methodology', p->>'science_rationale',
    p->>'status', (p->>'version')::integer, (p->>'starts_on')::date
  from jsonb_array_elements(jsonb_build_array(payload->'plan')) p
  on conflict (id) do update set
    athlete_id = excluded.athlete_id,
    title = excluded.title,
    goal = excluded.goal,
    methodology = excluded.methodology,
    science_rationale = excluded.science_rationale,
    status = excluded.status,
    version = excluded.version,
    starts_on = excluded.starts_on;

  insert into public.workout_days (id, plan_id, day_key, title, weekday, position, notes)
  select id, plan_id, day_key, title, weekday, position, notes
  from jsonb_to_recordset(payload->'days') as x(
    id uuid, plan_id uuid, day_key text, title text, weekday smallint, position smallint, notes text
  )
  on conflict (id) do update set
    plan_id = excluded.plan_id,
    day_key = excluded.day_key,
    title = excluded.title,
    weekday = excluded.weekday,
    position = excluded.position,
    notes = excluded.notes;

  insert into public.exercise_catalog (id, slug, name, target_muscles, equipment, media_url, instructions)
  select id, slug, name, target_muscles, equipment, media_url, instructions
  from jsonb_to_recordset(payload->'catalog') as x(
    id uuid, slug text, name text, target_muscles text[], equipment text, media_url text, instructions jsonb
  )
  on conflict (slug) do update set
    name = excluded.name,
    target_muscles = excluded.target_muscles,
    equipment = excluded.equipment,
    media_url = excluded.media_url,
    instructions = excluded.instructions,
    active = true;

  insert into public.plan_exercises (
    id, workout_day_id, exercise_id, position, sets, reps_min, reps_max,
    rir_min, rir_max, rest_seconds, track_load, coach_note
  )
  select
    id, workout_day_id, exercise_id, position, sets, reps_min, reps_max,
    rir_min, rir_max, rest_seconds, track_load, coach_note
  from jsonb_to_recordset(payload->'plan_exercises') as x(
    id uuid, workout_day_id uuid, exercise_id uuid, position smallint, sets smallint,
    reps_min smallint, reps_max smallint, rir_min numeric, rir_max numeric,
    rest_seconds smallint, track_load boolean, coach_note text
  )
  on conflict (id) do update set
    workout_day_id = excluded.workout_day_id,
    exercise_id = excluded.exercise_id,
    position = excluded.position,
    sets = excluded.sets,
    reps_min = excluded.reps_min,
    reps_max = excluded.reps_max,
    rir_min = excluded.rir_min,
    rir_max = excluded.rir_max,
    rest_seconds = excluded.rest_seconds,
    track_load = excluded.track_load,
    coach_note = excluded.coach_note;

  insert into public.plan_exercise_alternatives (
    id, plan_exercise_id, exercise_id, label, position, reps_min, reps_max, note
  )
  select id, plan_exercise_id, exercise_id, label, position, reps_min, reps_max, note
  from jsonb_to_recordset(payload->'alternatives') as x(
    id uuid, plan_exercise_id uuid, exercise_id uuid, label text, position smallint,
    reps_min smallint, reps_max smallint, note text
  )
  on conflict (id) do update set
    plan_exercise_id = excluded.plan_exercise_id,
    exercise_id = excluded.exercise_id,
    label = excluded.label,
    position = excluded.position,
    reps_min = excluded.reps_min,
    reps_max = excluded.reps_max,
    note = excluded.note;
end $$;

commit;
