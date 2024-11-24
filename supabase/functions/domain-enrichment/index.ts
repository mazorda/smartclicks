import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    })
  }

  try {
    const body = await req.json()
    console.log('Received webhook data:', JSON.stringify(body, null, 2))

    // Extract domain - try different possible field names
    const domain = body.domain || body.Domain || body['Company Domain']
    if (!domain) {
      throw new Error('No domain found in webhook data')
    }

    // Initialize update data
    const updateData: Record<string, any> = {
      enrichment_status: 'completed',
      updated_at: new Date().toISOString()
    }

    // Map incoming data to our fields, checking various possible field names
    const fieldMappings = {
      r1_gads_health_score: ['health_score', 'score', 'Google Ads Analysis Health Score'],
      r1_health_score_analysis: ['health_score_analysis', 'analysis', 'Google Ads Analysis Score Justification'],
      r1_landing_pages: ['landing_pages', 'Google Ads Analysis Landing Pages'],
      r1_analysis: ['analysis', 'findings', 'Google Ads Analysis Findings'],
      r1_bounce_rate: ['bounce_rate'],
      r1_traffic_rank: ['traffic_rank'],
      r1_avg_time_on_site: ['avg_time_on_site', 'average_time_on_site'],
      r1_total_visits: ['total_visits', 'visits']
    }

    // Try to find values using different possible field names
    for (const [dbField, possibleNames] of Object.entries(fieldMappings)) {
      for (const name of possibleNames) {
        const value = body[name] || (body.data && body.data[name])
        if (value !== undefined) {
          updateData[dbField] = value
          break
        }
      }
    }

    console.log('Updating domain audit with data:', JSON.stringify(updateData, null, 2))

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const { data: updateResult, error: updateError } = await supabase
      .from('domain_audits')
      .update(updateData)
      .eq('domain', domain)
      .select()

    if (updateError) {
      console.error('Database update error:', updateError)
      throw updateError
    }

    console.log('Update successful:', JSON.stringify(updateResult, null, 2))

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Domain audit updated successfully',
        data: updateResult
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        stack: error.stack
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
