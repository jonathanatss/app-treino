// Exercise variant definitions.
// Depends on: EXERCISE_MEDIA, MEDIA_ALIASES (exercise-media.js)

const EXERCISE_VARIANTS = {
  "pablo-ua-chest": [
    { key: "halteres", label: "halteres", displayName: "Supino reto com halteres", media: EXERCISE_MEDIA["pablo-ua-chest"] },
    { key: "maquina", label: "máquina", displayName: "Supino reto máquina", media: EXERCISE_MEDIA["upper-b-chest-machine"] }
  ],
  "pablo-ua-abs": [
    { key: "maquina", label: "máquina", displayName: "Abdominal máquina", media: EXERCISE_MEDIA["pablo-ua-abs"] },
    { key: "polia", label: "polia", displayName: "Abdominal na polia", media: { id: "WW95auq", label: "Cable kneeling crunch" } }
  ],
  "pablo-la-legpress": [
    { key: "45", label: "45°", displayName: "Leg press 45°", media: EXERCISE_MEDIA["pablo-la-legpress"] },
    { key: "horizontal", label: "horizontal", displayName: "Leg press horizontal", media: EXERCISE_MEDIA["full-body-horizontal-leg-press"] }
  ],
  "pablo-la-curl": [
    { key: "cadeira-flexora", label: "cadeira flexora", displayName: "Cadeira flexora", media: EXERCISE_MEDIA["pablo-la-curl"] },
    { key: "mesa-flexora", label: "mesa flexora", displayName: "Mesa flexora", media: EXERCISE_MEDIA["lower-a-curl"] }
  ],
  "pablo-la-calf": [
    { key: "em-pe", label: "em pé", displayName: "Panturrilha em pé", media: EXERCISE_MEDIA["pablo-la-calf"] },
    { key: "leg-press", label: "no leg press", displayName: "Panturrilha no leg press", media: EXERCISE_MEDIA["lower-a-calf"] }
  ],
  "pablo-ub-incline": [
    { key: "halteres", label: "halteres", displayName: "Supino inclinado com halteres", media: EXERCISE_MEDIA["pablo-ub-incline"] },
    { key: "maquina", label: "máquina", displayName: "Supino inclinado máquina", media: EXERCISE_MEDIA["upper-b-chest-machine"] }
  ],
  "pablo-ub-row": [
    { key: "halter-apoiado", label: "halter apoiado", displayName: "Remada unilateral com halter apoiado", media: EXERCISE_MEDIA["pablo-ub-row"] },
    { key: "maquina", label: "máquina", displayName: "Remada unilateral máquina", media: EXERCISE_MEDIA["upper-b-unilateral-row"] }
  ],
  "pablo-ub-fly": [
    { key: "peck-deck", label: "peck deck", displayName: "Peck deck", media: EXERCISE_MEDIA["pablo-ub-fly"] },
    { key: "crucifixo-maquina", label: "máquina", displayName: "Crucifixo máquina", media: EXERCISE_MEDIA["pablo-ub-fly"] }
  ],
  "pablo-ub-shoulder": [
    { key: "maquina", label: "máquina", displayName: "Desenvolvimento máquina", media: EXERCISE_MEDIA["pablo-ub-shoulder"] },
    { key: "halteres", label: "halteres", displayName: "Desenvolvimento com halteres sentado", media: { id: "znQUdHY", label: "Dumbbell seated shoulder press" } }
  ],
  "pablo-ub-curl": [
    { key: "cabo", label: "cabo", displayName: "Rosca no cabo", media: EXERCISE_MEDIA["pablo-ub-curl"] },
    { key: "direta", label: "direta", displayName: "Rosca direta", media: EXERCISE_MEDIA["upper-a-curl"] }
  ],
  "pablo-ub-abs": [
    { key: "maquina", label: "máquina", displayName: "Abdominal máquina", media: EXERCISE_MEDIA["pablo-ub-abs"] },
    { key: "polia", label: "polia", displayName: "Abdominal na polia", media: { id: "WW95auq", label: "Cable kneeling crunch" } }
  ],
  "pablo-lb-squat": [
    { key: "smith", label: "Smith", displayName: "Agachamento no Smith", media: EXERCISE_MEDIA["pablo-lb-squat"] },
    { key: "goblet", label: "goblet", displayName: "Goblet squat com halter", media: MEDIA_ALIASES.dumbbellGobletSquat }
  ],
  "pablo-lb-abs": [
    { key: "maquina", label: "máquina", displayName: "Abdominal máquina", media: EXERCISE_MEDIA["pablo-lb-abs"] },
    { key: "polia", label: "polia", displayName: "Abdominal na polia", media: { id: "WW95auq", label: "Cable kneeling crunch" } }
  ],
  "sara-lb-uni-thrust": [
    { key: "elevacao-pelvica-unilateral", label: "Elevação pélvica unilateral", media: { id: "rmEukuS", label: "Single leg bridge" } },
    { key: "coice-polia", label: "Coice na polia", media: { id: "Kpajagk", label: "Cable standing hip extension" } }
  ],
  "sara-ub-row-curva": [
    { key: "remada-curvada-barra", label: "Remada curvada com barra", media: { id: "eZyBC3j", label: "Barbell bent over row" } },
    { key: "remada-unilateral-halter", label: "Remada unilateral com halter", media: { id: "Fhdtwf3", label: "Lever one arm bent over row" } }
  ],
  "fernanda-ua-press": [
    { key: "supino-maquina", label: "Supino máquina", media: { id: "DOoWcnA", label: "Lever chest press" } },
    { key: "supino-halteres", label: "Supino com halteres", media: { id: "SpYC0Kp", label: "Dumbbell bench press" } }
  ],
  "fernanda-ub-fly": [
    { key: "crucifixo-maquina", label: "Crucifixo máquina", media: { id: "v3xmPAR", label: "Lever seated fly" } },
    { key: "supino-leve", label: "Supino leve", media: { id: "SpYC0Kp", label: "Dumbbell bench press" } }
  ],
  "fernanda-ub-curl": [
    { key: "rosca-martelo", label: "Rosca martelo", media: { id: "IGtBdNT", label: "Dumbbell seated hammer curl" } },
    { key: "rosca-cabo", label: "Rosca cabo", media: { id: "G08RZcQ", label: "Cable curl" } }
  ],
  "fernanda-opt-cardio": [
    { key: "caminhada", label: "Caminhada", media: MEDIA_ALIASES.treadmillWalk },
    { key: "bike", label: "Bike", media: { id: "a8VDgLw", label: "Stationary bike walk" } },
    { key: "eliptico", label: "Elíptico", media: { id: "rjtuP6X", label: "Walk elliptical cross trainer" } }
  ],
  "eduarda-ba-machine-row": [
    { key: "remada-maquina-articulada", label: "Remada máquina articulada", media: MEDIA_ALIASES.machineRow },
    { key: "unilateral", label: "Unilateral", media: MEDIA_ALIASES.singleArmMachineRow }
  ],
  "fernando-la-smith-squat": [
    { key: "agachamento-smith", label: "Agachamento no Smith", media: { id: "jFtipLl", label: "Smith squat" } },
    { key: "hack-squat", label: "Hack squat", media: MEDIA_ALIASES.sledHackSquat }
  ],
  "fernando-fb-legpress": [
    { key: "leg-press-horizontal", label: "Leg press horizontal", media: { id: "9KU9TYF", label: "Lever horizontal one leg press" } },
    { key: "leg-press-articulado", label: "Leg press articulado", media: { id: "WWD6FzI", label: "Sled 45 degrees one leg press" } }
  ],
  "fernando-fb-row": [
    { key: "remada-baixa", label: "Remada baixa", media: { id: "fUBheHs", label: "Cable seated row" } },
    { key: "remada-maquina", label: "Remada máquina", media: MEDIA_ALIASES.machineRow }
  ],
  "igor-ua-lateral": [
    { key: "polia", label: "polia", displayName: "Elevação lateral na polia", media: { id: "goJ6ezq", label: "Cable lateral raise" } },
    { key: "halteres", label: "halteres", displayName: "Elevação lateral com halteres", media: { id: "DsgkuIt", label: "Dumbbell lateral raise" } }
  ],
  "igor-ub-vertical-pull": [
    { key: "puxada-alta", label: "puxada alta", displayName: "Puxada alta", media: EXERCISE_MEDIA["igor-ub-vertical-pull"] },
    { key: "barra-assistida", label: "barra assistida", displayName: "Barra fixa assistida", media: { id: "kiJ4Z2K", label: "Assisted pull-up" } }
  ],
  "igor-ub-fly": [
    { key: "peck-deck", label: "peck deck", displayName: "Peck deck", media: EXERCISE_MEDIA["igor-ub-fly"] },
    { key: "crossover", label: "crossover", displayName: "Crossover", media: { id: "0CXGHya", label: "Cable cross-over variation" } }
  ],
  "igor-lb-squat": [
    { key: "hack", label: "hack", displayName: "Hack squat", media: EXERCISE_MEDIA["igor-lb-squat"] },
    { key: "smith", label: "Smith", displayName: "Agachamento no Smith", media: { id: "jFtipLl", label: "Smith squat" } }
  ]
};

