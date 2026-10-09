export const quizQuestions = [
  {
    id: "strategy",
    topic: "Náklady a strategie",
    anchor: "#cl-comparison",
    question: "Znamená stejná nákladovost VOO a VTI také stejnou strategii?",
    options: [
      { id: "yes", text: "Ano, fondy se stejnými náklady investují stejně." },
      { id: "no", text: "Ne, liší se tím, jakou část trhu pokrývají." },
    ],
    correctId: "no",
    explanation:
      "VOO se soustředí na velké americké společnosti. VTI pokrývá i menší firmy. Stejná roční nákladovost neznamená stejné zaměření.",
    sourceIds: ["voo-factsheet", "vti-factsheet", "vti-name-supplement"],
  },
  {
    id: "costs",
    topic: "Celkové náklady",
    anchor: "#cl-calculator",
    question: "Zahrnuje roční nákladovost fondu i poplatky vašeho brokera?",
    options: [
      { id: "yes", text: "Ano, zahrnuje všechny náklady investora." },
      {
        id: "no",
        text: "Ne, broker, směna měny a další náklady se posuzují zvlášť.",
      },
    ],
    correctId: "no",
    explanation:
      "Nákladovost popisuje náklad fondu. Nezahrnuje vaše poplatky brokera, spread, směnu měny ani daně. Proto kalkulačka ukazuje jen jednu část nákladů.",
    sourceIds: ["voo-factsheet", "vti-factsheet", "schd-profile"],
  },
  {
    id: "risk",
    topic: "Šíře trhu a riziko",
    anchor: "#cl-context",
    question: "Zaručuje širší pokrytí trhu u VTI vyšší výnos?",
    options: [
      { id: "no", text: "Ne, širší pokrytí trhu nezaručuje vyšší výnos." },
      {
        id: "yes",
        text: "Ano, více společností automaticky znamená vyšší výnos.",
      },
    ],
    correctId: "no",
    explanation:
      "Širší pokrytí popisuje složení fondu, nikoliv budoucí výnos. Akciové ETF může ztratit hodnotu; při porovnání záleží také na riziku a měně.",
    sourceIds: ["vti-factsheet"],
  },
] as const;

export type QuizAnswers = Record<string, string>;
export function summarizeQuiz(answers: QuizAnswers) {
  const correct = quizQuestions.filter((q) => answers[q.id] === q.correctId);
  return {
    score: correct.length,
    complete: quizQuestions.every((q) =>
      q.options.some((option) => option.id === answers[q.id]),
    ),
    review: quizQuestions.filter((q) => answers[q.id] !== q.correctId),
  };
}
