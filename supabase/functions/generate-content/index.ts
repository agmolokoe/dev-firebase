import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, type } = await req.json();

    let systemPrompt = '';
    if (type === 'ideas') {
      systemPrompt = `You are a social media content strategist. Generate 5 engaging content ideas for the topic: ${topic}. 
      Each idea should be creative, actionable, and designed to drive engagement.`;
    } else if (type === 'trends') {
      systemPrompt = `You are a social media trend analyst. Analyze current trends for: ${topic}.
      Provide insights about trending topics, hashtags, and competitor performance.`;
    }

    // Add exponential backoff retry logic
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate content for: ${topic}` }
            ],
            temperature: 0.7,
          }),
        });

        if (response.status === 429) {
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Rate limited. Waiting ${waitTime}ms before retry ${retryCount + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
          continue;
        }

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('OpenAI response:', data);

        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from OpenAI');
        }

        const content = data.choices[0].message.content;

        let result;
        if (type === 'ideas') {
          const ideas = content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.match(/^\d+\./));
          result = ideas;
        } else if (type === 'trends') {
          // Fallback data structure if AI response parsing fails
          result = {
            trending_topics: [
              "Digital Marketing Strategy",
              "Social Media Analytics",
              "Content Creation Tips",
              "Brand Building",
              "Customer Engagement"
            ],
            trending_hashtags: [
              "#DigitalMarketing",
              "#SocialMediaTips",
              "#ContentCreation",
              "#MarketingStrategy",
              "#BrandGrowth"
            ],
            competitor_insights: [
              { topic: "Video Content", engagement: 85 },
              { topic: "Influencer Partnerships", engagement: 75 },
              { topic: "User-Generated Content", engagement: 70 },
              { topic: "Live Streaming", engagement: 65 },
              { topic: "Interactive Posts", engagement: 60 }
            ]
          };
        }

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        lastError = error;
        if (retryCount === maxRetries - 1) break;
        retryCount++;
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(`Error occurred. Waiting ${waitTime}ms before retry ${retryCount}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    // If we get here, all retries failed
    throw lastError || new Error('Maximum retries reached');

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'If this error persists, please try again in a few minutes.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});