const PROFILE_EXERCISE_VARIANTS = {
  jonathan: {
    "upper-a-row": [
      { key: "maquina-apoiada", label: "Máquina com apoio", displayName: "Remada máquina com peito apoiado", equipment: "Máquina", media: EXERCISE_MEDIA["upper-a-row"] },
      { key: "remada-t-apoiada", label: "Remada T apoiada", displayName: "Remada T com apoio no peito", equipment: "Máquina", media: { id: "aaXr7ld", label: "Lever T-bar row" } },
      { key: "polia-triangulo", label: "Polia com triângulo", displayName: "Remada baixa na polia com triângulo", equipment: "Polia", media: EXERCISE_MEDIA["full-body-row"] }
    ],
    "upper-a-pulldown": [
      { key: "neutra", label: "Pegada neutra", displayName: "Puxada alta neutra", equipment: "Polia", media: EXERCISE_MEDIA["upper-a-pulldown"] },
      { key: "supinada", label: "Pegada supinada", displayName: "Puxada alta supinada", equipment: "Máquina", media: { id: "ky8FLU8", label: "Lever reverse grip lateral pulldown" } },
      { key: "pronada-media", label: "Pronada média", displayName: "Puxada alta pronada pegada média", equipment: "Polia", media: EXERCISE_MEDIA["eduarda-ba-pulldown-wide"] }
    ],
    "upper-b-unilateral-row": [
      { key: "articulada", label: "Máquina articulada", displayName: "Remada unilateral articulada", equipment: "Máquina", media: EXERCISE_MEDIA["upper-b-unilateral-row"] },
      { key: "halter-apoiado", label: "Halter apoiado", displayName: "Remada unilateral com halter apoiado", equipment: "Halteres", media: { id: "C0MA9bC", label: "Dumbbell one arm bent-over row" } }
    ],
    "full-body-straight-arm-pulldown": [
      { key: "polia", label: "Pulldown na polia", displayName: "Pulldown com braços estendidos na polia", equipment: "Polia", media: EXERCISE_MEDIA["full-body-straight-arm-pulldown"] },
      { key: "pullover-maquina", label: "Pullover máquina", displayName: "Pullover na máquina", equipment: "Máquina", media: { id: "4U7iLb5", label: "Lever pullover" } }
    ],
    "upper-b-face-pull": [
      { key: "face-pull", label: "Face pull", displayName: "Face pull na corda", equipment: "Polia", media: EXERCISE_MEDIA["upper-b-face-pull"] },
      { key: "peck-deck-inverso", label: "Peck deck inverso", displayName: "Crucifixo inverso no peck deck", equipment: "Máquina", media: EXERCISE_MEDIA["igor-ub-rear-delt"] }
    ],
    "upper-a-curl": [
      { key: "barra-ez", label: "Barra EZ", displayName: "Rosca direta com barra EZ", equipment: "Barra EZ", media: { id: "6TG6x2w", label: "EZ barbell curl" } },
      { key: "polia", label: "Polia", displayName: "Rosca direta na polia", equipment: "Polia", media: EXERCISE_MEDIA["full-body-cable-curl"] },
      { key: "halteres", label: "Halteres", displayName: "Rosca direta com halteres", equipment: "Halteres", media: { id: "3s4NnTh", label: "Dumbbell standing biceps curl" } }
    ],
    "upper-b-incline-curl": [
      { key: "inclinada", label: "Banco inclinado", displayName: "Rosca inclinada com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["upper-b-incline-curl"] },
      { key: "scott-maquina", label: "Scott máquina", displayName: "Rosca Scott na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["eduarda-up-scott"] },
      { key: "polia", label: "Polia", displayName: "Rosca direta na polia", equipment: "Polia", media: EXERCISE_MEDIA["full-body-cable-curl"] }
    ],
    "upper-b-hammer": [
      { key: "halteres", label: "Halteres", displayName: "Rosca martelo com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["upper-b-hammer"] },
      { key: "corda", label: "Corda na polia", displayName: "Rosca martelo com corda", equipment: "Polia", media: EXERCISE_MEDIA["eduarda-bb-hammer"] }
    ],
    "upper-a-incline-db": [
      { key: "halteres-neutra", label: "Halteres neutros", displayName: "Supino inclinado com halteres — pegada neutra", equipment: "Halteres", media: EXERCISE_MEDIA["upper-a-incline-db"] },
      { key: "maquina", label: "Máquina inclinada", displayName: "Supino inclinado na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["igor-ub-incline-machine"] },
      { key: "smith", label: "Smith inclinado", displayName: "Supino inclinado no Smith", equipment: "Smith", media: { id: "5v7KYld", label: "Smith incline bench press" } }
    ],
    "upper-b-chest-machine": [
      { key: "convergente", label: "Máquina convergente", displayName: "Supino reto máquina convergente", equipment: "Máquina", media: EXERCISE_MEDIA["upper-b-chest-machine"] },
      { key: "halteres", label: "Halteres", displayName: "Supino reto com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["sara-ua-bench"] },
      { key: "declinado", label: "Supino declinado", displayName: "Supino declinado com halteres", equipment: "Halteres", media: { id: "1qrWgZ2", label: "Dumbbell decline hammer press" } }
    ],
    "upper-a-fly": [
      { key: "crossover-alto-baixo", label: "Crossover alto → baixo", displayName: "Crossover de cima para baixo", equipment: "Polia", media: EXERCISE_MEDIA["upper-a-fly"] },
      { key: "peck-deck", label: "Peck deck", displayName: "Crucifixo no peck deck", equipment: "Máquina", media: EXERCISE_MEDIA["pablo-ub-fly"] },
      { key: "crossover-medio", label: "Crossover médio", displayName: "Crossover na linha do peito", equipment: "Polia", media: { id: "0CXGHya", label: "Cable cross-over variation" } }
    ],
    "full-body-shoulder-press": [
      { key: "maquina-neutra", label: "Máquina neutra", displayName: "Desenvolvimento máquina pegada neutra", equipment: "Máquina", media: EXERCISE_MEDIA["full-body-shoulder-press"] },
      { key: "halteres", label: "Halteres", displayName: "Desenvolvimento sentado com halteres", equipment: "Halteres", media: { id: "znQUdHY", label: "Dumbbell seated shoulder press" } }
    ],
    "upper-a-lateral": [
      { key: "halteres", label: "Halteres", displayName: "Elevação lateral com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["upper-a-lateral"] },
      { key: "polia", label: "Polia", displayName: "Elevação lateral na polia", equipment: "Polia", media: EXERCISE_MEDIA["igor-ua-lateral"] }
    ],
    "fernando-ub-lateral": [
      { key: "halteres", label: "Halteres", displayName: "Elevação lateral com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["fernando-ub-lateral"] },
      { key: "polia", label: "Polia", displayName: "Elevação lateral na polia", equipment: "Polia", media: EXERCISE_MEDIA["igor-ua-lateral"] }
    ],
    "upper-a-triceps": [
      { key: "frances-cabo", label: "Francês no cabo", displayName: "Tríceps francês no cabo", equipment: "Polia", media: EXERCISE_MEDIA["upper-a-triceps"] },
      { key: "frances-ez", label: "Francês com EZ", displayName: "Tríceps francês com barra EZ", equipment: "Barra EZ", media: EXERCISE_MEDIA["sara-ub-tricep-testa"] },
      { key: "testa-cabo", label: "Testa no cabo", displayName: "Tríceps testa no cabo", equipment: "Polia", media: { url: "https://liftmanual.com/wp-content/uploads/2023/04/cable-lying-triceps-extension.webp", label: "Cable lying triceps extension" } }
    ],
    "upper-b-triceps-rope": [
      { key: "corda", label: "Corda", displayName: "Tríceps na polia com corda", equipment: "Polia", media: EXERCISE_MEDIA["upper-b-triceps-rope"] },
      { key: "barra-v", label: "Barra V", displayName: "Tríceps na polia com barra V", equipment: "Polia", media: MEDIA_ALIASES.vBarPushdown }
    ],
    "lower-a-squat": [
      { key: "hack", label: "Hack squat", displayName: "Hack squat", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-squat"] },
      { key: "smith", label: "Smith", displayName: "Agachamento no Smith", equipment: "Smith", media: EXERCISE_MEDIA["fernando-la-smith-squat"] },
      { key: "leg-press", label: "Leg press 45°", displayName: "Leg press 45° — pés médios", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-leg-press"] }
    ],
    "lower-a-leg-press": [
      { key: "45-graus", label: "45°", displayName: "Leg press 45°", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-leg-press"] },
      { key: "horizontal", label: "Horizontal", displayName: "Leg press horizontal", equipment: "Máquina", media: EXERCISE_MEDIA["full-body-horizontal-leg-press"] }
    ],
    "fernando-la-smith-squat": [
      { key: "smith", label: "Smith", displayName: "Agachamento no Smith", equipment: "Smith", media: EXERCISE_MEDIA["fernando-la-smith-squat"] },
      { key: "hack", label: "Hack squat", displayName: "Hack squat", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-squat"] }
    ],
    "lower-a-ext": [
      { key: "bilateral", label: "Bilateral", displayName: "Cadeira extensora bilateral", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-ext"] },
      { key: "unilateral", label: "Unilateral", displayName: "Cadeira extensora unilateral", equipment: "Máquina", reps: "10–15 cada lado", media: EXERCISE_MEDIA["lower-a-ext"] }
    ],
    "lower-b-hamstring": [
      { key: "sentada", label: "Cadeira flexora", displayName: "Cadeira flexora", equipment: "Máquina", media: EXERCISE_MEDIA["lower-b-hamstring"] },
      { key: "deitada", label: "Mesa flexora", displayName: "Mesa flexora", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-curl"] }
    ],
    "lower-a-calf": [
      { key: "em-pe", label: "Em pé", displayName: "Panturrilha em pé na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-calf"] },
      { key: "sentada", label: "Sentada", displayName: "Panturrilha sentada", equipment: "Máquina", media: EXERCISE_MEDIA["lower-b-seated-calf"] }
    ],
    "eduarda-ba-pulldown-wide": [
      { key: "aberta", label: "Pronada aberta", displayName: "Puxada alta pronada aberta", equipment: "Polia", media: EXERCISE_MEDIA["eduarda-ba-pulldown-wide"] },
      { key: "neutra", label: "Pegada neutra", displayName: "Puxada alta neutra", equipment: "Polia", media: EXERCISE_MEDIA["upper-a-pulldown"] },
      { key: "supinada", label: "Pegada supinada", displayName: "Puxada alta supinada", equipment: "Máquina", media: { id: "ky8FLU8", label: "Lever reverse grip lateral pulldown" } }
    ],
    "fernando-ua-row-low": [
      { key: "polia-triangulo", label: "Polia com triângulo", displayName: "Remada baixa com triângulo", equipment: "Polia", media: EXERCISE_MEDIA["fernando-ua-row-low"] },
      { key: "maquina-bilateral", label: "Máquina bilateral", displayName: "Remada baixa na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["igor-ua-row"] },
      { key: "maquina-unilateral", label: "Máquina unilateral", displayName: "Remada baixa unilateral na máquina", equipment: "Máquina", reps: "8–12 cada lado", media: MEDIA_ALIASES.singleArmMachineRow }
    ],
    "jonathan-pull-b-unilateral-row": [
      { key: "articulada", label: "Máquina articulada", displayName: "Remada máquina articulada unilateral", equipment: "Máquina", media: EXERCISE_MEDIA["jonathan-pull-b-unilateral-row"] },
      { key: "halter-apoiado", label: "Halter apoiado", displayName: "Remada unilateral com halter apoiado", equipment: "Halteres", media: { id: "C0MA9bC", label: "Dumbbell one arm bent-over row" } }
    ],
    "sara-ub-incline": [
      { key: "maquina", label: "Máquina inclinada", displayName: "Supino inclinado na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["igor-ub-incline-machine"] },
      { key: "halteres", label: "Halteres", displayName: "Supino inclinado com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["sara-ub-incline"] },
      { key: "smith", label: "Smith inclinado", displayName: "Supino inclinado no Smith", equipment: "Smith", media: { id: "5v7KYld", label: "Smith incline bench press" } }
    ],
    "jonathan-push-b-chest": [
      { key: "unilateral", label: "Chest press unilateral", displayName: "Chest press unilateral", equipment: "Máquina", reps: "10–12 cada lado", media: EXERCISE_MEDIA["jonathan-push-b-chest"] },
      { key: "convergente", label: "Supino convergente", displayName: "Supino reto máquina convergente", equipment: "Máquina", media: EXERCISE_MEDIA["upper-b-chest-machine"] },
      { key: "halteres", label: "Halteres", displayName: "Supino reto com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["sara-ua-bench"] }
    ],
    "full-body-cable-curl": [
      { key: "polia", label: "Polia", displayName: "Rosca direta na polia", equipment: "Polia", media: EXERCISE_MEDIA["full-body-cable-curl"] },
      { key: "halteres", label: "Halteres", displayName: "Rosca direta com halteres", equipment: "Halteres", media: { id: "3s4NnTh", label: "Dumbbell standing biceps curl" } },
      { key: "barra-ez", label: "Barra EZ", displayName: "Rosca direta com barra EZ", equipment: "Barra EZ", media: { id: "6TG6x2w", label: "EZ barbell curl" } }
    ],
    "fernando-fb-scott": [
      { key: "maquina", label: "Scott máquina", displayName: "Rosca Scott na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["eduarda-up-scott"] },
      { key: "halter", label: "Scott unilateral", displayName: "Rosca Scott unilateral com halter", equipment: "Halteres", reps: "10–12 cada lado", media: { id: "7D5bgLT", label: "Dumbbell seated preacher curl" } }
    ],
    "eduarda-bb-hammer": [
      { key: "corda", label: "Corda na polia", displayName: "Rosca martelo com corda", equipment: "Polia", media: EXERCISE_MEDIA["eduarda-bb-hammer"] },
      { key: "halteres", label: "Halteres", displayName: "Rosca martelo com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["upper-b-hammer"] }
    ],
    "fernando-ub-triceps-french": [
      { key: "frances-cabo", label: "Francês no cabo", displayName: "Tríceps francês no cabo", equipment: "Polia", media: EXERCISE_MEDIA["fernando-ub-triceps-french"] },
      { key: "testa-cabo", label: "Testa no cabo", displayName: "Tríceps testa no cabo", equipment: "Polia", media: { url: "https://liftmanual.com/wp-content/uploads/2023/04/cable-lying-triceps-extension.webp", label: "Cable lying triceps extension" } },
      { key: "frances-ez", label: "Francês com EZ", displayName: "Tríceps francês com barra EZ", equipment: "Barra EZ", media: EXERCISE_MEDIA["sara-ub-tricep-testa"] }
    ],
    "full-body-triceps": [
      { key: "unilateral", label: "Unilateral", displayName: "Tríceps unilateral no cabo", equipment: "Polia", media: EXERCISE_MEDIA["full-body-triceps"] },
      { key: "corda", label: "Corda", displayName: "Tríceps na polia com corda", equipment: "Polia", reps: "12–15", media: EXERCISE_MEDIA["upper-b-triceps-rope"] },
      { key: "barra-v", label: "Barra V", displayName: "Tríceps na polia com barra V", equipment: "Polia", reps: "12–15", media: MEDIA_ALIASES.vBarPushdown }
    ],
    "full-body-horizontal-leg-press": [
      { key: "horizontal", label: "Horizontal", displayName: "Leg press horizontal", equipment: "Máquina", media: EXERCISE_MEDIA["full-body-horizontal-leg-press"] },
      { key: "45-graus", label: "45°", displayName: "Leg press 45°", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-leg-press"] }
    ],
    "jonathan-legs-b-hack": [
      { key: "hack", label: "Hack squat", displayName: "Hack squat com pés mais baixos", equipment: "Máquina", media: EXERCISE_MEDIA["jonathan-legs-b-hack"] },
      { key: "smith", label: "Smith", displayName: "Agachamento no Smith com calcanhares elevados", equipment: "Smith", media: EXERCISE_MEDIA["fernando-la-smith-squat"] }
    ],
    "jonathan-legs-b-ext": [
      { key: "unilateral", label: "Unilateral", displayName: "Cadeira extensora unilateral", equipment: "Máquina", media: EXERCISE_MEDIA["jonathan-legs-b-ext"] },
      { key: "bilateral", label: "Bilateral", displayName: "Cadeira extensora bilateral", equipment: "Máquina", reps: "12–15", media: EXERCISE_MEDIA["jonathan-legs-b-ext"] }
    ],
    "lower-b-hip-thrust": [
      { key: "barra", label: "Barra", displayName: "Elevação pélvica com barra", equipment: "Barra", media: EXERCISE_MEDIA["lower-b-hip-thrust"] },
      { key: "smith", label: "Smith", displayName: "Elevação pélvica no Smith", equipment: "Smith", media: MEDIA_ALIASES.smithHipThrust }
    ],
    "jonathan-legs-b-curl": [
      { key: "sentada", label: "Cadeira flexora", displayName: "Cadeira flexora", equipment: "Máquina", media: EXERCISE_MEDIA["jonathan-legs-b-curl"] },
      { key: "deitada", label: "Mesa flexora", displayName: "Mesa flexora", equipment: "Máquina", media: EXERCISE_MEDIA["jonathan-legs-b-lying-curl"] }
    ],
    "jonathan-legs-b-lying-curl": [
      { key: "deitada", label: "Mesa flexora", displayName: "Mesa flexora", equipment: "Máquina", media: EXERCISE_MEDIA["jonathan-legs-b-lying-curl"] },
      { key: "sentada", label: "Cadeira flexora", displayName: "Cadeira flexora", equipment: "Máquina", media: EXERCISE_MEDIA["jonathan-legs-b-curl"] }
    ],
    "lower-b-abductor": [
      { key: "maquina", label: "Máquina abdutora", displayName: "Abdução de quadril na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["lower-b-abductor"] },
      { key: "polia", label: "Polia", displayName: "Abdução de quadril na polia", equipment: "Polia", reps: "15–20 cada lado", media: MEDIA_ALIASES.cableHipAbduction }
    ],
    "lower-b-seated-calf": [
      { key: "sentada", label: "Sentada", displayName: "Panturrilha sentada", equipment: "Máquina", media: EXERCISE_MEDIA["lower-b-seated-calf"] },
      { key: "em-pe", label: "Em pé", displayName: "Panturrilha em pé na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-calf"] }
    ],
    "eduarda-la-bike": [
      { key: "bike", label: "Bike", displayName: "Cardio zona 2 na bike", equipment: "Bike", media: EXERCISE_MEDIA["eduarda-la-bike"] },
      { key: "esteira", label: "Esteira inclinada", displayName: "Cardio zona 2 na esteira inclinada", equipment: "Esteira", media: MEDIA_ALIASES.treadmillWalk },
      { key: "eliptico", label: "Elíptico", displayName: "Cardio zona 2 no elíptico", equipment: "Elíptico", media: EXERCISE_MEDIA["fernanda-opt-cardio"] }
    ]
  },
  pablo: {
    "pablo-ua-abs": [
      { key: "maquina", label: "Máquina", displayName: "Abdominal máquina", equipment: "Máquina", media: EXERCISE_MEDIA["pablo-ua-abs"] }
    ],
    "pablo-ub-abs": [
      { key: "maquina", label: "Máquina", displayName: "Abdominal máquina", equipment: "Máquina", media: EXERCISE_MEDIA["pablo-ub-abs"] }
    ],
    "pablo-lb-abs": [
      { key: "maquina", label: "Máquina", displayName: "Abdominal máquina", equipment: "Máquina", media: EXERCISE_MEDIA["pablo-lb-abs"] }
    ]
  }
};

const SHARED_MOVEMENT_VARIANTS = {
  flatPress: [
    { key: "maquina", label: "Máquina convergente", displayName: "Supino reto máquina convergente", equipment: "Máquina", media: EXERCISE_MEDIA["full-body-chest"] },
    { key: "halteres", label: "Halteres", displayName: "Supino reto com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["sara-ua-bench"] }
  ],
  inclinePress: [
    { key: "halteres", label: "Halteres", displayName: "Supino inclinado com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["sara-ub-incline"] },
    { key: "maquina", label: "Máquina inclinada", displayName: "Supino inclinado na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["igor-ub-incline-machine"] },
    { key: "smith", label: "Smith inclinado", displayName: "Supino inclinado no Smith", equipment: "Smith", media: { id: "5v7KYld", label: "Smith incline bench press" } }
  ],
  chestFly: [
    { key: "maquina", label: "Peck deck", displayName: "Crucifixo no peck deck", equipment: "Máquina", media: EXERCISE_MEDIA["pablo-ub-fly"] },
    { key: "crossover", label: "Crossover", displayName: "Crossover na linha do peito", equipment: "Polia", media: { id: "0CXGHya", label: "Cable cross-over variation" } }
  ],
  shoulderPress: [
    { key: "maquina", label: "Máquina", displayName: "Desenvolvimento na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["full-body-shoulder-press"] },
    { key: "halteres", label: "Halteres", displayName: "Desenvolvimento sentado com halteres", equipment: "Halteres", media: { id: "znQUdHY", label: "Dumbbell seated shoulder press" } }
  ],
  lateralRaise: [
    { key: "halteres", label: "Halteres", displayName: "Elevação lateral com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["upper-a-lateral"] },
    { key: "polia", label: "Polia", displayName: "Elevação lateral na polia", equipment: "Polia", media: EXERCISE_MEDIA["igor-ua-lateral"] }
  ],
  rearShoulder: [
    { key: "maquina", label: "Peck deck inverso", displayName: "Crucifixo inverso no peck deck", equipment: "Máquina", media: EXERCISE_MEDIA["igor-ub-rear-delt"] },
    { key: "face-pull", label: "Face pull", displayName: "Face pull na corda", equipment: "Polia", media: EXERCISE_MEDIA["upper-b-face-pull"] }
  ],
  horizontalRow: [
    { key: "polia-triangulo", label: "Polia com triângulo", displayName: "Remada baixa na polia com triângulo", equipment: "Polia", media: EXERCISE_MEDIA["full-body-row"] },
    { key: "maquina-apoiada", label: "Máquina apoiada", displayName: "Remada máquina com peito apoiado", equipment: "Máquina", media: EXERCISE_MEDIA["upper-a-row"] },
    { key: "maquina-unilateral", label: "Máquina unilateral", displayName: "Remada unilateral na máquina", equipment: "Máquina", perSide: true, media: MEDIA_ALIASES.singleArmMachineRow },
    { key: "halter-unilateral", label: "Halter apoiado", displayName: "Remada unilateral com halter apoiado", equipment: "Halteres", perSide: true, media: { id: "C0MA9bC", label: "Dumbbell one arm bent-over row" } },
    { key: "remada-t", label: "Remada T apoiada", displayName: "Remada T com apoio no peito", equipment: "Máquina", media: { id: "aaXr7ld", label: "Lever T-bar row" } }
  ],
  verticalPull: [
    { key: "neutra", label: "Pegada neutra", displayName: "Puxada alta neutra", equipment: "Polia", media: EXERCISE_MEDIA["upper-a-pulldown"] },
    { key: "pronada", label: "Pronada aberta", displayName: "Puxada alta pronada aberta", equipment: "Polia", media: EXERCISE_MEDIA["eduarda-ba-pulldown-wide"] },
    { key: "supinada", label: "Pegada supinada", displayName: "Puxada alta supinada", equipment: "Máquina", media: { id: "ky8FLU8", label: "Lever reverse grip lateral pulldown" } },
    { key: "assistida", label: "Barra assistida", displayName: "Barra fixa assistida", equipment: "Máquina assistida", media: { id: "kiJ4Z2K", label: "Assisted pull-up" } }
  ],
  straightArmPull: [
    { key: "polia", label: "Polia", displayName: "Pulldown com braços estendidos na polia", equipment: "Polia", media: EXERCISE_MEDIA["full-body-straight-arm-pulldown"] },
    { key: "maquina", label: "Pullover máquina", displayName: "Pullover na máquina", equipment: "Máquina", media: { id: "4U7iLb5", label: "Lever pullover" } }
  ],
  bicepsCurl: [
    { key: "barra-ez", label: "Barra EZ", displayName: "Rosca direta com barra EZ", equipment: "Barra EZ", media: { id: "6TG6x2w", label: "EZ barbell curl" } },
    { key: "polia", label: "Polia", displayName: "Rosca direta na polia", equipment: "Polia", media: EXERCISE_MEDIA["full-body-cable-curl"] },
    { key: "halteres", label: "Halteres", displayName: "Rosca direta com halteres", equipment: "Halteres", media: { id: "3s4NnTh", label: "Dumbbell standing biceps curl" } }
  ],
  hammerCurl: [
    { key: "halteres", label: "Halteres", displayName: "Rosca martelo com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["upper-b-hammer"] },
    { key: "corda", label: "Corda na polia", displayName: "Rosca martelo com corda", equipment: "Polia", media: EXERCISE_MEDIA["eduarda-bb-hammer"] }
  ],
  preacherCurl: [
    { key: "maquina", label: "Scott máquina", displayName: "Rosca Scott na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["eduarda-up-scott"] },
    { key: "halter", label: "Scott unilateral", displayName: "Rosca Scott unilateral com halter", equipment: "Halteres", perSide: true, media: { id: "7D5bgLT", label: "Dumbbell seated preacher curl" } }
  ],
  tricepsPushdown: [
    { key: "corda", label: "Corda", displayName: "Tríceps na polia com corda", equipment: "Polia", media: EXERCISE_MEDIA["upper-b-triceps-rope"] },
    { key: "barra-v", label: "Barra V", displayName: "Tríceps na polia com barra V", equipment: "Polia", media: MEDIA_ALIASES.vBarPushdown },
    { key: "unilateral", label: "Unilateral", displayName: "Tríceps unilateral no cabo", equipment: "Polia", perSide: true, media: EXERCISE_MEDIA["full-body-triceps"] }
  ],
  tricepsOverhead: [
    { key: "frances-cabo", label: "Francês no cabo", displayName: "Tríceps francês no cabo", equipment: "Polia", media: EXERCISE_MEDIA["upper-a-triceps"] },
    { key: "frances-ez", label: "Francês com EZ", displayName: "Tríceps francês com barra EZ", equipment: "Barra EZ", media: EXERCISE_MEDIA["sara-ub-tricep-testa"] },
    { key: "testa-cabo", label: "Testa no cabo", displayName: "Tríceps testa no cabo", equipment: "Polia", media: { url: "https://liftmanual.com/wp-content/uploads/2023/04/cable-lying-triceps-extension.webp", label: "Cable lying triceps extension" } }
  ],
  squat: [
    { key: "hack", label: "Hack squat", displayName: "Hack squat", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-squat"] },
    { key: "smith", label: "Smith", displayName: "Agachamento no Smith", equipment: "Smith", media: EXERCISE_MEDIA["fernando-la-smith-squat"] },
    { key: "goblet", label: "Goblet", displayName: "Agachamento goblet com halter", equipment: "Halter", media: MEDIA_ALIASES.dumbbellGobletSquat }
  ],
  legPress: [
    { key: "45-graus", label: "45°", displayName: "Leg press 45°", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-leg-press"] },
    { key: "horizontal", label: "Horizontal", displayName: "Leg press horizontal", equipment: "Máquina", media: EXERCISE_MEDIA["full-body-horizontal-leg-press"] },
    { key: "unilateral", label: "Unilateral", displayName: "Leg press unilateral", equipment: "Máquina", perSide: true, media: EXERCISE_MEDIA["lower-b-articulated-leg-press"] }
  ],
  legExtension: [
    { key: "bilateral", label: "Bilateral", displayName: "Cadeira extensora bilateral", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-ext"] },
    { key: "unilateral", label: "Unilateral", displayName: "Cadeira extensora unilateral", equipment: "Máquina", perSide: true, media: EXERCISE_MEDIA["lower-a-ext"] }
  ],
  legCurl: [
    { key: "sentada", label: "Cadeira flexora", displayName: "Cadeira flexora", equipment: "Máquina", media: EXERCISE_MEDIA["lower-b-hamstring"] },
    { key: "deitada", label: "Mesa flexora", displayName: "Mesa flexora", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-curl"] }
  ],
  hipThrust: [
    { key: "maquina", label: "Máquina", displayName: "Elevação pélvica na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["eduarda-la-hipthrust"] },
    { key: "barra", label: "Barra", displayName: "Elevação pélvica com barra", equipment: "Barra", media: EXERCISE_MEDIA["lower-b-hip-thrust"] },
    { key: "smith", label: "Smith", displayName: "Elevação pélvica no Smith", equipment: "Smith", media: MEDIA_ALIASES.smithHipThrust }
  ],
  hipHinge: [
    { key: "barra", label: "Barra", displayName: "Levantamento terra romeno com barra", equipment: "Barra", media: EXERCISE_MEDIA["lower-b-rdl"] },
    { key: "halteres", label: "Halteres", displayName: "Stiff com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["sara-lb-stiff"] }
  ],
  splitSquat: [
    { key: "halteres", label: "Halteres", displayName: "Afundo búlgaro com halteres", equipment: "Halteres", perSide: true, media: EXERCISE_MEDIA["sara-lb-bulgarian"] },
    { key: "smith", label: "Smith", displayName: "Passada no Smith", equipment: "Smith", perSide: true, media: MEDIA_ALIASES.smithLunge }
  ],
  hipAbduction: [
    { key: "maquina", label: "Máquina abdutora", displayName: "Abdução de quadril na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["lower-b-abductor"] },
    { key: "polia", label: "Polia", displayName: "Abdução de quadril na polia", equipment: "Polia", perSide: true, media: MEDIA_ALIASES.cableHipAbduction }
  ],
  hipAdduction: [
    { key: "maquina", label: "Máquina adutora", displayName: "Adução de quadril na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["sara-la-adductor"] },
    { key: "polia", label: "Polia", displayName: "Adução de quadril na polia", equipment: "Polia", perSide: true, media: { id: "hBGWILP", label: "Cable hip adduction" } }
  ],
  sumoSquat: [
    { key: "halter", label: "Halter", displayName: "Agachamento sumô com halter", equipment: "Halter", media: EXERCISE_MEDIA["sara-lb-sumo"] },
    { key: "smith", label: "Smith", displayName: "Agachamento sumô no Smith", equipment: "Smith", media: { id: "dzz6BiV", label: "Smith sumo squat" } }
  ],
  shrug: [
    { key: "halteres", label: "Halteres", displayName: "Encolhimento com halteres", equipment: "Halteres", media: EXERCISE_MEDIA["pablo-ua-shrug"] },
    { key: "maquina", label: "Máquina", displayName: "Encolhimento na máquina", equipment: "Máquina", media: { id: "ZZKbeMw", label: "Lever shrug" } }
  ],
  hipExtension: [
    { key: "polia", label: "Polia", displayName: "Coice na polia", equipment: "Polia", perSide: true, media: EXERCISE_MEDIA["fernanda-opt-kickback"] },
    { key: "unilateral", label: "Elevação unilateral", displayName: "Elevação pélvica unilateral", equipment: "Banco", perSide: true, media: EXERCISE_MEDIA["sara-lb-uni-thrust"] }
  ],
  cardio: [
    { key: "bike", label: "Bike", displayName: "Cardio na bike", equipment: "Bike", media: EXERCISE_MEDIA["eduarda-la-bike"] },
    { key: "esteira", label: "Esteira inclinada", displayName: "Cardio na esteira inclinada", equipment: "Esteira", media: MEDIA_ALIASES.treadmillWalk },
    { key: "eliptico", label: "Elíptico", displayName: "Cardio no elíptico", equipment: "Elíptico", media: EXERCISE_MEDIA["fernanda-opt-cardio"] }
  ],
  calfRaise: [
    { key: "em-pe", label: "Em pé", displayName: "Panturrilha em pé na máquina", equipment: "Máquina", media: EXERCISE_MEDIA["lower-a-calf"] },
    { key: "sentada", label: "Sentada", displayName: "Panturrilha sentada", equipment: "Máquina", media: EXERCISE_MEDIA["lower-b-seated-calf"] }
  ]
};
