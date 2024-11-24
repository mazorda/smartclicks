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

  try {
    const body = await req.json()
    console.log('DEBUG - Raw webhook data:', JSON.stringify(body, null, 2))

    // Extract domain
    const domain = body.domain
    if (!domain) {
      throw new Error('No domain found in webhook data')
    }
    console.log('DEBUG - Domain:', domain)

    // Initialize update data
    const updateData: Record<string, any> = {
      enrichment_status: 'completed',
      updated_at: new Date().toISOString()
    }

    // Google Ads Health Score and Analysis
    if (body['Google Ads Analysis Health Score'] !== undefined) {
      const healthScore = parseNumericValue(body['Google Ads Analysis Health Score']);
      if (healthScore !== null) {
        updateData.r1_gads_health_score = healthScore;
      }
    }

    // Health Analysis Text - Explicit handling with type checking and trimming
    const healthAnalysis = body['Google Ads Analysis Health Analysis'];
    console.log('DEBUG - Raw Health Analysis Type:', typeof healthAnalysis);
    console.log('DEBUG - Raw Health Analysis Value:', healthAnalysis);
    
    if (healthAnalysis !== null && healthAnalysis !== undefined) {
      const analysisText = String(healthAnalysis).trim();
      if (analysisText.length > 0) {
        updateData.r1_health_score_analysis = analysisText;
        console.log('DEBUG - Processed Health Analysis:', analysisText);
      } else {
        console.log('DEBUG - Health Analysis was empty after processing');
      }
    } else {
      console.log('DEBUG - Health Analysis was null or undefined');
    }

    // Competitor Information
    const competitors = body['Get Competitors in Paid Search']?.competitors;
    if (competitors?.[0]) {
      updateData.r1_competitor_domain = competitors[0].domain;
      updateData.r1_competitor_gads_cost = parseNumericValue(competitors[0].monthlyAdwordsCostInUSD);
    }

    // Landing Pages
    if (body['Google Ads Analysis']?.landing_pages) {
      updateData.r1_landing_pages = body['Google Ads Analysis'].landing_pages;
    }

    // Domain Analysis
    if (body['Google Ads Analysis Findings']) {
      updateData.r1_analysis = body['Google Ads Analysis Findings'];
    }

    // Traffic Analytics
    const trafficAnalytics = body['Get Traffic Analytics']?.returnObject;
    if (trafficAnalytics) {
      updateData.r1_total_visits = parseNumericValue(trafficAnalytics.total_visits);
      updateData.r1_organic_visits = parseNumericValue(trafficAnalytics.visits?.organic_search_visits);
      updateData.r1_traffic_rank = parseNumericValue(trafficAnalytics.traffic_rank);
      updateData.r1_avg_time_on_site = parseNumericValue(trafficAnalytics.average_time_on_site);
    }

    // Paid Visits
    if (body['Paid Visits SEMRush'] !== undefined) {
      updateData.r1_paid_visits = parseNumericValue(body['Paid Visits SEMRush']);
    }

    // Bounce Rate
    if (body['Get website bounce rate']?.bounce_rate !== undefined) {
      updateData.r1_bounce_rate = parseNumericValue(body['Get website bounce rate'].bounce_rate);
    }

    // Company Information
    const companyInfo = body['Enrich Company'];
    if (companyInfo) {
      updateData.r1_company_size = companyInfo.size;
      updateData.r1_company_industry = companyInfo.industry;
      updateData.r1_company_logo_url = companyInfo.logo_url;
    }

    // Store the complete Clay response in clay_data
    updateData.clay_data = body;

    // Log the complete update data before database update
    console.log('DEBUG - Complete updateData:', JSON.stringify(updateData, null, 2));

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    // Single consolidated update
    const { data: updateResult, error: updateError } = await supabase
      .from('domain_audits')
      .update(updateData)
      .eq('domain', domain)
      .select()

    if (updateError) {
      console.error('DEBUG - Database update error:', updateError)
      throw updateError
    }

    // Verify the update result
    console.log('DEBUG - Update result:', JSON.stringify(updateResult, null, 2))
    if (updateResult?.[0]) {
      console.log('DEBUG - Health Analysis after update:', updateResult[0].r1_health_score_analysis)
    }

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
