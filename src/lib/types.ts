import { z } from 'zod';

export const CodeReviewSchema = z.object({
  hasCriticalVulnerability: z.boolean().describe("True if any CRITICAL issue exists."),
  summary: z.string().describe("Concise summary of overall code security and health."),
  score: z.number().min(0).max(100).describe("Overall quality score out of 100."),
  issues: z.array(
    z.object({
      severity: z.enum(['CRITICAL', 'WARNING', 'INFO']),
      line: z.number().optional().describe("Line number where defect occurs."),
      title: z.string().describe("Short descriptive title of the issue."),
      description: z.string().describe("Detailed explanation of defect or vulnerability."),
      suggestion: z.string().describe("Recommended code fix or refactored snippet."),
    })
  ),
});

export type CodeReviewResult = z.infer<typeof CodeReviewSchema>;