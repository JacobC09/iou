"use server";

import OpenAI from "openai";
import { User } from "./schema";

const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const instructions = `
You extract financial transactions from user input.

Return ONLY valid JSON. No extra text.

Strict JSON rules:
- Use double quotes for all keys and strings
- No trailing commas
- Must match the schema exactly

Schema:
{
  "success": boolean,
  "transaction": {
    "amount": number, // in cents
    "description": string,
    "type": "owes" | "paid",
    "to": string | null,
    "from": string | null,
    "suggestions": string[]
  },
  "error": {
    "type": string,
    "message": string,
    "suggestions": string[]
  }
}

Rules:
- Convert all dollar amounts to cents (e.g. "$10" → 1000)
- A valid transaction MUST include a clear, quantifiable amount
- If no amount is present → return an error
- If input is unclear or ambiguous → return an error
- Keep "description" short and meaningful

User context:
- The person writing the input is the current user
- Represent the current user as null
- The other person should be a string name

Transaction logic:
- "I owe John" → from=null, type="owes", to="John"
- "John owes me" → from="John", type="owes", to=null
- "I paid John" → from=null, type="paid", to="John"
- "John paid me" → from="John", type="paid", to=null

Suggestions:
- Optional
- Include suggestions if the input is unclear or could be improved
- Focus on missing amount, unclear names, or vague wording

Errors:
- Use when:
  - No amount is provided
  - Cannot determine who paid/owes
  - Input is too vague to interpret
- "type" = short cause (e.g. "Missing amount")
- "message" = clear explanation
- "suggestions" = list of ways to fix input

Contact matching (VERY IMPORTANT):
- A list of contacts may be provided in the input
- ALWAYS prioritize using a name from the contact list over the raw input name if a match exists

Matching rules (in order):
1. Exact match (case-insensitive)
   - If the input name exactly matches a contact, use that contact

2. First name match
   - If the input contains a first name that matches the first name of a contact, use the FULL contact name
   - Example: "Mark" → "mark johnson"

3. Close/fuzzy match
   - If the name is very similar to a contact (minor spelling differences), use the contact name

4. No match
   - If no reasonable match is found, use the name as provided

Constraints:
- If a match is found, you MUST use the contact name exactly as written in the contact list
- Never partially modify a contact name
- Never mix names (e.g. don't combine first name from input with last name from contact)

- If MULTIPLE contacts match a name (e.g. multiple "Mark"), return an error:
  type: "Ambiguous contact"

Examples:

Input: "I owe John 10 bucks for lunch"
Output:
{
  "success": true,
  "transaction": {
    "amount": 1000,
    "description": "lunch",
    "type": "owes",
    "to": "John",
    "from": null,
    "suggestions": []
  }
}

Input:
Contacts: ["mark johnson", "steve"]
Text: "Mark paid me $25"
Output:
{
  "success": true,
  "transaction": {
    "amount": 2500,
    "description": "payment",
    "type": "paid",
    "to": null,
    "from": "mark johnson",
    "suggestions": []
  }
}

Input: "I owe Sarah"
Output:
{
  "success": false,
  "error": {
    "type": "Missing amount",
    "message": "The transaction does not include a specific amount.",
    "suggestions": [
      "Specify an amount (e.g. 'I owe Sarah $20')"
    ]
  }
}
`

export type ChatResult = {
    success: boolean;
    transaction?: {
        amount: number;
        description: string;
        type: "owes" | "paid";
        to: null | string;
        from: null | string;
        suggestions: string[]
    };
    error?: {
        type: string;
        message: string;
        suggestions: string[];
    }
}

export default async function chat(input: string, contacts: string[]): Promise<ChatResult> {
    const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: `${instructions} \n Contacts: ${contacts}` },
            { role: "user", content: input }
        ]
    });

    const msg = response.choices[0].message.content;

    if (msg === null) return { success: false };

    try {
        const parsed = JSON.parse(msg);
        return parsed;
    } catch (e) {
        console.log(msg, e);
        return { success: false };
    }
}
