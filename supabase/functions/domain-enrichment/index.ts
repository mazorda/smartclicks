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

function extractValue(obj: any, paths: string[]): any {
  for (const path of paths) {
    const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return null;
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

    // Debug logging for field extraction
    console.log('DEBUG - Field Extraction:', {
      allKeys: Object.keys(body),
      topLevelFields: Object.keys(body).filter(key => typeof body[key] === 'object')
    })

    // Extract health analysis with fallback options
    const healthAnalysis = extractValue(body, [
      'r1_healthscore_analysis',
      'Google Ads Analysis Health Analysis',
      'healthscore_analysis'
    ]);

    // Extract landing pages with fallback options
    const landingPages = extractValue(body, [
      'Google Ads Analysis.landing_pages',
      'landing_pages',
      'r1_landing_pages'
    ]);

    // Extract company info with fallback options
    const companySize = extractValue(body, [
      'Enrich Company.size',
      'company_size',
      'size'
    ]);

    const companyIndustry = extractValue(body, [
      'Enrich Company.industry',
      'company_industry',
      'industry'
    ]);

    const companyLogoUrl = extractValue(body, [
      'Enrich Company.logo_url',
      'company_logo_url',
      'logo_url'
    ]);

    // Extract competitor info with fallback options
    const competitors = extractValue(body, [
      'Get Competitors in Paid Search.competitors',
      'competitors'
    ]);

    const competitorInfo = competitors?.[0] || {};

    // Construct update object with all fields
    const updateData = {
      enrichment_status: 'completed',
      updated_at: new Date().toISOString(),
      clay_data: body,
      
      // Health Analysis
      r1_health_score_analysis: healthAnalysis,
      r1_gads_health_score: parseNumericValue(extractValue(body, [
        'Google Ads Analysis Health Score',
        'health_score'
      ])),
      
      // Analysis and Landing Pages
      r1_analysis: extractValue(body, [
        'Google Ads Analysis Findings',
        'findings',
        'analysis'
      ]),
      r1_landing_pages: landingPages,
      
      // Traffic Metrics
      r1_bounce_rate: parseNumericValue(extractValue(body, [
        'Get website bounce rate.bounce_rate',
        'bounce_rate'
      ])),
      r1_traffic_rank: parseNumericValue(extractValue(body, [
        'Get Traffic Analytics.returnObject.traffic_rank',
        'traffic_rank'
      ])),
      r1_avg_time_on_site: parseNumericValue(extractValue(body, [
        'Get Traffic Analytics.returnObject.average_time_on_site',
        'average_time_on_site'
      ])),
      r1_total_visits: parseNumericValue(extractValue(body, [
        'Get Traffic Analytics.returnObject.total_visits',
        'total_visits'
      ])),
      r1_organic_visits: parseNumericValue(extractValue(body, [
        'Get Traffic Analytics.returnObject.visits.organic_search_visits',
        'search_visits',
        'organic_visits'
      ])),
      r1_paid_visits: parseNumericValue(extractValue(body, [
        'Paid Visits SEMRush',
        'paid_visits'
      ])),
      
      // Company Info
      r1_company_size: companySize,
      r1_company_industry: companyIndustry,
      r1_company_logo_url: companyLogoUrl,
      
      // Competitor Info
      r1_competitor_domain: competitorInfo.domain,
      r1_competitor_gads_cost: parseNumericValue(competitorInfo.monthlyAdwordsCostInUSD)
    };

    console.log('DEBUG - Extracted Fields:', {
      healthAnalysis: {
        value: healthAnalysis,
        type: typeof healthAnalysis
      },
      landingPages: {
        value: landingPages,
        type: typeof landingPages
      },
      metrics: {
        bounceRate: updateData.r1_bounce_rate,
        trafficRank: updateData.r1_traffic_rank,
        avgTimeOnSite: updateData.r1_avg_time_on_site,
        totalVisits: updateData.r1_total_visits,
        organicVisits: updateData.r1_organic_visits,
        paidVisits: updateData.r1_paid_visits
      },
      companyInfo: {
        size: companySize,
        industry: companyIndustry,
        logoUrl: companyLogoUrl
      },
      competitorInfo: {
        domain: competitorInfo.domain,
        gadsCost: competitorInfo.monthlyAdwordsCostInUSD
      }
    });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    // Single update operation
    const { data: updateResult, error: updateError } = await supabase
      .from('domain_audits')
      .update(updateData)
      .eq('domain', domain)
      .select()

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
