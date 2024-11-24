# Domain Enrichment Function

This Edge Function handles domain data enrichment through a secure, private API endpoint.

## Setup

1. Deploy the Edge Function to Supabase:
```bash
supabase functions deploy domain-enrichment
```

2. Set the following environment variables in Supabase:
```bash
supabase secrets set ENRICHMENT_API_KEY=your_api_key
supabase secrets set ENRICHMENT_API_URL=your_api_url
```

## Environment Variables

- `ENRICHMENT_API_KEY`: API key for the enrichment service
- `ENRICHMENT_API_URL`: Base URL for the enrichment API
- `SUPABASE_URL`: Automatically provided by Supabase
- `SUPABASE_ANON_KEY`: Automatically provided by Supabase

## Usage

The function is called automatically by the domain audit service when:
1. A new domain audit is created
2. Checking enrichment status

The function handles:
- Initial enrichment requests
- Status checks
- Updating the database with enriched data

## Security

- All API keys and sensitive data are stored as environment variables
- The function runs in a secure, isolated environment
- No external service details are exposed in the client-side code
