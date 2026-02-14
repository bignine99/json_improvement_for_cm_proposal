
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputData } from './types';

// 제안서 분류 체계 매핑
export const PROPOSAL_SECTION_MAP: Record<string, string> = {
  "1.1": "과업의 이해 및 주요 Issue 분석",
  "1.2": "사업부지 및 시설특성 분석",
  "1.3": "예상 문제점(Issues) 및 대책",
  "1.4": "건설사업관리 핵심목표와 전략 및 단계별 관리방안",
  "1.5": "기타(과업 이해 관련)",
  "2.1": "과업수행 Road Map 수립",
  "2.2": "설계관리계획",
  "2.3": "설계 특화방안 제시",
  "2.4": "사업비관리계획",
  "2.5": "우수시공자 선정 및 클레임 선제적 관리",
  "2.6": "기타(시공 전 단계)",
  "3.1": "공정관리계획",
  "3.2": "시공관리계획",
  "3.3": "품질관리계획",
  "3.4": "안전관리계획",
  "3.5": "환경관리계획",
  "3.6": "시운전 및 유지관리계획",
  "3.7": "기타(시공 단계)",
  "4.1": "업무수행지원체계 구축",
  "4.2": "보유기술 활용계획",
  "4.3": "기타(기술 활용)",
  "5.1": "CM조직구성 및 인원투입계획",
  "5.2": "성공적 과업완수를 위한 인력 활용방안",
  "5.3": "기타(인원 투입)"
};

export const SYSTEM_INSTRUCTION_MERGE = `
You are a World-Class CM (Construction Management) Proposal Architect specializing in Korean public construction projects.
Your task is to refine the provided JSON proposal draft into a high-impact, professional version.

[STRICT PRINCIPLES]
1. CORE CONTENT PRESERVATION (최우선 원칙):
   - You MUST maintain ALL keywords from the "contents" and "title" fields without exception.
   - Original ideas must be preserved and expanded, never replaced or deleted.
   - Enhanced text must contain every original term as a traceable anchor.

2. SECTION CONTEXT AWARENESS:
   - Use the "library_id" prefix (e.g., 1.1, 3.4) to understand the specific section context.
   - Match the tone and depth to the section type:
     * Section 1.x: 분석적이고 통찰력 있는 톤 (Analytical)
     * Section 2.x: 계획적이고 체계적인 톤 (Systematic)
     * Section 3.x: 기술적이고 실무적인 톤 (Technical)
     * Section 4.x: 혁신적이고 차별화된 톤 (Innovative)
     * Section 5.x: 조직적이고 신뢰감 있는 톤 (Organizational)

3. LOGICAL EXPANSION (논리적 보강):
   - Systematic(체계적): Transform simple list-style plans into process-oriented strategies (Input -> Process -> Output -> Feedback).
   - Concrete(구체적): Replace vague verbs with engineering actions.
     * BAD: "관리한다", "확인한다", "점검한다"
     * GOOD: "PMIS 기반 실시간 모니터링 시스템으로 일일 실적을 추적하고, 주간 보고서를 통해 이해관계자에게 공유한다"
   - Logical(논리적): Ensure outcomes are achievable and directly linked to the identified issues with clear cause-effect chains.
   - Rational(합리적): Provide evidence-based reasoning, referencing standards (KS, KCS, KDS) or proven methodologies where applicable.


4. CONTENT DENSITY REQUIREMENTS (최소 콘텐츠 기준):
   - "contents": Must be enhanced to at least 3 complete sentences with specific methods and tools.
   - "inferred_issues": Must identify at least 2 distinct risk factors with severity context.
   - "core_strategy": Must describe a multi-layered approach (at least 2 strategic pillars).
   - "tactical_differentiator": Must include at least 1 specific technology or methodology name.
   - "expected_outcome": Must include measurable or verifiable success indicators.
   - "visual_blueprint_vector": Must be preserved and enhanced. Describe the visual layout in English, improving clarity and adding structural detail.

5. KEY PRESERVATION (필드 보존 원칙 — 최우선):
   - The output "resolved_data" MUST contain EVERY key that exists in the input JSON, without exception.
   - Do NOT remove, rename, or omit any field. If the input has "visual_blueprint_vector", the output MUST also have "visual_blueprint_vector".
   - If the input has "project_meta", it MUST appear in the output exactly as-is or enhanced.
   - Rule: output keys = input keys (superset allowed, subset NEVER allowed).

6. LANGUAGE RULES:
   - ALL output text in "resolved_data" MUST be written in Korean (한국어).
   - EXCEPTION: "visual_blueprint_vector" should remain in English (it describes visual layout for rendering).
   - Use professional CM terminology naturally: BIM, VDC, VE, LCC, Risk Matrix, PMIS, CPM, EVM, etc.
   - Only use technical terms where they logically fit the original context.

[OUTPUT JSON STRUCTURE]
{
  "resolved_data": { ...ALL keys from input preserved, with enhanced values... },
  "latest_sentiment": "Positive" | "Neutral",
  "identified_intent": "A concise English label describing the enhancement type",
  "updates_applied": ["keyword optimization", "logical structuring", "technical terminology added", "content density increased"],
  "confidence_score": number (0.85-0.99, reflecting enhancement quality)
}

[CRITICAL VALIDATION]
Before outputting, verify:
✓ Every original keyword from "contents" appears in the enhanced version.
✓ Every key from the input JSON exists in "resolved_data" (especially visual_blueprint_vector).
✓ All "resolved_data" values are in Korean (except visual_blueprint_vector).
✓ Each field meets the minimum content density requirement.
✓ The logic chain flows: Issue → Strategy → Tactic → Outcome.
`;

export const generateInputData = (count: number): InputData[] => {
  const samples = [
    {
      library_id: "1.2_NUMAA_030",
      title: "사업부지 환경 분석",
      contents: "주변 교통망 분석, 소음 민원 예상, 지하 지장물 확인"
    },
    {
      library_id: "3.1_SCHED_001",
      title: "공정 관리 최적화",
      contents: "주간 공정회의, 지연 분석, 대책 수립, 인력 증원"
    },
    {
      library_id: "1.1_UNDER_005",
      title: "과업의 기술적 이해",
      contents: "문화재 조사 병행, 인근 노후 건물 계측 관리, 민원 대응 체계"
    }
  ];

  const data: InputData[] = [];
  for (let i = 0; i < count; i++) {
    const sample = samples[i % samples.length];
    data.push({
      id: "PROP-" + Math.random().toString(36).substring(7).toUpperCase(),
      customerRecord: {
        library_id: sample.library_id,
        project_meta: { project_name: "국립도시건축박물관", year: "2020.11", project_type: "문화집회시설" },
        title: sample.title,
        contents: sample.contents
      },
      chatTranscript: "User: 원본 내용을 유지하면서 전문가적인 시각으로 보강해줘.",
      timestamp: Date.now() + (i * 2000),
    });
  }
  return data;
};
