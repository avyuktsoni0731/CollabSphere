import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Team, User, AITeammateMatch } from "./types";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function analyzeProjectIdea(
  ideaDescription: string,
  availableTeams: Team[],
  availableUsers: User[]
): Promise<{
  recommendedTeams: { team: Team; score: number; reasoning: string }[];
  suggestedTeammates: AITeammateMatch[];
  projectAnalysis: string;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Prepare context for AI
  const teamsContext = availableTeams.map((team) => ({
    id: team.id,
    name: team.name,
    description: team.description,
    idea: team.idea,
    requiredSkills: team.requiredSkills,
    currentSkills: team.currentSkills,
    category: team.category,
    stage: team.stage,
    tags: team.tags,
    members: team.members,
    maxMembers: team.maxMembers,
  }));

  const usersContext = availableUsers.map((user) => ({
    id: user.id,
    name: user.name,
    university: user.university,
    major: user.major,
    skills: user.skills,
    experience: user.experience,
    bio: user.bio,
    availability: user.availability,
    rating: user.rating,
  }));

  const prompt = `
You are an AI assistant for CollabSphere, a student collaboration platform. Analyze the following project idea and provide recommendations.

PROJECT IDEA:
"${ideaDescription}"

AVAILABLE TEAMS:
${JSON.stringify(teamsContext, null, 2)}

AVAILABLE USERS:
${JSON.stringify(usersContext, null, 2)}

Please provide a JSON response with the following structure:
{
  "projectAnalysis": "Brief analysis of the project idea, its potential, and key requirements",
  "recommendedTeams": [
    {
      "teamId": "team_id",
      "score": 85,
      "reasoning": "Why this team is a good match"
    }
  ],
  "suggestedTeammates": [
    {
      "userId": "user_id",
      "matchScore": 92,
      "reasoning": "Why this person would be a great teammate",
      "commonInterests": ["AI", "Web Development"]
    }
  ],
  "requiredSkills": ["skill1", "skill2"],
  "projectCategory": "category",
  "estimatedDuration": "duration",
  "difficultyLevel": "beginner/intermediate/advanced"
}

Focus on:
1. Skill compatibility and complementarity
2. Project stage alignment
3. Availability and commitment levels
4. University/location proximity when relevant
5. Experience levels that match project complexity

Provide realistic scores (60-95 range) and detailed reasoning for each recommendation.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const aiResponse = JSON.parse(jsonMatch[0]);

    // Map the AI response to our types
    const recommendedTeams =
      aiResponse.recommendedTeams
        ?.map((rec: any) => {
          const team = availableTeams.find((t) => t.id === rec.teamId);
          return team
            ? {
                team,
                score: rec.score,
                reasoning: rec.reasoning,
              }
            : null;
        })
        .filter(Boolean) || [];

    const suggestedTeammates =
      aiResponse.suggestedTeammates
        ?.map((sug: any) => {
          const user = availableUsers.find((u) => u.id === sug.userId);
          return user
            ? {
                user,
                matchScore: sug.matchScore,
                commonInterests: sug.commonInterests || [],
                reasoning: sug.reasoning,
              }
            : null;
        })
        .filter(Boolean) || [];

    return {
      recommendedTeams,
      suggestedTeammates,
      projectAnalysis:
        aiResponse.projectAnalysis || "Project analysis not available.",
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Fallback response
    return {
      recommendedTeams: [],
      suggestedTeammates: [],
      projectAnalysis:
        "Unable to analyze project at this time. Please try again later.",
    };
  }
}

export async function extractSkillsFromDescription(
  description: string
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Extract the key technical skills, technologies, and domains mentioned in this project description:

"${description}"

Return only a JSON array of skills/technologies mentioned or implied, like:
["React", "Node.js", "Machine Learning", "UI/UX Design", "Python"]

Focus on:
- Programming languages
- Frameworks and libraries
- Technical domains (AI, Web Dev, Mobile, etc.)
- Design skills
- Data science/analytics tools
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error("Error extracting skills:", error);
    return [];
  }
}
