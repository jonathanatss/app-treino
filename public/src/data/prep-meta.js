// Auto variant media overrides and preparatory exercise metadata.
// Depends on: EXERCISE_MEDIA, MEDIA_ALIASES (exercise-media.js)

const AUTO_VARIANT_MEDIA = {
  "lower-a-squat": {
    "hack-squat": MEDIA_ALIASES.sledHackSquat,
    "agachamento-livre": EXERCISE_MEDIA["lower-a-squat"]
  },
  "upper-a-fly": {
    "crucifixo-maquina": EXERCISE_MEDIA["upper-a-fly"],
    "crossover": MEDIA_ALIASES.cableCrossover
  },
  "lower-b-hip-thrust": {
    "elevacao-pelvica-barra": EXERCISE_MEDIA["lower-b-hip-thrust"],
    "smith": MEDIA_ALIASES.smithHipThrust
  },
  "lower-b-abductor": {
    "abdutora-maquina": EXERCISE_MEDIA["lower-b-abductor"],
    "cabo": MEDIA_ALIASES.cableHipAbduction
  },
  "upper-b-chest-accessory": {
    "chest-press-unilateral": EXERCISE_MEDIA["upper-b-chest-machine"],
    "peck-deck": EXERCISE_MEDIA["upper-b-chest-accessory"]
  },
  "full-body-chest": {
    "supino-maquina-convergente": EXERCISE_MEDIA["full-body-chest"],
    "crossover": MEDIA_ALIASES.cableCrossover,
    "crossover-de-cima-para-baixo": MEDIA_ALIASES.cableCrossover
  },
  "sara-la-squat": {
    "agachamento-com-halteres": MEDIA_ALIASES.dumbbellGobletSquat,
    "hack": EXERCISE_MEDIA["sara-la-squat"],
    "no-hack": EXERCISE_MEDIA["sara-la-squat"]
  },
  "sara-ua-pulldown": {
    "puxada-alta-neutra": EXERCISE_MEDIA["sara-ua-pulldown"],
    "pegada-media": EXERCISE_MEDIA["eduarda-ba-pulldown-wide"]
  },
  "sara-lb-rdl": {
    "levantamento-terra-romeno-com-barra": EXERCISE_MEDIA["sara-lb-rdl"],
    "halteres": EXERCISE_MEDIA["sara-lb-stiff"]
  },
  "sara-ub-tricep-testa": {
    "triceps-testa": MEDIA_ALIASES.ezSkullCrusher,
    "frances": EXERCISE_MEDIA["sara-ub-tricep-testa"]
  },
  "fernanda-la-hack": {
    "hack-squat": EXERCISE_MEDIA["fernanda-la-hack"],
    "agachamento-goblet": MEDIA_ALIASES.gobletSquat
  },
  "fernanda-la-calf": {
    "panturrilha-em-pe": EXERCISE_MEDIA["fernanda-la-calf"],
    "sentada": EXERCISE_MEDIA["lower-b-seated-calf"]
  },
  "fernanda-ua-curl": {
    "rosca-direta": EXERCISE_MEDIA["upper-a-curl"],
    "cabo": EXERCISE_MEDIA["fernanda-ua-curl"]
  },
  "fernanda-lb-hipthrust": {
    "elevacao-pelvica": EXERCISE_MEDIA["fernanda-lb-hipthrust"],
    "glute-bridge": { id: "rmEukuS", label: "Single leg bridge" }
  },
  "fernanda-ub-row": {
    "remada-maquina": MEDIA_ALIASES.machineRow,
    "cabo": EXERCISE_MEDIA["fernanda-ub-row"]
  },
  "eduarda-up-triceps": {
    "triceps-pulley-corda": EXERCISE_MEDIA["eduarda-up-triceps"],
    "barra-w": MEDIA_ALIASES.vBarPushdown
  },
  "eduarda-lb-kickback": {
    "gluteo-no-cabo": EXERCISE_MEDIA["eduarda-lb-kickback"],
    "coice-na-polia": MEDIA_ALIASES.cableKickback
  },
  "eduarda-lb-abs": {
    "abdominal-infra": EXERCISE_MEDIA["eduarda-lb-abs"],
    "elevacao-de-pernas": MEDIA_ALIASES.legRaise
  },
  "eduarda-bb-pulldown": {
    "puxada-alta-neutra": EXERCISE_MEDIA["eduarda-bb-pulldown"],
    "media": EXERCISE_MEDIA["eduarda-ba-pulldown-wide"]
  },
  "eduarda-bb-row": {
    "remada-baixa-maquina": MEDIA_ALIASES.machineRow,
    "cabo": EXERCISE_MEDIA["eduarda-bb-row"]
  },
  "eduarda-bb-hammer": {
    "rosca-martelo-corda": EXERCISE_MEDIA["eduarda-bb-hammer"],
    "barra-h": EXERCISE_MEDIA["upper-b-hammer"]
  },
  "fernando-la-bulgarian": {
    "afundo-bulgaro": EXERCISE_MEDIA["fernando-la-bulgarian"],
    "passada-no-smith": MEDIA_ALIASES.smithLunge
  },
  "fernando-ub-fly": {
    "crucifixo-maquina": EXERCISE_MEDIA["fernando-ub-fly"],
    "crossover": MEDIA_ALIASES.cableCrossover
  },
  "fernando-ub-triceps-french": {
    "triceps-frances": EXERCISE_MEDIA["fernando-ub-triceps-french"],
    "testa-cabo": { url: "https://liftmanual.com/wp-content/uploads/2023/04/cable-lying-triceps-extension.webp", label: "Cable lying triceps extension" }
  },
  "fernando-lb-hipthrust": {
    "elevacao-pelvica-maquina": MEDIA_ALIASES.smithHipThrust,
    "barra": EXERCISE_MEDIA["fernando-lb-hipthrust"]
  }
};

