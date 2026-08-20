export interface CriteriaDefinition {
  id: string;
  name: string;
  maxScore: number;
  weight: number;
}

export interface RawScore {
  projectId: string;
  judgeId: string;
  criteriaId: string;
  score: number;
  feedback?: string | null;
  judge?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface ProjectScoreSummary {
  projectId: string;
  totalScore: number; // 0 - 100 scale
  rawScoreAvg: number;
  judgeCount: number;
  criteriaScores: Record<string, { average: number; weight: number; maxScore: number; name: string }>;
  judgeFeedbacks: Array<{ judgeName: string; feedback: string }>;
}

export function calculateProjectScore(
  scores: RawScore[],
  criteria: CriteriaDefinition[]
): { totalScore: number; judgeCount: number; criteriaBreakdown: Record<string, number> } {
  if (!scores.length || !criteria.length) {
    return { totalScore: 0, judgeCount: 0, criteriaBreakdown: {} };
  }

  // Group scores by judge
  const scoresByJudge: Record<string, Record<string, number>> = {};
  scores.forEach((s) => {
    if (!scoresByJudge[s.judgeId]) {
      scoresByJudge[s.judgeId] = {};
    }
    scoresByJudge[s.judgeId][s.criteriaId] = s.score;
  });

  const judgeIds = Object.keys(scoresByJudge);
  if (judgeIds.length === 0) {
    return { totalScore: 0, judgeCount: 0, criteriaBreakdown: {} };
  }

  const totalCriteriaWeight = criteria.reduce((sum, c) => sum + (c.weight || 1), 0);
  const criteriaBreakdown: Record<string, number> = {};

  // Calculate each judge's weighted score (0 - 100)
  const judgeScores: number[] = [];
  judgeIds.forEach((jId) => {
    const jScores = scoresByJudge[jId];
    let weightedSum = 0;

    criteria.forEach((c) => {
      const raw = jScores[c.id] ?? 0;
      const normalized = (raw / (c.maxScore || 10)) * 100;
      weightedSum += normalized * (c.weight || 1);
    });

    const judgeNormalizedTotal = totalCriteriaWeight > 0 ? weightedSum / totalCriteriaWeight : 0;
    judgeScores.push(judgeNormalizedTotal);
  });

  // Calculate criteria averages across judges
  criteria.forEach((c) => {
    let sum = 0;
    let count = 0;
    scores.forEach((s) => {
      if (s.criteriaId === c.id) {
        sum += s.score;
        count++;
      }
    });
    criteriaBreakdown[c.id] = count > 0 ? Number((sum / count).toFixed(2)) : 0;
  });

  const totalScore = Number((judgeScores.reduce((a, b) => a + b, 0) / judgeScores.length).toFixed(2));

  return {
    totalScore,
    judgeCount: judgeIds.length,
    criteriaBreakdown,
  };
}

export function rankProjects<T extends { id: string; scores?: RawScore[] }>(
  projects: T[],
  criteria: CriteriaDefinition[]
): Array<T & { finalScore: number; rank: number; judgeCount: number }> {
  const scored = projects.map((p) => {
    const { totalScore, judgeCount } = calculateProjectScore(p.scores || [], criteria);
    return {
      ...p,
      finalScore: totalScore,
      judgeCount,
      rank: 0,
    };
  });

  // Sort descending by score, tie-breaker: more judges, or earlier creation
  scored.sort((a, b) => {
    if (b.finalScore !== a.finalScore) {
      return b.finalScore - a.finalScore;
    }
    return b.judgeCount - a.judgeCount;
  });

  // Assign ranks
  scored.forEach((item, index) => {
    item.rank = index + 1;
  });

  return scored;
}
