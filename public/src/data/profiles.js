// Workout profiles and training plans for all FitPlan users.
// This file is auto-loaded before the main app script.

const profiles = {
  jonathan: {
    name: "Jonathan",
    initials: "J",
    accent: "var(--blue)",
    title: "FitPlan",
    subtitle: "PPL + Upper/Lower 5x • Perda de gordura mantendo massa • Costas/braços/quadríceps • 09/08/2026",
    defaultTab: "legsA",
    tabs: [
      { key: "legsA", label: "Seg • Lower A", color: "var(--green)" },
      { key: "pushA", label: "Ter • Push", color: "var(--rose)" },
      { key: "pullA", label: "Qua • Pull", color: "var(--blue)" },
      { key: "legsB", label: "Sex • Lower B", color: "var(--green)" },
      { key: "pullB", label: "Sáb • Upper", color: "var(--violet)" }
    ],
    workouts: {
      pullA: {
        title: "Quarta • Pull • Costas + Bíceps pesado",
        warmup: "Aquecimento: 5 min cardio + séries preparatórias na primeira remada e na primeira rosca",
        total: "17–18 séries • ~65–80 min",
        exercises: [
          { id: "upper-a-row", name: "Remada máquina com peito apoiado", note: "Costas pesado sem roubar com lombar/trapézio", sets: "3", reps: "6–8", rir: "1–2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "upper-a-pulldown", name: "Puxada alta neutra", note: "Dorsais, trajetória estável", sets: "3", reps: "8–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "upper-b-unilateral-row", name: "Remada unilateral articulada", note: "Controle escapular e simetria lado a lado", sets: "2", reps: "8–10", rir: "1–2", restLabel: "2 min", restSeconds: 120 },
          { id: "full-body-straight-arm-pulldown", name: "Pulldown na polia", note: "Isolador de dorsal, braços quase estendidos", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "upper-b-face-pull", name: "Face pull", note: "Deltoide posterior e estabilidade escapular; leve se o trapézio estiver sensível", sets: "2", reps: "15–20", rir: "2", restLabel: "60 s", restSeconds: 60 },
          { id: "upper-a-curl", name: "Rosca direta EZ", note: "Bíceps pesado, progressão dupla", sets: "2", reps: "6–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "upper-b-incline-curl", name: "Rosca inclinada ou cabo", note: "Bíceps alongado ou tensão constante", sets: "2", reps: "10–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "upper-b-hammer", name: "Rosca martelo", note: "Braquial e antebraço; use 1–2 séries conforme recuperação", sets: "1–2", reps: "10–12", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 }
        ]
      },
      pushA: {
        title: "Terça • Push A • Peito + Tríceps pesado",
        warmup: "Aquecimento: 5 min cardio + séries preparatórias no primeiro supino e no primeiro tríceps",
        total: "19–20 séries • ~70–85 min",
        exercises: [
          { id: "upper-a-incline-db", name: "Supino inclinado halteres neutro", note: "Peito principal, ainda com margem de progressão", sets: "3", reps: "6–8", rir: "1–2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "upper-b-chest-machine", name: "Supino reto máquina", note: "Peito com estabilidade e boa relação estímulo/fadiga", sets: "2–3", reps: "8–10", rir: "1–2", restLabel: "2 min", restSeconds: 120 },
          { id: "upper-a-fly", name: "Crossover", note: "Peitoral com amplitude controlada", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "full-body-shoulder-press", name: "Desenvolvimento máquina pegada neutra", note: "Ombro guiado, sem travar cotovelos", sets: "2", reps: "8–10", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "upper-a-lateral", name: "Elevação lateral", note: "Deltoide medial em manutenção/progresso leve", sets: "3", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "upper-a-triceps", name: "Tríceps francês no cabo", note: "Cabeça longa, descanso suficiente para progredir", sets: "2", reps: "8–10", rir: "0–1", restLabel: "60–90 s", restSeconds: 90 },
          { id: "upper-b-triceps-rope", name: "Tríceps corda", note: "Cotovelos fixos, extensão completa", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60–90 s", restSeconds: 90 },
          { id: "upper-a-abs-machine", name: "Abdominal máquina", note: "Core com carga progressiva", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      legsA: {
        title: "Segunda • Lower A • Quadríceps",
        warmup: "Aquecimento: 5 min cardio + mobilidade de quadril/tornozelo + séries preparatórias no hack",
        total: "13–14 séries • ~55–70 min",
        exercises: [
          { id: "lower-a-squat", name: "Hack squat", note: "Quadríceps pesado, sem búlgaro/afundo", sets: "3", reps: "6–8", rir: "1–2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "lower-a-leg-press", name: "Leg press 45°", note: "Quadríceps complementar, amplitude estável", sets: "2", reps: "8–12", rir: "1–2", restLabel: "2 min", restSeconds: 120 },
          { id: "lower-a-ext", name: "Cadeira extensora", note: "Isolado de quadríceps, controle excêntrico", sets: "2", reps: "10–15", rir: "0–1", restLabel: "60–90 s", restSeconds: 90 },
          { id: "lower-b-hamstring", name: "Cadeira flexora", note: "Posterior em manutenção ativa; faça 2–3 séries conforme recuperação", sets: "2–3", reps: "10–12", rir: "0–1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "lower-a-calf", name: "Panturrilha em pé", note: "Amplitude completa e pausa no topo", sets: "4", reps: "10–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 }
        ]
      },
      pullB: {
        title: "Sábado • Upper • Costas + Peito + Braços",
        warmup: "Aquecimento: 5 min cardio + mobilidade de ombro + séries preparatórias na primeira puxada e no primeiro supino",
        total: "19–20 séries • ~70–85 min",
        exercises: [
          { id: "eduarda-ba-pulldown-wide", name: "Puxada alta", note: "Costas vertical, foco em dorsais", sets: "2", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-ua-row-low", name: "Remada baixa com triângulo", note: "Costas horizontal, sem elevar ombros", sets: "2", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "jonathan-pull-b-unilateral-row", name: "Remada unilateral", note: "Controle de assimetria, execução limpa", sets: "2", reps: "10–12", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "sara-ub-incline", name: "Supino inclinado máquina", note: "Peito superior, carga moderada", sets: "2–3", reps: "8–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "jonathan-push-b-chest", name: "Crossover ou supino máquina", note: "Peito complementar com execução controlada", sets: "2", reps: "10–15", rir: "0–1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "full-body-cable-curl", name: "Rosca no cabo", note: "Tensão constante, foco em reps altas", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "fernando-fb-scott", name: "Rosca Scott", note: "Base estável para reduzir balanço", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "fernando-ub-triceps-french", name: "Tríceps francês/testa", note: "Tríceps em alongamento, técnica limpa", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60–90 s", restSeconds: 90 },
          { id: "full-body-triceps", name: "Tríceps unilateral no cabo", note: "Simetria lado a lado", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 }
        ]
      },
      pushB: {
        title: "Sexta • Push B • Ombro/Peito + Tríceps volume",
        warmup: "Aquecimento: 5 min cardio + mobilidade de ombro + séries preparatórias no primeiro supino",
        total: "19 séries • ~70–85 min",
        exercises: [
          { id: "sara-ub-incline", name: "Supino inclinado máquina ou halteres", note: "Peito superior, carga moderada", sets: "3", reps: "8–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "jonathan-push-b-chest", name: "Chest press unilateral ou supino convergente", note: "Peito com estabilidade e simetria", sets: "2", reps: "10–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "full-body-shoulder-press", name: "Desenvolvimento máquina pegada neutra", note: "Ombro guiado, sem travar cotovelos", sets: "2", reps: "8–10", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-ub-lateral", name: "Elevação lateral na polia ou halteres", note: "Deltoide medial, controle total", sets: "3", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "fernando-ub-triceps-french", name: "Tríceps testa ou francês", note: "Tríceps em alongamento, técnica limpa", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60–90 s", restSeconds: 90 },
          { id: "full-body-triceps", name: "Tríceps unilateral no cabo", note: "Simetria lado a lado", sets: "3", reps: "12–15 cada lado", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "jonathan-push-b-abs", name: "Abdominal máquina", note: "Core com carga progressiva", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      legsB: {
        title: "Sexta • Lower B • Quadríceps + Posterior/Glúteo",
        warmup: "Aquecimento: 5 min cardio + mobilidade de quadril/tornozelo + séries preparatórias no leg press",
        total: "20–22 séries + cardio • ~75–90 min",
        exercises: [
          { id: "full-body-horizontal-leg-press", name: "Leg press horizontal", note: "Segundo estímulo pesado de quadríceps", sets: "3", reps: "10–12", rir: "1–2", restLabel: "2 min", restSeconds: 120 },
          { id: "jonathan-legs-b-hack", name: "Hack pés baixos", note: "Ênfase quadríceps, amplitude controlada", sets: "2", reps: "8–10", rir: "1–2", restLabel: "2 min", restSeconds: 120 },
          { id: "jonathan-legs-b-ext", name: "Extensora unilateral", note: "Correção de assimetria e pico de contração; use 1–2 séries conforme recuperação", sets: "1–2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "lower-b-hip-thrust", name: "Elevação pélvica", note: "Glúteo principal, pausa no topo", sets: "3", reps: "8–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "lower-b-rdl", name: "Stiff/RDL", note: "Posterior e glúteo com dobradiça de quadril, coluna neutra; faça 2–3 séries", sets: "2–3", reps: "6–10", rir: "1–2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "jonathan-legs-b-curl", name: "Cadeira flexora", note: "Posterior complementar sem excesso de fadiga lombar", sets: "2", reps: "10–12", rir: "0–1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "lower-b-abductor", name: "Abdutora", note: "Glúteo médio, controle na volta", sets: "2", reps: "15–20", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "lower-b-seated-calf", name: "Panturrilha sentada", note: "Sóleo, amplitude completa", sets: "4", reps: "12–20", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-la-bike", name: "Cardio zona 2", note: "Bike/esteira inclinada 20–30 min se a recuperação estiver boa", sets: "1", reps: "20–30 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      }
    }
  },
  sara: {
    name: "Sara",
    initials: "S",
    accent: "var(--rose)",
    title: "FitPlan",
    subtitle: "Superior/Inferior 4 dias/sem • Foco pernas/glúteo • Volume direto p/ todos os grupos • RIR 1–2",
    defaultTab: "lowerA",
    tabs: [
      { key: "lowerA", label: "Treino inferior A • Quadríceps + glúteos", color: "var(--green)" },
      { key: "upperA", label: "Treino superior A • Peito + costas", color: "var(--violet)" },
      { key: "lowerB", label: "Treino inferior B • Posteriores + glúteos", color: "var(--rose)" },
      { key: "upperB", label: "Treino superior B • Variações", color: "var(--blue)" }
    ],
    workouts: {
      lowerA: {
        title: "Treino inferior A • Quadríceps + glúteos + panturrilhas",
        warmup: "Aquecimento: 5 min de aeróbico leve + ativação de glúteos com faixa 2x15",
        total: "21 séries + cardio • ~60–65 min",
        exercises: [
          { id: "sara-la-squat", name: "Agachamento com halteres ou hack", note: "Quadríceps principal, controle de amplitude e base estável", sets: "3", reps: "6–10", rir: "1–2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "sara-la-hipthrust", name: "Elevação pélvica com barra", note: "Glúteo principal, pausa 1s no topo", sets: "3", reps: "8–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-la-legpress", name: "Leg press 45°", note: "Quadríceps complemento, pés médios", sets: "3", reps: "10–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-la-ext", name: "Cadeira extensora", note: "Quadríceps isolado, controle excêntrico", sets: "4", reps: "12–15", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-la-adductor", name: "Cadeira adutora", note: "Adução de quadril, controle total e pausa curta no fechamento", sets: "2", reps: "15–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "sara-la-flexora", name: "Mesa flexora", note: "Posterior leve", sets: "2", reps: "10–12", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-la-calf", name: "Panturrilha em pé", note: "Gastrocnêmio, amplitude completa", sets: "4", reps: "10–15", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-la-cardio", name: "Cardio zona 2", note: "Bike ou esteira inclinada, ritmo sustentável", sets: "1", reps: "10–15 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      upperA: {
        title: "Treino superior A • Peito + costas + ombros + abdômen",
        warmup: "Aquecimento: 5 min de aeróbico leve + rotação externa com elástico 2x15",
        total: "20 séries + cardio • ~55–60 min",
        exercises: [
          { id: "sara-ua-bench", name: "Supino reto com halteres", note: "Peito principal", sets: "3", reps: "8–10", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-ua-pulldown", name: "Puxada alta neutra ou pegada média", note: "Costas vertical (dorsais)", sets: "3", reps: "8–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-ua-row", name: "Remada baixa no cabo", note: "Costas horizontal (espessura)", sets: "2", reps: "8–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-ua-lateral", name: "Elevação lateral com halteres", note: "Ombro lateral sem polia", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-ua-facepull", name: "Face pull na corda", note: "Ombro posterior + estabilidade escapular", sets: "1", reps: "15–20", rir: "1", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-ua-curl", name: "Rosca direta", note: "Bíceps base, prioridade com volume moderado", sets: "3", reps: "10–12", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-ua-tricep", name: "Tríceps na corda", note: "Tríceps base, prioridade com volume moderado", sets: "3", reps: "10–12", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-ua-plank", name: "Abdominal máquina", note: "Core com carga progressiva", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "sara-ua-cardio", name: "Cardio zona 2", note: "Bike ou esteira inclinada, ritmo sustentável", sets: "1", reps: "10–15 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      lowerB: {
        title: "Treino inferior B • Posteriores + glúteo médio + panturrilhas",
        warmup: "Aquecimento: 5 min de aeróbico leve + 5 min de mobilidade de quadril",
        total: "20 séries + cardio • ~60–65 min",
        exercises: [
          { id: "sara-lb-sumo", name: "Agachamento sumô com halter", note: "Glúteos e adutores, carga controlável", sets: "3", reps: "10–12", rir: "1", restLabel: "90–120 s", restSeconds: 120 },
          { id: "sara-lb-stiff", name: "Stiff com halteres", note: "Cadeia posterior complemento", sets: "3", reps: "10–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-lb-flexora", name: "Cadeira flexora", note: "Posterior isolado para fechar 11 séries semanais", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "sara-lb-lying-curl", name: "Mesa flexora", note: "Posterior complementar sem sobrecarregar lombar", sets: "3", reps: "12–15", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "sara-lb-abductor", name: "Cadeira abdutora", note: "Glúteo médio, pausa 1s no topo", sets: "3", reps: "15–20", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-lb-uni-thrust", name: "Elevação pélvica unilateral ou coice na polia", note: "Glúteo finalização", sets: "2", reps: "12–15", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-lb-calf-seated", name: "Panturrilha sentada", note: "Sóleo, tempo sob tensão", sets: "3", reps: "12–20", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-lb-cardio", name: "Cardio zona 2", note: "Bike ou esteira inclinada, pode cortar se o treino passar de 1h", sets: "1", reps: "10–15 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      upperB: {
        title: "Treino superior B • Variações + ombro posterior + abdômen",
        warmup: "Aquecimento: 5 min de aeróbico leve + rotação externa com elástico 2x15",
        total: "22 séries + cardio • ~60 min",
        exercises: [
          { id: "sara-ub-incline", name: "Supino inclinado com halteres", note: "Peito ângulo superior", sets: "3", reps: "8–10", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-ub-row-curva", name: "Remada curvada com barra ou remada unilateral com halter", note: "Costas espessura", sets: "3", reps: "8–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-ub-pulldown-wide", name: "Puxada alta pegada larga", note: "Dorsais — pega diferente", sets: "2", reps: "10–12", rir: "0–1", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-ub-shoulder-press", name: "Desenvolvimento máquina pegada neutra", note: "Ombros com trajetória guiada, sem travar cotovelos", sets: "2", reps: "8–10", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "sara-ub-rear", name: "Crucifixo invertido na máquina", note: "Ombro posterior direto", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-ub-lateral-cabo", name: "Elevação lateral com halteres", note: "Ombro lateral extra, sem polia", sets: "1", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-ub-hammer", name: "Rosca martelo", note: "Bíceps + braquial, complemento de braço", sets: "3", reps: "10–12", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-ub-tricep-testa", name: "Tríceps testa ou francês", note: "Tríceps composto, complemento de braço", sets: "3", reps: "8–12", rir: "0", restLabel: "60 s", restSeconds: 60 },
          { id: "sara-ub-abs", name: "Abdominal máquina", note: "Core com carga progressiva", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "sara-ub-cardio", name: "Cardio zona 2", note: "Bike ou esteira inclinada, ritmo sustentável", sets: "1", reps: "10–15 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      }
    }
  },
  fernanda: {
    name: "Fernanda",
    initials: "F",
    accent: "var(--green)",
    title: "FitPlan",
    subtitle: "4 dias + sábado opcional • Recomp/lipedema • Glúteos/pernas/tríceps • 45 min",
    defaultTab: "lowerA",
    tabs: [
      { key: "lowerA", label: "Seg • Inferior A", color: "var(--green)" },
      { key: "upperA", label: "Ter • Superior A", color: "var(--rose)" },
      { key: "lowerB", label: "Qui • Inferior B", color: "var(--blue)" },
      { key: "upperB", label: "Sex • Superior B", color: "var(--violet)" },
      { key: "optional", label: "Sáb • Opcional", color: "var(--green)" }
    ],
    workouts: {
      lowerA: {
        title: "Segunda • Inferior A • Glúteo + Quadríceps",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade de quadril 3 min",
        total: "14 séries • ~45 min",
        exercises: [
          { id: "fernanda-la-legpress", name: "Leg press 45°", note: "Quadríceps/glúteo, movimento principal", sets: "3", reps: "10–12", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "fernanda-la-hack", name: "Hack squat ou agachamento goblet", note: "Quadríceps com base estável", sets: "2", reps: "8–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "fernanda-la-ext", name: "Cadeira extensora", note: "Quadríceps isolado, controle na descida", sets: "2", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernanda-la-hipthrust", name: "Elevação pélvica", note: "Glúteo principal, pausa 1s no topo", sets: "3", reps: "8–12", rir: "1", restLabel: "90–120 s", restSeconds: 120 },
          { id: "fernanda-la-abductor", name: "Cadeira abdutora", note: "Glúteo médio, amplitude confortável", sets: "2", reps: "15–20", rir: "0", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernanda-la-calf", name: "Panturrilha em pé ou sentada", note: "Frequência fixa sem depender do sábado", sets: "2", reps: "12–20", rir: "0", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      upperA: {
        title: "Terça • Superior A • Costas + Peito + Braços",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade de ombro 3 min",
        total: "13 séries • ~45 min",
        exercises: [
          { id: "fernanda-ua-pulldown", name: "Puxada alta", note: "Costas vertical, controle escapular", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "fernanda-ua-row", name: "Remada baixa", note: "Costas horizontal, tronco estável", sets: "2", reps: "10–12", rir: "1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "fernanda-ua-press", name: "Supino máquina ou halteres", note: "Peito moderado, sem roubar foco do treino", sets: "2", reps: "8–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "fernanda-ua-lateral", name: "Elevação lateral", note: "Deltoide medial para equilíbrio estético", sets: "2", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernanda-ua-triceps", name: "Tríceps na polia", note: "Extensão na polia, cotovelos estáveis", sets: "2", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernanda-ua-curl", name: "Rosca direta ou cabo", note: "Bíceps básico para equilíbrio do braço", sets: "2", reps: "10–12", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      lowerB: {
        title: "Quinta • Inferior B • Posterior + Glúteo",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade de quadril 3 min",
        total: "12 séries • ~45 min",
        exercises: [
          { id: "fernanda-lb-stiff", name: "Stiff com halteres", note: "Cadeia posterior, progressão com técnica limpa", sets: "3", reps: "8–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "fernanda-lb-curl", name: "Mesa flexora", note: "Posterior isolado, sem impulso", sets: "2", reps: "10–12", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernanda-lb-hipthrust", name: "Elevação pélvica ou glute bridge", note: "Glúteo direto, contração forte no topo", sets: "3", reps: "10–12", rir: "1", restLabel: "90–120 s", restSeconds: 120 },
          { id: "fernanda-lb-bulgarian", name: "Agachamento búlgaro", note: "Unilateral controlado, amplitude confortável", sets: "2", reps: "8–10 cada perna", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "fernanda-lb-abductor", name: "Cadeira abdutora", note: "Glúteo médio, sem pressa na volta", sets: "2", reps: "15–20", rir: "0", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      upperB: {
        title: "Sexta • Superior B • Costas + Braços + Postura",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade de ombro 3 min",
        total: "13 séries • ~45 min",
        exercises: [
          { id: "fernanda-ub-row", name: "Remada máquina ou cabo", note: "Costas principal, trajetória estável", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "fernanda-ub-pulldown", name: "Puxada neutra", note: "Dorsais, pegada confortável", sets: "2", reps: "10–12", rir: "1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "fernanda-ub-fly", name: "Crucifixo máquina ou supino leve", note: "Peito leve, volume de manutenção", sets: "2", reps: "12–15", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "fernanda-ub-facepull", name: "Face pull", note: "Postura, ombro posterior e escápulas", sets: "2", reps: "15–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernanda-ub-triceps", name: "Tríceps francês na polia", note: "Cabeça longa do tríceps, amplitude controlada", sets: "2", reps: "10–12", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernanda-ub-curl", name: "Rosca martelo ou rosca cabo", note: "Bíceps + braquial, complemento de braço", sets: "2", reps: "10–12", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      optional: {
        title: "Sábado • Opcional • Cardio leve + complementos",
        warmup: "Opcional: faça só se estiver bem recuperada, sem peso excessivo ou inchaço nas pernas",
        total: "30–45 min • Baixo impacto",
        exercises: [
          { id: "fernanda-opt-cardio", name: "Caminhada, bike ou elíptico", note: "Escolha 1 opção; GIF ilustra cardio baixo impacto", sets: "1", reps: "30–45 min", rir: "confortável", restLabel: "—", restSeconds: 0, trackWeight: false },
          { id: "fernanda-opt-kickback", name: "Coice no cabo", note: "Glúteo finalização, se estiver recuperada", sets: "2", reps: "15 cada lado", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernanda-opt-plank", name: "Prancha", note: "Core sem impacto", sets: "3", reps: "30–45 s", rir: "0–1", restLabel: "30–45 s", restSeconds: 45 },
          { id: "fernanda-opt-mobility", name: "Mobilidade leve", note: "Quadril, tornozelo e respiração", sets: "1", reps: "5–10 min", rir: "leve", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      }
    }
  },
  eduarda: {
    name: "Maria Eduarda",
    initials: "ME",
    accent: "var(--violet)",
    title: "FitPlan",
    subtitle: "5 dias + sábado opcional • Emagrecimento/condicionamento • Glúteos/costas/abdômen • 1h",
    defaultTab: "lowerA",
    tabs: [
      { key: "lowerA", label: "Seg • Inferior A", color: "var(--green)" },
      { key: "backA", label: "Ter • Costas + Abd", color: "var(--blue)" },
      { key: "upperA", label: "Qua • Superior", color: "var(--rose)" },
      { key: "lowerB", label: "Qui • Inferior B", color: "var(--green)" },
      { key: "backB", label: "Sex • Costas + Braços", color: "var(--violet)" },
      { key: "optional", label: "Sáb • Opcional", color: "var(--blue)" }
    ],
    workouts: {
      lowerA: {
        title: "Segunda • Inferior A • Glúteos + Quadríceps",
        warmup: "Aquecimento: 5 min bike leve + mobilidade de quadril 3 min",
        total: "17 séries + bike • ~60–65 min",
        exercises: [
          { id: "eduarda-la-legpress", name: "Leg press 45°", note: "Quadríceps/glúteo, base estável", sets: "3", reps: "10–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "eduarda-la-smith-squat", name: "Agachamento no Smith", note: "Controle de amplitude, sem buscar carga máxima", sets: "3", reps: "8–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "eduarda-la-ext", name: "Cadeira extensora", note: "Quadríceps isolado, subida forte e descida controlada", sets: "3", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-la-hipthrust", name: "Elevação pélvica máquina", note: "Glúteo principal, pausa 1s no topo", sets: "3", reps: "10–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "eduarda-la-abductor", name: "Abdutora postura reta", note: "Glúteo médio, amplitude confortável", sets: "3", reps: "15–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-la-calf", name: "Panturrilha em pé", note: "Gastrocnêmio, amplitude completa e pausa curta no topo", sets: "2", reps: "12–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-la-bike", name: "Bike leve/moderada", note: "Condicionamento sem impacto", sets: "1", reps: "10–15 min", rir: "confortável", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      backA: {
        title: "Terça • Costas + Abdômen + Bike",
        warmup: "Aquecimento: 5 min bike leve + ativação escapular 2 min",
        total: "16 séries + bike • ~60 min",
        exercises: [
          { id: "eduarda-ba-pulldown-wide", name: "Puxada alta aberta", note: "Costas vertical, foco em dorsais", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "eduarda-ba-row", name: "Remada baixa com triângulo", note: "Costas horizontal, peito alto", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "eduarda-ba-pulldown", name: "Pulldown na polia", note: "Dorsais com braço quase estendido", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-ba-machine-row", name: "Remada máquina articulada ou unilateral", note: "Variação estável, sem roubar com lombar", sets: "2", reps: "10–12", rir: "1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "eduarda-ba-abs", name: "Abdominal máquina", note: "Crunch na máquina, carga progressiva e execução simples", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-ba-plank", name: "Prancha", note: "Core anti-extensão, tronco firme", sets: "3", reps: "30–45 s", rir: "0–1", restLabel: "30–45 s", restSeconds: 45 },
          { id: "eduarda-ba-bike", name: "Bike moderada", note: "Ritmo em que ainda dá para falar frases curtas", sets: "1", reps: "15–20 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      upperA: {
        title: "Quarta • Peito + Ombro + Braços",
        warmup: "Aquecimento: 5 min bike leve + mobilidade de ombro 3 min",
        total: "18 séries • ~60 min",
        exercises: [
          { id: "eduarda-up-chest", name: "Supino reto máquina sentado", note: "Peito principal com estabilidade", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "eduarda-up-incline", name: "Supino inclinado halteres", note: "Peito superior, carga moderada", sets: "2", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "eduarda-up-fly", name: "Crucifixo sentado na máquina", note: "Peito isolado, controle de amplitude", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-up-shoulder-press", name: "Desenvolvimento máquina", note: "Ombros, sem travar cotovelos no topo", sets: "2", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "eduarda-up-lateral", name: "Elevação lateral halteres", note: "Deltoide medial, controle total", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-up-scott", name: "Rosca Scott", note: "Exercício mantido por preferência", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-up-triceps", name: "Tríceps pulley corda ou barra W", note: "Tríceps base, cotovelos fixos", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 }
        ]
      },
      lowerB: {
        title: "Quinta • Inferior B • Posterior + Glúteos + Abdômen",
        warmup: "Aquecimento: 5 min bike leve + mobilidade de quadril 3 min",
        total: "19 séries • ~60–65 min",
        exercises: [
          { id: "eduarda-lb-curl", name: "Cadeira flexora", note: "Posterior sem levantamento terra", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "eduarda-lb-hipthrust", name: "Elevação pélvica máquina", note: "Glúteo principal, progressão gradual", sets: "3", reps: "8–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "eduarda-lb-kickback", name: "Glúteo no cabo ou coice na polia", note: "Glúteo finalização, quadril estável", sets: "3", reps: "12–15 cada lado", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-lb-abductor", name: "Abdutora postura inclinada", note: "Glúteo médio, pausa curta na abertura", sets: "3", reps: "15–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-lb-legpress-high", name: "Leg press com pés mais altos", note: "Ênfase glúteo/posterior, amplitude segura", sets: "2", reps: "10–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "eduarda-lb-calf-seated", name: "Panturrilha sentada", note: "Sóleo, controle na descida e amplitude completa", sets: "2", reps: "12–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-lb-abs", name: "Abdominal infra ou elevação de pernas", note: "Abdômen inferior, sem impulso", sets: "3", reps: "10–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      backB: {
        title: "Sexta • Costas + Braços + Abdômen",
        warmup: "Aquecimento: 5 min bike leve + ativação escapular 2 min",
        total: "17 séries • ~60 min",
        exercises: [
          { id: "eduarda-bb-pulldown", name: "Puxada alta neutra ou média", note: "Costas vertical, pegada confortável", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "eduarda-bb-row", name: "Remada baixa máquina ou cabo", note: "Costas horizontal, controle escapular", sets: "2", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "eduarda-bb-reverse-fly", name: "Voador inverso máquina", note: "Costas alta e ombro posterior", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-bb-scott", name: "Rosca Scott", note: "Bíceps com base estável", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-bb-hammer", name: "Rosca martelo corda ou barra H", note: "Braquial e antebraço", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-bb-triceps-french", name: "Tríceps francês unilateral na polia", note: "Cabeça longa do tríceps", sets: "2", reps: "12–15 cada lado", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-bb-triceps-rope", name: "Tríceps pulley com corda", note: "Tríceps complemento", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "eduarda-bb-abs", name: "Abdominal máquina", note: "Crunch na máquina, carga progressiva e execução simples", sets: "2", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      optional: {
        title: "Sábado • Opcional • Bike + Glúteo/Abdômen leve",
        warmup: "Faça apenas se estiver recuperada; sem corrida",
        total: "30–45 min • Opcional",
        exercises: [
          { id: "eduarda-opt-bike", name: "Bike", note: "Baixo impacto para condicionamento", sets: "1", reps: "30–40 min", rir: "leve/moderado", restLabel: "—", restSeconds: 0, trackWeight: false },
          { id: "eduarda-opt-abductor", name: "Abdutora", note: "Glúteo médio leve, sem moer recuperação", sets: "2", reps: "20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-opt-kickback", name: "Coice no cabo", note: "Glúteo leve, foco em contração", sets: "2", reps: "15 cada lado", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "eduarda-opt-side-plank", name: "Prancha lateral", note: "Core lateral e estabilidade", sets: "2", reps: "30s cada lado", rir: "0–1", restLabel: "30–45 s", restSeconds: 45 },
          { id: "eduarda-opt-mobility", name: "Mobilidade leve", note: "Quadril, tornozelo e respiração", sets: "1", reps: "5–10 min", rir: "leve", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      }
    }
  },
  fernando: {
    name: "Fernando",
    initials: "Fe",
    accent: "var(--champagne)",
    title: "FitPlan",
    subtitle: "5 dias • Hipertrofia • Volume equilibrado • Sem stiff • ~1h",
    defaultTab: "upperA",
    tabs: [
      { key: "upperA", label: "Seg • Superior A", color: "var(--rose)" },
      { key: "lowerA", label: "Ter • Inferior A", color: "var(--green)" },
      { key: "upperB", label: "Qui • Superior B", color: "var(--violet)" },
      { key: "lowerB", label: "Sex • Inferior B", color: "var(--blue)" },
      { key: "fullBody", label: "Sáb • Full Body", color: "var(--green)" }
    ],
    workouts: {
      upperA: {
        title: "Segunda • Superior A",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade de ombro 3 min",
        total: "18 séries • ~60 min",
        exercises: [
          { id: "fernando-ua-flat-db", name: "Supino reto com halteres", note: "Peito principal, progressão de carga", sets: "3", reps: "6–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "fernando-ua-incline-db", name: "Supino inclinado com halteres", note: "Peito superior, carga controlada", sets: "2", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-ua-pulldown-wide", name: "Puxada alta aberta", note: "Costas vertical, foco em dorsais", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-ua-row-low", name: "Remada baixa", note: "Costas horizontal, peito alto", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-ua-lateral", name: "Elevação lateral", note: "Deltoide medial, controle total", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernando-ua-triceps-rope", name: "Tríceps corda", note: "Cotovelos fixos, extensão completa", sets: "2", reps: "10–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "fernando-ua-curl", name: "Rosca direta", note: "Bíceps base, sem balanço", sets: "2", reps: "8–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 }
        ]
      },
      lowerA: {
        title: "Terça • Inferior A • Quadríceps",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade de quadril/tornozelo 3 min",
        total: "15 séries • ~60 min",
        exercises: [
          { id: "fernando-la-smith-squat", name: "Agachamento no Smith ou hack squat", note: "Movimento principal de quadríceps", sets: "3", reps: "6–10", rir: "1–2", restLabel: "2 min", restSeconds: 120 },
          { id: "fernando-la-legpress", name: "Leg press 45°", note: "Quadríceps/glúteo, amplitude controlada", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "fernando-la-ext", name: "Cadeira extensora", note: "Quadríceps isolado, descida controlada", sets: "2", reps: "10–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "fernando-la-bulgarian", name: "Afundo búlgaro ou passada no Smith", note: "Unilateral, controle de joelho e quadril", sets: "2", reps: "8–10 cada perna", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-la-curl", name: "Mesa flexora", note: "Posterior complementar", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "fernando-la-calf", name: "Panturrilha em pé", note: "Amplitude completa", sets: "3", reps: "10–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 }
        ]
      },
      upperB: {
        title: "Quinta • Superior B",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade de ombro 3 min",
        total: "16 séries • ~60 min",
        exercises: [
          { id: "fernando-ub-row-machine", name: "Remada máquina articulada", note: "Costas principal, trajetória estável", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-ub-neutral-pulldown", name: "Puxada neutra", note: "Dorsais, pegada confortável", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-ub-incline-db", name: "Supino inclinado com halteres", note: "Peito superior, estímulo moderado", sets: "2", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-ub-fly", name: "Crucifixo máquina ou crossover", note: "Peito isolado, amplitude confortável", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "fernando-ub-lateral", name: "Elevação lateral com halteres", note: "Ombros sem depender de desenvolvimento", sets: "2", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernando-ub-hammer", name: "Rosca martelo", note: "Braquial e antebraço", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "fernando-ub-triceps-french", name: "Tríceps francês ou testa cabo", note: "Tríceps, amplitude controlada", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 }
        ]
      },
      lowerB: {
        title: "Sexta • Inferior B • Posterior + Glúteos",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade de quadril 3 min",
        total: "15 séries • ~60 min",
        exercises: [
          { id: "fernando-lb-lying-curl", name: "Mesa flexora", note: "Posterior principal, sem stiff", sets: "3", reps: "8–12", rir: "0–1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "fernando-lb-seated-curl", name: "Cadeira flexora", note: "Posterior em outro ângulo", sets: "2", reps: "10–15", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "fernando-lb-hipthrust", name: "Elevação pélvica máquina ou barra", note: "Glúteo principal, pausa no topo", sets: "3", reps: "8–12", rir: "1", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-lb-legpress-high", name: "Leg press pés mais altos", note: "Ênfase posterior/glúteo", sets: "2", reps: "10–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-lb-abductor", name: "Cadeira abdutora", note: "Glúteo médio, controle na volta", sets: "2", reps: "15–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernando-lb-calf", name: "Panturrilha sentada", note: "Sóleo, tempo sob tensão", sets: "3", reps: "12–20", rir: "0–1", restLabel: "60 s", restSeconds: 60 }
        ]
      },
      fullBody: {
        title: "Sábado • Full Body + Braços/Abdômen",
        warmup: "Aquecimento: 5 min cardio leve + mobilidade geral 3 min",
        total: "17 séries • ~60 min",
        exercises: [
          { id: "fernando-fb-legpress", name: "Leg press horizontal ou articulado", note: "Perna complementar, sem moer recuperação", sets: "2", reps: "10–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-fb-curl", name: "Mesa flexora", note: "Posterior leve/moderado", sets: "2", reps: "12–15", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "fernando-fb-flat-db", name: "Supino reto com halteres", note: "Peito complementar", sets: "2", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "fernando-fb-row", name: "Remada baixa ou máquina", note: "Costas complementar", sets: "2", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "fernando-fb-lateral", name: "Elevação lateral", note: "Ombro medial, execução limpa", sets: "2", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "fernando-fb-scott", name: "Rosca Scott", note: "Bíceps com base estável", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "fernando-fb-triceps", name: "Tríceps pulley", note: "Tríceps complemento", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "fernando-fb-abs", name: "Abdominal na polia", note: "Core com carga progressiva", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      }
    }
  },
  nathalia: {
    name: "Nathália",
    initials: "Na",
    accent: "var(--green)",
    title: "FitPlan",
    subtitle: "Full Body 3x • Perda de gordura + saúde muscular • Lombar protegida • 08/2026",
    defaultTab: "fullA",
    tabs: [
      { key: "fullA", label: "Seg • Full Body A", color: "var(--green)" },
      { key: "fullB", label: "Qua • Full Body B", color: "var(--rose)" },
      { key: "fullC", label: "Sex • Full Body C", color: "var(--blue)" }
    ],
    workouts: {
      fullA: {
        title: "Segunda • Full Body A • Quadríceps + Braços",
        warmup: "Aquecimento: 5–8 min bike/esteira + 1–2 séries preparatórias no primeiro exercício de perna e superior",
        total: "23 séries • ~55–65 min",
        exercises: [
          { id: "nathalia-fa-smith-squat", name: "Agachamento no Smith", note: "Quadríceps com trajetória estável, sem buscar carga máxima", sets: "3", reps: "8–10", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "nathalia-fa-legpress", name: "Leg press 45°", note: "Amplitude controlada, lombar colada no banco e sem descer demais", sets: "2", reps: "10–12", rir: "2", restLabel: "90 s", restSeconds: 90 },
          { id: "nathalia-fa-ext", name: "Cadeira extensora", note: "Quadríceps isolado, controle na descida", sets: "3", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "nathalia-fa-pulldown", name: "Puxada alta na polia", note: "Costas vertical, tronco estável", sets: "3", reps: "8–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "nathalia-fa-db-press", name: "Supino reto com halteres", note: "Peito com halteres, sem depender de máquina", sets: "3", reps: "8–10", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "nathalia-fa-triceps", name: "Tríceps corda", note: "Cotovelos fixos, extensão completa", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "nathalia-fa-curl", name: "Rosca direta barra W ou halteres", note: "Bíceps base, sem balanço", sets: "3", reps: "8–12", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "nathalia-fa-plank", name: "Prancha", note: "Core anti-extensão, coluna neutra", sets: "3", reps: "30–45s", rir: "1–2", restLabel: "30–45 s", restSeconds: 45, trackWeight: false }
        ]
      },
      fullB: {
        title: "Quarta • Full Body B • Posterior + Glúteos",
        warmup: "Aquecimento: 5–8 min bike/esteira + mobilidade leve de quadril + séries preparatórias",
        total: "23 séries • ~55–65 min",
        exercises: [
          { id: "nathalia-fb-hipthrust", name: "Elevação pélvica com barra ou Smith", note: "Glúteo principal, pausa 1s no topo", sets: "4", reps: "8–12", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "nathalia-fb-seated-curl", name: "Cadeira flexora", note: "Posterior sem exigir lombar", sets: "3", reps: "10–12", rir: "0–1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "nathalia-fb-bulgarian", name: "Afundo búlgaro com halteres leves", note: "Unilateral; se incomodar lombar/equilíbrio, trocar por abdutora", sets: "2", reps: "10 cada lado", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "nathalia-fb-row", name: "Remada baixa na polia com triângulo", note: "Costas horizontal, peito alto e coluna neutra", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "nathalia-fb-lateral", name: "Elevação lateral", note: "Ombro sem máquina de desenvolvimento", sets: "2", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "nathalia-fb-triceps-french", name: "Tríceps francês na polia", note: "Cabeça longa do tríceps, amplitude controlada", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "nathalia-fb-hammer", name: "Rosca martelo", note: "Bíceps, braquial e antebraço", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "nathalia-fb-deadbug", name: "Prancha inclinada no banco", note: "Core simples, menor exigência técnica e coluna neutra", sets: "3", reps: "30–45s", rir: "1–2", restLabel: "30–45 s", restSeconds: 45, trackWeight: false },
          { id: "nathalia-fb-bike", name: "Bike leve/moderada", note: "Condicionamento sem impacto", sets: "1", reps: "10–15 min", rir: "confortável", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      fullC: {
        title: "Sexta • Full Body C • Glúteos + Costas + Braços",
        warmup: "Aquecimento: 5–8 min bike/esteira + séries preparatórias no primeiro exercício de perna e superior",
        total: "24 séries • ~55–65 min",
        exercises: [
          { id: "nathalia-fc-sumo", name: "Agachamento sumô com halter", note: "Glúteos e pernas com carga controlável", sets: "3", reps: "10–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "nathalia-fc-legpress-high", name: "Leg press 45° pés médios/altos", note: "Ênfase glúteo/posterior, sem perder contato lombar no banco", sets: "2", reps: "10–12", rir: "2", restLabel: "90 s", restSeconds: 90 },
          { id: "nathalia-fc-abductor", name: "Cadeira abdutora", note: "Glúteo médio, pausa curta na abertura", sets: "3", reps: "15–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "nathalia-fc-one-arm-row", name: "Remada unilateral com halter apoiada no banco", note: "Costas com apoio, reduzindo roubo da lombar", sets: "3", reps: "10–12 cada lado", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "nathalia-fc-incline-db", name: "Supino inclinado com halteres", note: "Peito superior sem crucifixo/crossover", sets: "2", reps: "8–10", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "nathalia-fc-lateral", name: "Elevação lateral", note: "Deltoide medial, controle total", sets: "2", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "nathalia-fc-scott", name: "Rosca Scott", note: "Bíceps com base estável", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60–75 s", restSeconds: 75 },
          { id: "nathalia-fc-triceps", name: "Tríceps pulley barra ou corda", note: "Tríceps base, cotovelos estáveis", sets: "3", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "nathalia-fc-crunch", name: "Abdominal na polia", note: "Core com carga progressiva, ajoelhada e coluna controlada", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      }
    }
  },
  pablo: {
    name: "Pablo",
    initials: "P",
    accent: "var(--blue)",
    title: "FitPlan",
    subtitle: "Upper/Lower 4x + cardio 2x • Recomposição • Base técnica e condicionamento • 08/2026",
    defaultTab: "upperA",
    tabs: [
      { key: "upperA", label: "Seg • Superior A", color: "var(--blue)" },
      { key: "lowerA", label: "Ter • Inferior A", color: "var(--green)" },
      { key: "upperB", label: "Qui • Superior B", color: "var(--violet)" },
      { key: "lowerB", label: "Sex • Inferior B", color: "var(--rose)" },
      { key: "cardio", label: "Sáb • Cardio", color: "var(--green)" }
    ],
    workouts: {
      upperA: {
        title: "Segunda • Superior A • Peito + Costas + Core",
        warmup: "Aquecimento: 5–8 min bike/esteira + 1–2 séries preparatórias no primeiro supino e na primeira puxada",
        total: "18 séries • ~55–65 min",
        exercises: [
          { id: "pablo-ua-chest", name: "Supino reto máquina ou halteres", note: "Peito base, execução controlada e sem pressa para carga", sets: "3", reps: "8–10", rir: "2", restLabel: "90 s", restSeconds: 90 },
          { id: "pablo-ua-pulldown", name: "Puxada alta frente pegada neutra ou aberta", note: "Costas/dorsais, peito alto e escápulas controladas", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "pablo-ua-row", name: "Remada baixa no cabo", note: "Costas horizontal, tronco estável", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "pablo-ua-incline", name: "Supino inclinado com halteres", note: "Peito superior, amplitude confortável", sets: "2", reps: "10–12", rir: "2", restLabel: "90 s", restSeconds: 90 },
          { id: "pablo-ua-facepull", name: "Face pull na corda", note: "Trapézio médio/baixo e estabilidade escapular", sets: "2", reps: "15–20", rir: "1–2", restLabel: "60 s", restSeconds: 60 },
          { id: "pablo-ua-shrug", name: "Encolhimento com halteres", note: "Trapézio, pausa curta no topo", sets: "2", reps: "12–15", rir: "1–2", restLabel: "60 s", restSeconds: 60 },
          { id: "pablo-ua-abs", name: "Abdominal máquina", note: "Core com carga progressiva na máquina", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      lowerA: {
        title: "Terça • Inferior A • Base de pernas + Bike",
        warmup: "Aquecimento: 5–8 min bike + séries preparatórias no leg press",
        total: "17 séries + bike • ~55–65 min",
        exercises: [
          { id: "pablo-la-legpress", name: "Leg press 45° ou horizontal", note: "Quadríceps principal sem agachamento livre/hack", sets: "3", reps: "10–12", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "pablo-la-ext", name: "Cadeira extensora", note: "Quadríceps isolado, controle na descida", sets: "3", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "pablo-la-curl", name: "Mesa flexora ou cadeira flexora", note: "Posterior de coxa sem stiff/RDL", sets: "3", reps: "10–12", rir: "0–1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "pablo-la-abductor", name: "Cadeira abdutora", note: "Glúteo médio e estabilidade de quadril", sets: "2", reps: "15–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "pablo-la-calf", name: "Panturrilha em pé ou no leg press", note: "Amplitude completa e pausa no topo", sets: "3", reps: "12–15", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "pablo-la-bike", name: "Bike leve/moderada", note: "Condicionamento, ritmo sustentável", sets: "1", reps: "20 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      upperB: {
        title: "Quinta • Superior B • Peito + Dorsais + Braços",
        warmup: "Aquecimento: 5–8 min bike/esteira + séries preparatórias no primeiro supino e na primeira remada",
        total: "20 séries • ~60–70 min",
        exercises: [
          { id: "pablo-ub-incline", name: "Supino inclinado máquina ou halteres", note: "Peito superior, progressão técnica", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "pablo-ub-row", name: "Remada unilateral máquina ou halter apoiado", note: "Costas com apoio, controle lado a lado", sets: "3", reps: "10–12 cada lado", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "pablo-ub-pulldown", name: "Puxada alta frente", note: "Dorsais, sem jogar tronco para trás", sets: "3", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "pablo-ub-fly", name: "Crucifixo máquina ou peck deck", note: "Peito isolado, amplitude confortável", sets: "2", reps: "12–15", rir: "1–2", restLabel: "60 s", restSeconds: 60 },
          { id: "pablo-ub-shoulder", name: "Desenvolvimento máquina ou halteres sentado", note: "Ombros com trajetória controlada", sets: "2", reps: "10–12", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "pablo-ub-curl", name: "Rosca direta ou rosca no cabo", note: "Bíceps base, sem balanço", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "pablo-ub-triceps", name: "Tríceps corda", note: "Cotovelos fixos, extensão completa", sets: "2", reps: "10–12", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "pablo-ub-abs", name: "Abdominal máquina", note: "Core com carga progressiva na máquina", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 }
        ]
      },
      lowerB: {
        title: "Sexta • Inferior B • Pernas + Core + Bike",
        warmup: "Aquecimento: 5–8 min bike + séries preparatórias no primeiro exercício de perna",
        total: "17 séries + bike • ~55–65 min",
        exercises: [
          { id: "pablo-lb-squat", name: "Agachamento no Smith ou goblet squat com halter", note: "Padrão de agachar sem agachamento livre", sets: "3", reps: "10–12", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "pablo-lb-legpress", name: "Leg press com pés um pouco mais altos", note: "Pernas com ênfase maior em glúteos, sem stiff/RDL", sets: "3", reps: "10–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "pablo-lb-curl", name: "Cadeira flexora", note: "Posterior de coxa direto e seguro", sets: "3", reps: "10–12", rir: "0–1", restLabel: "75–90 s", restSeconds: 90 },
          { id: "pablo-lb-adductor", name: "Cadeira adutora", note: "Adutores e estabilidade do quadril", sets: "2", reps: "15–20", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "pablo-lb-calf", name: "Panturrilha sentada", note: "Sóleo, amplitude completa", sets: "3", reps: "12–20", rir: "0–1", restLabel: "60 s", restSeconds: 60 },
          { id: "pablo-lb-abs", name: "Abdominal máquina", note: "Core com carga progressiva na máquina", sets: "3", reps: "12–15", rir: "0–1", restLabel: "45–60 s", restSeconds: 60 },
          { id: "pablo-lb-bike", name: "Bike leve/moderada", note: "Condicionamento, ritmo sustentável", sets: "1", reps: "20 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      cardio: {
        title: "Sábado • Cardio progressivo • Volta aos 5 km",
        warmup: "Aquecimento: 5 min caminhando antes de trotar",
        total: "25–35 min • Opcional/progressivo",
        exercises: [
          { id: "pablo-cardio-run", name: "Corrida/caminhada intervalada", note: "Comece com 2 min caminhando + 1 min trotando; aumente o trote ao longo das semanas", sets: "1", reps: "25–35 min", rir: "confortável", restLabel: "—", restSeconds: 0, trackWeight: false },
          { id: "pablo-cardio-mobility", name: "Mobilidade de quadril e torácica", note: "Compensa rotina sentada e ajuda postura para corrida/treino", sets: "1", reps: "5–8 min", rir: "leve", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      }
    }
  },
  igor: {
    name: "Igor",
    initials: "I",
    accent: "var(--violet)",
    title: "FitPlan",
    subtitle: "Upper/Lower 4x + cardio 2x • Perda de gordura preservando massa • Descanso qua/sáb/dom • 08/2026",
    defaultTab: "upperA",
    tabs: [
      { key: "upperA", label: "Seg • Superior A", color: "var(--blue)" },
      { key: "lowerA", label: "Ter • Inferior A", color: "var(--green)" },
      { key: "upperB", label: "Qui • Superior B", color: "var(--violet)" },
      { key: "lowerB", label: "Sex • Inferior B", color: "var(--rose)" }
    ],
    workouts: {
      upperA: {
        title: "Segunda • Superior A • Peito + Costas + Ombros e Braços",
        warmup: "Aquecimento: 5–8 min de esteira leve + 1–2 séries preparatórias no primeiro supino e na primeira remada",
        total: "17 séries + cardio • ~65–75 min",
        exercises: [
          { id: "igor-ua-chest", name: "Supino reto na máquina convergente", note: "Peito principal com trajetória estável e boa relação estímulo/fadiga", sets: "3", reps: "6–10", rir: "2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "igor-ua-row", name: "Remada máquina com peito apoiado", note: "Costas sem compensar com a lombar", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "igor-ua-incline", name: "Supino inclinado com halteres", note: "Peitoral superior, amplitude confortável e controlada", sets: "2", reps: "8–12", rir: "2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "igor-ua-pulldown", name: "Puxada alta pegada neutra", note: "Dorsais, peito alto e cotovelos conduzindo o movimento", sets: "2", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "igor-ua-lateral", name: "Elevação lateral na polia ou com halteres", note: "Escolha livre entre polia e halteres; mantenha controle e evite impulso", sets: "3", reps: "12–20", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-ua-triceps", name: "Tríceps na polia com corda", note: "Cotovelos estáveis e extensão completa", sets: "2", reps: "10–15", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-ua-curl", name: "Rosca direta com barra W", note: "Sem balanço do tronco, controle na descida", sets: "2", reps: "8–12", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-ua-cardio", name: "Esteira em ritmo moderado", note: "Ritmo em que ainda consiga falar frases curtas; não é necessário perseguir uma frequência cardíaca fixa", sets: "1", reps: "20–30 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      lowerA: {
        title: "Terça • Inferior A • Quadríceps + Posteriores",
        warmup: "Aquecimento: 5–8 min de bike/esteira + séries preparatórias no leg press; observe conforto e simetria do joelho direito",
        total: "17 séries • ~60–70 min",
        exercises: [
          { id: "igor-la-legpress", name: "Leg press 45°", note: "Base de quadríceps; não reduza a amplitude para aumentar a carga", sets: "3", reps: "8–12", rir: "2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "igor-la-extension", name: "Cadeira extensora unilateral", note: "Comece pela perna direita, use amplitude sem dor e registre a carga de cada lado", sets: "2", reps: "10–15 cada perna", rir: "2–3", restLabel: "60–90 s", restSeconds: 90 },
          { id: "igor-la-rdl", name: "RDL (stiff com joelhos levemente flexionados)", note: "Quadril para trás, barra próxima ao corpo e descida somente enquanto a coluna permanecer neutra", sets: "3", reps: "8–12", rir: "2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "igor-la-curl", name: "Mesa flexora", note: "Posterior de coxa pela flexão do joelho, sem tirar o quadril do apoio", sets: "3", reps: "10–15", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "igor-la-calf", name: "Panturrilha em pé", note: "Amplitude completa e pausa curta no topo", sets: "3", reps: "10–15", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-la-abs", name: "Abdominal na máquina", note: "Core com carga progressiva e movimento controlado", sets: "3", reps: "10–15", rir: "1–2", restLabel: "60 s", restSeconds: 60 }
        ]
      },
      upperB: {
        title: "Quinta • Superior B • Costas + Peito + Ombros e Braços",
        warmup: "Aquecimento: 5–8 min de esteira leve + 1–2 séries preparatórias na primeira puxada e no primeiro supino",
        total: "18 séries + cardio • ~70–80 min",
        exercises: [
          { id: "igor-ub-vertical-pull", name: "Puxada alta ou barra fixa assistida", note: "Escolha a variação que permita amplitude completa e progressão consistente", sets: "3", reps: "6–10", rir: "2", restLabel: "2 min", restSeconds: 120 },
          { id: "igor-ub-incline-machine", name: "Supino inclinado na máquina", note: "Peitoral superior com estabilidade e controle", sets: "3", reps: "8–12", rir: "1–2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "igor-ub-row", name: "Remada baixa na polia", note: "Tronco estável e ombros longe das orelhas", sets: "2", reps: "8–12", rir: "1–2", restLabel: "90 s", restSeconds: 90 },
          { id: "igor-ub-fly", name: "Peck deck ou crossover", note: "Peito isolado com amplitude confortável", sets: "2", reps: "10–15", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-ub-shoulder", name: "Desenvolvimento na máquina", note: "Trajetória guiada, sem travar os cotovelos", sets: "2", reps: "8–12", rir: "2", restLabel: "90 s", restSeconds: 90 },
          { id: "igor-ub-rear-delt", name: "Crucifixo inverso na máquina", note: "Deltoide posterior; peito apoiado e movimento sem impulso", sets: "2", reps: "12–20", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-ub-triceps", name: "Tríceps francês na polia", note: "Ênfase na cabeça longa, cotovelos apontados à frente", sets: "2", reps: "10–15", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-ub-curl", name: "Rosca martelo com halteres", note: "Bíceps, braquial e antebraços com execução estrita", sets: "2", reps: "10–15", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-ub-cardio", name: "Esteira em ritmo moderado", note: "Ritmo sustentável; reduza a intensidade se interferir no treino de pernas do dia seguinte", sets: "1", reps: "20–30 min", rir: "moderado", restLabel: "—", restSeconds: 0, trackWeight: false }
        ]
      },
      lowerB: {
        title: "Sexta • Inferior B • Quadríceps + Glúteos e Posteriores",
        warmup: "Aquecimento: 5–8 min de bike/esteira + séries preparatórias no hack/Smith; interrompa se houver dor, inchaço ou falseio",
        total: "16 séries • ~60–70 min",
        exercises: [
          { id: "igor-lb-squat", name: "Hack squat ou agachamento no Smith", note: "Escolha a máquina mais confortável para o joelho e mantenha a mesma técnica entre sessões", sets: "3", reps: "6–10", rir: "2", restLabel: "2–3 min", restSeconds: 180 },
          { id: "igor-lb-legpress-unilateral", name: "Leg press unilateral", note: "Comece pela perna direita; não force a mesma carga se a execução ou amplitude forem diferentes", sets: "2", reps: "10–15 cada perna", rir: "2–3", restLabel: "90–120 s", restSeconds: 120 },
          { id: "igor-lb-hipthrust", name: "Elevação pélvica", note: "Glúteos, pausa de 1 segundo no topo sem hiperestender a lombar", sets: "2", reps: "8–12", rir: "2", restLabel: "90–120 s", restSeconds: 120 },
          { id: "igor-lb-curl", name: "Cadeira flexora", note: "Posterior de coxa, descida controlada", sets: "3", reps: "10–15", rir: "1–2", restLabel: "75–90 s", restSeconds: 90 },
          { id: "igor-lb-calf", name: "Panturrilha sentada", note: "Amplitude completa e pausa curta no alongamento", sets: "3", reps: "12–20", rir: "1–2", restLabel: "60–75 s", restSeconds: 75 },
          { id: "igor-lb-abs", name: "Abdominal na máquina", note: "Core com carga progressiva e movimento controlado", sets: "3", reps: "10–15", rir: "1–2", restLabel: "60 s", restSeconds: 60 }
        ]
      }
    }
  }
};

