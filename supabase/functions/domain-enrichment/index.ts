import { serve } from "http/server"
import { createClient } from "@supabase/supabase-js"

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

function parseNumericValue(value: any): number | null {
  if (value === null || value === undefined) return null;
  // Remove any commas and percentage signs from the string before parsing
  if (typeof value === 'string') {
    value = value.replace(/,/g, '').replace(/%/g, '');
  }
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

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

  let currentDomain: string | undefined;

  try {
    const body = await req.json()
    console.log('DEBUG - Raw webhook data:', JSON.stringify(body, null, 2))

    const domain = body.domain
    if (!domain) {
      throw new Error('No domain found in webhook data')
    }
    currentDomain = domain;

    // Extract data from clay_data
    const clayData = body.clay_data || {};
    
    // Extract SEMrush metrics with exact field names
    const semrushData = {
      traffic_rank: parseNumericValue(clayData['Traffic Rank SEMRush']),
      time_on_site: parseNumericValue(clayData['Avrege Time On Site SEMRush']),
      bounce_rate: parseNumericValue(clayData['Bounce Rate SEMRush']),
      mobile_bounce_rate: parseNumericValue(clayData['Mobile Bounce Rate SEMRush']),
      total_visits: parseNumericValue(clayData['Total Visits SEMRush']),
      paid_visits: parseNumericValue(clayData['Paid Visits SEMRush']),
      organic_visits: parseNumericValue(clayData['Organic Search Visits SEMRush']),
      direct_visits: parseNumericValue(clayData['Direct Visits SEMRush']),
      social_visits: parseNumericValue(clayData['Social Visits SEMRush']),
      mobile_traffic_share: parseNumericValue(clayData['Mobile Traffic Share SEMRush']),
      pages_per_visit: parseNumericValue(clayData['Average Pages Per Visit SEMRush'])
    };

    console.log('DEBUG - Extracted SEMrush Data:', semrushData);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // First update to mark as processing
    const { error: processingError } = await supabase
      .from('domain_audits')
      .update({
        enrichment_status: 'processing',
        updated_at: new Date().toISOString(),
        metadata: {
          lastAttempt: new Date().toISOString(),
          processingStarted: true
        }
      })
      .eq('domain', domain)

    if (processingError) {
      console.error('DEBUG - Error updating to processing status:', processingError)
      throw processingError
    }

    // Construct update object with all fields
    const updateData = {
      enrichment_status: 'completed',
      status: 'completed',
      updated_at: new Date().toISOString(),
      clay_data: clayData,
      
      // Company Info
      linkedin_url: clayData['Linkedin URL'],
      company_name: clayData['Company Name'],
      country: clayData['Country'],
      city_locality: clayData['City'],
      founded_year: parseNumericValue(clayData['Founded']),
      company_description: clayData['Description'],
      specialties: clayData['Specialties'],
      linkedin_follower_count: parseNumericValue(clayData['Follower Count']),
      
      // SEMRush Traffic Data
      semrush_traffic_rank: semrushData.traffic_rank,
      semrush_time_on_site: semrushData.time_on_site,
      semrush_bounce_rate: semrushData.bounce_rate,
      semrush_pages_per_visit: semrushData.pages_per_visit,
      semrush_total_visits: semrushData.total_visits,
      semrush_paid_visits: semrushData.paid_visits,
      semrush_organic_visits: semrushData.organic_visits,
      semrush_direct_visits: semrushData.direct_visits,
      semrush_social_visits: semrushData.social_visits,
      semrush_mobile_traffic_share: semrushData.mobile_traffic_share,
      semrush_mobile_bounce_rate: semrushData.mobile_bounce_rate,
      
      // Metadata update
      metadata: {
        lastAttempt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        processingCompleted: true,
        extractedData: {
          semrush: semrushData
        }
      }
    };

    // Log final update data
    console.log('DEBUG - Final Update Data:', {
      semrushMetrics: {
        traffic_rank: updateData.semrush_traffic_rank,
        time_on_site: updateData.semrush_time_on_site,
        mobile_bounce_rate: updateData.semrush_mobile_bounce_rate,
        total_visits: updateData.semrush_total_visits
      }
    });

    // Final update with enriched data
    const { data: updateResult, error: updateError } = await supabase
      .from('domain_audits')
      .update(updateData)
      .eq('domain', domain)
      .select('id, domain, status, enrichment_status, created_at, updated_at')

    if (updateError) {
      console.error('DEBUG - Database update error:', updateError)
      throw updateError
    }

    console.log('DEBUG - Update result:', JSON.stringify(updateResult, null, 2))

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
    console.error('DEBUG - Error processing webhook:', error)
    
    // Attempt to update status to failed
    if (error instanceof Error) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        await supabase
          .from('domain_audits')
          .update({
            enrichment_status: 'failed',
            status: 'failed',
            metadata: {
              lastError: error.message,
              errorTimestamp: new Date().toISOString(),
              processingFailed: true,
              errorStack: error.stack
            }
          })
          .eq('domain', currentDomain || '')
      } catch (updateError) {
        console.error('DEBUG - Failed to update error status:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        stack: error instanceof Error ? error.stack : undefined
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
