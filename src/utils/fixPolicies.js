import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixDomainAuditPolicies() {
  try {
    console.log('Starting policy update...');

    // Drop existing policies
    const dropPolicies = [
      'dev_anon_insert_policy',
      'dev_anon_select_policy',
      'dev_auth_all_policy',
      'anon_insert_policy',
      'anon_select_policy',
      'anon_update_policy',
      'auth_all_policy'
    ];

    for (const policy of dropPolicies) {
      const { error } = await supabase.rpc('drop_policy_if_exists', {
        policy_name: policy,
        table_name: 'domain_audits'
      });
      
      if (error) {
        console.warn(`Warning dropping policy ${policy}:`, error.message);
      }
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('enable_rls', {
      table_name: 'domain_audits'
    });

    if (rlsError) {
      console.warn('Warning enabling RLS:', rlsError.message);
    }

    // Create new policies
    const createPolicies = [
      {
        name: 'anon_submit_policy',
        operation: 'INSERT',
        role: 'anon',
        check: 'true'
      },
      {
        name: 'anon_view_policy',
        operation: 'SELECT',
        role: 'anon',
        using: 'true'
      },
      {
        name: 'anon_update_policy',
        operation: 'UPDATE',
        role: 'anon',
        using: 'user_id IS NULL',
        check: 'user_id IS NULL'
      },
      {
        name: 'auth_all_policy',
        operation: 'ALL',
        role: 'authenticated',
        using: 'user_id = auth.uid()',
        check: 'user_id = auth.uid()'
      }
    ];

    for (const policy of createPolicies) {
      const { error } = await supabase.rpc('create_policy', {
        policy_name: policy.name,
        table_name: 'domain_audits',
        operation: policy.operation,
        role: policy.role,
        using_expression: policy.using || 'true',
        check_expression: policy.check || 'true'
      });

      if (error) {
        console.error(`Error creating policy ${policy.name}:`, error);
        throw error;
      }
    }

    // Grant necessary permissions
    const grants = [
      'GRANT USAGE ON SCHEMA public TO anon, authenticated;',
      'GRANT ALL ON public.domain_audits TO authenticated;',
      'GRANT SELECT, INSERT, UPDATE ON public.domain_audits TO anon;',
      'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;'
    ];

    for (const grant of grants) {
      const { error } = await supabase.rpc('execute_sql', {
        sql: grant
      });

      if (error) {
        console.warn(`Warning executing grant: ${grant}`, error.message);
      }
    }

    console.log('Successfully updated domain audit policies');
  } catch (error) {
    console.error('Failed to update policies:', error);
    throw error;
  }
}

// Execute the function
fixDomainAuditPolicies()
  .then(() => {
    console.log('Policy update completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Policy update failed:', error);
    process.exit(1);
  });
