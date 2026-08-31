---
description: "Turn a repeated workflow into a reusable .prompt.md for VS Code chat"
name: "Create Custom Prompt"
argument-hint: "Describe the repeated task, the inputs, and the desired output format"
agent: "agent"
---

Turn a repeatable task pattern into a reusable VS Code prompt file.

Follow this workflow:

1. Identify the core task being repeated
   - What does the user do over and over?
   - Is it code explanation, test generation, refactoring, code review, summarization, or another workflow?
   - What is the underlying repeatable pattern?

2. Extract the implicit inputs
   - Selected code or file type
   - Specific project context or framework
   - Relevant constraints, style rules, or output preferences
   - Whether the prompt should take arguments or rely on fixed context

3. Decide the scope
   - Use `.github/prompts/*.prompt.md` for workspace-shared prompts
   - Use `{{VSCODE_USER_PROMPTS_FOLDER}}/*.prompt.md` for personal, cross-workspace prompts

4. Draft the prompt file
   - Include valid YAML frontmatter with `description`, `name`, and optional `argument-hint`, `agent`, `model`, and `tools`
   - Keep the task narrowly focused and easy to reuse
   - Describe the expected output in clear, actionable language
   - Add explicit instructions for constraints, edge cases, and formatting

5. Check for ambiguity before finalizing
   - If the task is not clear enough, ask the user a short clarifying question
   - If multiple valid interpretations exist, choose the most useful default and explain it
   - Prefer one strong prompt over a broad or vague command

6. Finalize and summarize
   - State what the prompt does and when to use it
   - Provide example invocations or sample inputs
   - Suggest adjacent customizations that would be useful next, such as related prompt files or instructions

Important guidance:
- Favor reusable patterns over one-off commands.
- Keep each prompt focused on a single job.
- Use output examples when the structure matters.
- Prefer concise, practical instructions over long boilerplate.
- If the user’s task pattern is not yet clear, ask only the minimum needed to finish the prompt.

When you are done, provide:
- The final prompt content
- A short explanation of the chosen scope and naming
- Example usage patterns
- One or two related prompt ideas for follow-up