const PREP_EXERCISE_META = {
  jonathan: {
    "lower-a-squat": { group: "quadríceps", kind: "heavy" },
    "lower-a-leg-press": { group: "quadríceps", kind: "heavy" },
    "lower-a-ext": { group: "quadríceps", kind: "isolation" },
    "lower-a-curl": { group: "posterior", kind: "isolation" },
    "lower-a-calf": { group: "panturrilha", kind: "isolation" },
    "upper-a-external-rotation": { group: "ombros", kind: "isolation" },
    "upper-a-incline-db": { group: "peito", kind: "heavy" },
    "upper-a-fly": { group: "peito", kind: "isolation" },
    "upper-a-row": { group: "costas", kind: "heavy" },
    "upper-a-pulldown": { group: "costas", kind: "moderate" },
    "upper-a-lateral": { group: "ombros", kind: "isolation" },
    "upper-a-triceps": { group: "tríceps", kind: "isolation" },
    "upper-a-curl": { group: "bíceps", kind: "isolation" },
    "upper-a-abs-machine": { group: "abdômen", kind: "isolation" },
    "lower-b-rdl": { group: "posterior", kind: "heavy" },
    "lower-b-hip-thrust": { group: "glúteos", kind: "heavy" },
    "lower-b-articulated-leg-press": { group: "quadríceps", kind: "moderate" },
    "lower-b-hamstring": { group: "posterior", kind: "isolation" },
    "lower-b-abductor": { group: "glúteos", kind: "isolation" },
    "lower-b-seated-calf": { group: "panturrilha", kind: "isolation" },
    "upper-b-external-rotation": { group: "ombros", kind: "isolation" },
    "upper-b-chest-machine": { group: "peito", kind: "heavy" },
    "jonathan-push-b-chest": { group: "peito", kind: "moderate" },
    "upper-b-chest-accessory": { group: "peito", kind: "moderate" },
    "upper-b-unilateral-row": { group: "costas", kind: "heavy" },
    "jonathan-pull-b-unilateral-row": { group: "costas", kind: "moderate" },
    "upper-b-unilateral-pulldown": { group: "costas", kind: "moderate" },
    "upper-b-incline-curl": { group: "bíceps", kind: "isolation" },
    "upper-b-hammer": { group: "bíceps", kind: "isolation" },
    "upper-b-triceps-rope": { group: "tríceps", kind: "isolation" },
    "upper-b-face-pull": { group: "ombros", kind: "isolation" },
    "full-body-external-rotation": { group: "ombros", kind: "isolation" },
    "full-body-horizontal-leg-press": { group: "quadríceps", kind: "moderate" },
    "full-body-hamstring": { group: "posterior", kind: "isolation" },
    "full-body-chest": { group: "peito", kind: "moderate" },
    "full-body-row": { group: "costas", kind: "moderate" },
    "full-body-straight-arm-pulldown": { group: "costas", kind: "isolation" },
    "full-body-shoulder-press": { group: "ombros", kind: "moderate" },
    "full-body-cable-curl": { group: "bíceps", kind: "isolation" },
    "full-body-triceps": { group: "tríceps", kind: "isolation" },
    "full-body-abs": { group: "abdômen", kind: "isolation" },
    "jonathan-push-b-abs": { group: "abdômen", kind: "isolation" },
    "jonathan-legs-b-hack": { group: "quadríceps", kind: "heavy" },
    "jonathan-legs-b-ext": { group: "quadríceps", kind: "isolation" },
    "jonathan-legs-b-curl": { group: "posterior", kind: "isolation" },
    "jonathan-legs-b-lying-curl": { group: "posterior", kind: "isolation" }
  },
  nathalia: {
    "nathalia-fa-smith-squat": { group: "quadríceps", kind: "moderate" },
    "nathalia-fa-legpress": { group: "quadríceps", kind: "moderate" },
    "nathalia-fa-ext": { group: "quadríceps", kind: "isolation" },
    "nathalia-fa-pulldown": { group: "costas", kind: "moderate" },
    "nathalia-fa-db-press": { group: "peito", kind: "moderate" },
    "nathalia-fa-triceps": { group: "tríceps", kind: "isolation" },
    "nathalia-fa-curl": { group: "bíceps", kind: "isolation" },
    "nathalia-fa-plank": { group: "abdômen", kind: "isolation" },
    "nathalia-fb-hipthrust": { group: "glúteos", kind: "moderate" },
    "nathalia-fb-seated-curl": { group: "posterior", kind: "isolation" },
    "nathalia-fb-bulgarian": { group: "quadríceps/glúteos", kind: "moderate" },
    "nathalia-fb-row": { group: "costas", kind: "moderate" },
    "nathalia-fb-lateral": { group: "ombros", kind: "isolation" },
    "nathalia-fb-triceps-french": { group: "tríceps", kind: "isolation" },
    "nathalia-fb-hammer": { group: "bíceps", kind: "isolation" },
    "nathalia-fb-deadbug": { group: "abdômen", kind: "isolation" },
    "nathalia-fb-bike": { group: "cardio", kind: "cardio" },
    "nathalia-fc-sumo": { group: "glúteos/pernas", kind: "moderate" },
    "nathalia-fc-legpress-high": { group: "glúteos/posterior", kind: "moderate" },
    "nathalia-fc-abductor": { group: "glúteos", kind: "isolation" },
    "nathalia-fc-one-arm-row": { group: "costas", kind: "moderate" },
    "nathalia-fc-incline-db": { group: "peito", kind: "moderate" },
    "nathalia-fc-lateral": { group: "ombros", kind: "isolation" },
    "nathalia-fc-scott": { group: "bíceps", kind: "isolation" },
    "nathalia-fc-triceps": { group: "tríceps", kind: "isolation" },
    "nathalia-fc-crunch": { group: "abdômen", kind: "isolation" }
  },
  pablo: {
    "pablo-ua-chest": { group: "peito", kind: "moderate" },
    "pablo-ua-pulldown": { group: "costas", kind: "moderate" },
    "pablo-ua-row": { group: "costas", kind: "moderate" },
    "pablo-ua-incline": { group: "peito", kind: "moderate" },
    "pablo-ua-facepull": { group: "trapézio/escápulas", kind: "isolation" },
    "pablo-ua-shrug": { group: "trapézio", kind: "isolation" },
    "pablo-ua-abs": { group: "abdômen", kind: "isolation" },
    "pablo-la-legpress": { group: "quadríceps", kind: "moderate" },
    "pablo-la-ext": { group: "quadríceps", kind: "isolation" },
    "pablo-la-curl": { group: "posterior", kind: "isolation" },
    "pablo-la-abductor": { group: "glúteos", kind: "isolation" },
    "pablo-la-calf": { group: "panturrilha", kind: "isolation" },
    "pablo-la-bike": { group: "cardio", kind: "cardio" },
    "pablo-ub-incline": { group: "peito", kind: "moderate" },
    "pablo-ub-row": { group: "costas", kind: "moderate" },
    "pablo-ub-pulldown": { group: "costas", kind: "moderate" },
    "pablo-ub-fly": { group: "peito", kind: "isolation" },
    "pablo-ub-shoulder": { group: "ombros", kind: "moderate" },
    "pablo-ub-curl": { group: "bíceps", kind: "isolation" },
    "pablo-ub-triceps": { group: "tríceps", kind: "isolation" },
    "pablo-ub-abs": { group: "abdômen", kind: "isolation" },
    "pablo-lb-squat": { group: "quadríceps", kind: "moderate" },
    "pablo-lb-legpress": { group: "quadríceps/glúteos", kind: "moderate" },
    "pablo-lb-curl": { group: "posterior", kind: "isolation" },
    "pablo-lb-adductor": { group: "adutores", kind: "isolation" },
    "pablo-lb-calf": { group: "panturrilha", kind: "isolation" },
    "pablo-lb-abs": { group: "abdômen", kind: "isolation" },
    "pablo-lb-bike": { group: "cardio", kind: "cardio" },
    "pablo-cardio-run": { group: "cardio", kind: "cardio" },
    "pablo-cardio-mobility": { group: "mobilidade", kind: "isolation" }
  },
  igor: {
    "igor-ua-chest": { group: "peito", kind: "heavy" },
    "igor-ua-row": { group: "costas", kind: "heavy" },
    "igor-ua-incline": { group: "peito", kind: "moderate" },
    "igor-ua-pulldown": { group: "costas", kind: "moderate" },
    "igor-ua-lateral": { group: "ombros", kind: "isolation" },
    "igor-ua-triceps": { group: "tríceps", kind: "isolation" },
    "igor-ua-curl": { group: "bíceps", kind: "isolation" },
    "igor-ua-cardio": { group: "cardio", kind: "cardio" },
    "igor-la-legpress": { group: "quadríceps", kind: "heavy" },
    "igor-la-extension": { group: "quadríceps", kind: "isolation" },
    "igor-la-rdl": { group: "posterior", kind: "heavy" },
    "igor-la-curl": { group: "posterior", kind: "isolation" },
    "igor-la-calf": { group: "panturrilha", kind: "isolation" },
    "igor-la-abs": { group: "abdômen", kind: "isolation" },
    "igor-ub-vertical-pull": { group: "costas", kind: "heavy" },
    "igor-ub-incline-machine": { group: "peito", kind: "heavy" },
    "igor-ub-row": { group: "costas", kind: "moderate" },
    "igor-ub-fly": { group: "peito", kind: "isolation" },
    "igor-ub-shoulder": { group: "ombros", kind: "moderate" },
    "igor-ub-rear-delt": { group: "ombros", kind: "isolation" },
    "igor-ub-triceps": { group: "tríceps", kind: "isolation" },
    "igor-ub-curl": { group: "bíceps", kind: "isolation" },
    "igor-ub-cardio": { group: "cardio", kind: "cardio" },
    "igor-lb-squat": { group: "quadríceps", kind: "heavy" },
    "igor-lb-legpress-unilateral": { group: "quadríceps", kind: "moderate" },
    "igor-lb-hipthrust": { group: "glúteos", kind: "moderate" },
    "igor-lb-curl": { group: "posterior", kind: "isolation" },
    "igor-lb-calf": { group: "panturrilha", kind: "isolation" },
    "igor-lb-abs": { group: "abdômen", kind: "isolation" }
  }
};

