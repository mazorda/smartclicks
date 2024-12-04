import { serve } from "http/server"
import { createClient } from "@supabase/supabase-js"

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

interface EnrichmentError extends Error {
  domain?: string;
}

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

  let currentDomain: string | undefined;

  try {
    const body = await req.json()
    console.log('DEBUG - Raw webhook data:', JSON.stringify(body, null, 2))

    // Extract domain
    const domain = body.domain
    if (!domain) {
      throw new Error('No domain found in webhook data')
    }
    currentDomain = domain;

    // Debug logging for field extraction
    console.log('DEBUG - Field Extraction:', {
      allKeys: Object.keys(body),
      topLevelFields: Object.keys(body).filter(key => typeof body[key] === 'object')
    })

    // Extract company info
    const linkedinData = extractValue(body, [
      'LinkedIn Company Profile',
      'linkedin_data',
      'company_profile'
    ]) || {};

    // Extract SEMRush data
    const semrushData = extractValue(body, [
      'SEMRush Analytics',
      'semrush_data',
      'traffic_analytics'
    ]) || {};

    // Extract competitor data
    const competitors = extractValue(body, [
      'Get Competitors in Paid Search.competitors',
      'competitors',
      'competitor_analysis'
    ]) || [];

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
      clay_data: body,
      
      // Company Info from LinkedIn
      linkedin_url: extractValue(body, ['linkedin_url', 'company_linkedin_url']),
      company_name: extractValue(body, ['company_name', 'name', 'LinkedIn Company Profile.name']),
      country: extractValue(body, ['country', 'headquarters_country', 'LinkedIn Company Profile.country']),
      city_locality: extractValue(body, ['city_locality', 'headquarters_locality', 'LinkedIn Company Profile.locality']),
      founded_year: parseNumericValue(extractValue(body, ['founded_year', 'year_founded', 'LinkedIn Company Profile.founded'])),
      company_description: extractValue(body, ['description', 'company_description', 'LinkedIn Company Profile.description']),
      specialties: extractValue(body, ['specialties', 'tags', 'LinkedIn Company Profile.specialties']),
      linkedin_follower_count: parseNumericValue(extractValue(body, ['follower_count', 'linkedin_followers', 'LinkedIn Company Profile.followerCount'])),
      
      // Competitor Data
      competitor_1_domain: competitors[0]?.domain || null,
      competitor_1_monthly_gads_traffic: parseNumericValue(competitors[0]?.monthlyTraffic),
      competitor_1_monthly_adwords_cost: parseNumericValue(competitors[0]?.monthlyAdwordsCostInUSD),
      competitor_2_domain: competitors[1]?.domain || null,
      competitor_2_monthly_gads_traffic: parseNumericValue(competitors[1]?.monthlyTraffic),
      competitor_2_monthly_adwords_cost: parseNumericValue(competitors[1]?.monthlyAdwordsCostInUSD),
      
      // SEMRush Traffic Data
      semrush_total_visits: parseNumericValue(extractValue(body, ['total_visits', 'SEMRush Analytics.total_visits'])),
      semrush_traffic_rank: parseNumericValue(extractValue(body, ['traffic_rank', 'SEMRush Analytics.traffic_rank'])),
      semrush_bounce_rate: parseNumericValue(extractValue(body, ['bounce_rate', 'SEMRush Analytics.bounce_rate'])),
      semrush_pages_per_visit: parseNumericValue(extractValue(body, ['pages_per_visit', 'SEMRush Analytics.pages_per_visit'])),
      semrush_time_on_site: parseNumericValue(extractValue(body, ['time_on_site', 'SEMRush Analytics.time_on_site'])),
      semrush_paid_visits: parseNumericValue(extractValue(body, ['paid_visits', 'SEMRush Analytics.paid_visits'])),
      semrush_organic_visits: parseNumericValue(extractValue(body, ['organic_visits', 'SEMRush Analytics.organic_visits'])),
      semrush_direct_visits: parseNumericValue(extractValue(body, ['direct_visits', 'SEMRush Analytics.direct_visits'])),
      semrush_social_visits: parseNumericValue(extractValue(body, ['social_visits', 'SEMRush Analytics.social_visits'])),
      semrush_mobile_traffic_share: parseNumericValue(extractValue(body, ['mobile_traffic_share', 'SEMRush Analytics.mobile_traffic_share'])),
      semrush_mobile_bounce_rate: parseNumericValue(extractValue(body, ['mobile_bounce_rate', 'SEMRush Analytics.mobile_bounce_rate'])),
      
      // SimilarWeb Data
      similarweb_visits: parseNumericValue(extractValue(body, ['similarweb_visits', 'SimilarWeb.total_visits'])),

      // Legacy fields maintained for backward compatibility
      r1_health_score_analysis: extractValue(body, [
        'r1_healthscore_analysis',
        'Google Ads Analysis Health Analysis',
        'healthscore_analysis'
      ]),
      r1_gads_health_score: parseNumericValue(extractValue(body, [
        'Google Ads Analysis Health Score',
        'health_score'
      ])),
      r1_analysis: extractValue(body, [
        'Google Ads Analysis Findings',
        'findings',
        'analysis'
      ]),
      r1_landing_pages: extractValue(body, [
        'Google Ads Analysis.landing_pages',
        'landing_pages',
        'r1_landing_pages'
      ]),
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
      r1_company_size: extractValue(body, [
        'Enrich Company.size',
        'company_size',
        'size'
      ]),
      r1_company_industry: extractValue(body, [
        'Enrich Company.industry',
        'company_industry',
        'industry'
      ]),
      r1_company_logo_url: extractValue(body, [
        'Enrich Company.logo_url',
        'company_logo_url',
        'logo_url'
      ]),
      r1_competitor_domain: competitors[0]?.domain,
      r1_competitor_gads_cost: parseNumericValue(competitors[0]?.monthlyAdwordsCostInUSD),

      // Metadata update
      metadata: {
        lastAttempt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        processingCompleted: true
      }
    };

    console.log('DEBUG - Extracted Fields:', {
      companyInfo: {
        name: updateData.company_name,
        linkedinUrl: updateData.linkedin_url,
        country: updateData.country,
        cityLocality: updateData.city_locality,
        foundedYear: updateData.founded_year,
        followerCount: updateData.linkedin_follower_count
      },
      competitors: {
        competitor1: {
          domain: updateData.competitor_1_domain,
          traffic: updateData.competitor_1_monthly_gads_traffic,
          cost: updateData.competitor_1_monthly_adwords_cost
        },
        competitor2: {
          domain: updateData.competitor_2_domain,
          traffic: updateData.competitor_2_monthly_gads_traffic,
          cost: updateData.competitor_2_monthly_adwords_cost
        }
      },
      trafficMetrics: {
        totalVisits: updateData.semrush_total_visits,
        trafficRank: updateData.semrush_traffic_rank,
        bounceRate: updateData.semrush_bounce_rate,
        pagesPerVisit: updateData.semrush_pages_per_visit,
        timeOnSite: updateData.semrush_time_on_site,
        mobileShare: updateData.semrush_mobile_traffic_share
      }
    });

    // Final update with enriched data
    const { data: updateResult, error: updateError } = await supabase
      .from('domain_audits')
      .update(updateData)
      .eq('domain', domain)
      .select()

    if (updateError) {
      console.error('DEBUG - Database update error:', updateError)
      
      // Update status to failed
      await supabase
        .from('domain_audits')
        .update({
          enrichment_status: 'failed',
          status: 'failed',
          metadata: {
            lastError: updateError.message,
            errorTimestamp: new Date().toISOString(),
            processingFailed: true
          }
        })
        .eq('domain', domain)
      
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
