// Simple in-memory scan counter (resets on cold starts)
let scanCount = 0;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting: Only if MAX_SCANS env variable is set (configure in Vercel)
  const maxScans = process.env.MAX_SCANS ? parseInt(process.env.MAX_SCANS) : null;

  if (maxScans) {
    scanCount++;
    console.log(`Scan count: ${scanCount}/${maxScans}`);

    if (scanCount > maxScans) {
      return res.status(429).json({
        error: 'Scan limit reached',
        message: 'This demo has reached its maximum number of scans. Thank you for trying Ramen Pirate!'
      });
    }
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const prompt = `Analyze this ramen nutrition label and extract the following information:
1. Salt/Sodium content (in mg)
2. Allergens (list all allergens found)
3. Additives (count the total number of food additives/E-numbers)
4. Spice level (estimate: low, moderate, high, very high)
5. Calculate a 'Pirate Level' score from 0-5 using this RAMEN-SPECIFIC rubric:
   (Note: Average instant ramen contains ~1700mg sodium)
   - 5: <1000mg sodium, natural ingredients, minimal allergens (healthy ramen options)
   - 4: 1000-1400mg sodium, few additives, some allergens (below average)
   - 3: 1400-2000mg sodium, standard additives, common allergens (typical instant ramen)
   - 2: 2000-2500mg sodium, concerning additives (MSG, artificial colors), many allergens (above average)
   - 1: 2500-3000mg sodium, many harmful additives, severe allergen concerns (very unhealthy)
   - 0: >3000mg sodium (130%+ daily value), toxic additive levels (extreme/dangerous)

Then provide a 1-2 sentence cautionary summary that:
- Warns about sodium levels with % of daily value (daily limit = 2300mg)
- Mentions additive count and EXPLAINS what the most concerning additives are (with E-numbers) and their potential health effects
- Mentions specific allergen warnings
- Notes spice level if relevant

Return as JSON with this exact structure:
{
  "sodium": "1850 mg",
  "allergens": "wheat, soy",
  "additives": "3",
  "spiceLevel": "high",
  "pirateLevel": 3,
  "summary": "Your cautionary summary here..."
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return res.status(response.status).json({ error: 'OpenAI API error', details: error });
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Parse the JSON response from OpenAI
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      // If OpenAI returns markdown code blocks, extract JSON
      const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse OpenAI response');
      }
    }

    return res.status(200).json(parsedResult);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to analyze image', details: error.message });
  }
}
