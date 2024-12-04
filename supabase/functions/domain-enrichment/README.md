# Domain Enrichment Function

This Edge Function handles webhooks from Clay.com to enrich domain data.

## Data Flow

1. User submits domain for analysis
2. Clay processes the domain and sends data to this webhook
3. Data is stored in domain_audits table:
   - Raw data in clay_data JSONB column
   - Extracted fields in dedicated columns via trigger

## Clay Data Structure

Clay sends data with capitalized field names:
```json
{
  "Size": "11-50 employees",
  "domain": "example.com",
  "Country": "US",
  "Founded": "2010",
  "Industry": "Technology",
  "Description": "Company description...",
  "Specialties": "Field1, Field2",
  "Linkedin Url": "https://linkedin.com/...",
  "City Locality": "City, State"
}
```

## Database Trigger

A PostgreSQL trigger (extract_clay_data) automatically extracts fields from clay_data:
- Handles both lowercase and uppercase field names
- Properly types numeric and integer fields
- Extracts nested data (SEMRush, competitors)

## Monitoring

View webhook activity:
1. Supabase Dashboard > Edge Functions
2. Select 'domain-enrichment'
3. Check Logs tab for incoming webhooks
4. Raw Clay data is preserved in clay_data column
