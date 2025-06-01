
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { method } = req
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (method === 'POST' && action === 'mark-attendance') {
      const requestData = await req.json()
      console.log('Marking attendance:', requestData)

      // Determine approval status based on record type and status
      let approvalStatus = 'pending'
      if (requestData.status === 'absent') {
        approvalStatus = 'auto_approved'
      } else if (requestData.status === 'present') {
        approvalStatus = 'auto_approved'
      }

      // Insert attendance record
      const { data, error } = await supabase
        .from('attendance_leave_records')
        .insert([{
          ...requestData,
          approval_status: approvalStatus,
          created_by: requestData.personnel_id // Temporary, should be actual user ID
        }])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data,
          message: 'Attendance marked successfully' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201 
        }
      )
    }

    if (method === 'GET' && action === 'search-personnel') {
      const searchTerm = url.searchParams.get('term')
      const personnelType = url.searchParams.get('type') || 'all'

      if (!searchTerm || searchTerm.length < 2) {
        return new Response(
          JSON.stringify({ data: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const results = []

      // Search staff if type is 'all' or 'staff'
      if (personnelType === 'all' || personnelType === 'staff') {
        const { data: staffData } = await supabase
          .from('staff')
          .select('id, pno, name, father_name, mobile_number, current_posting_district, education, rank')
          .or(`name.ilike.%${searchTerm}%, pno.ilike.%${searchTerm}%`)
          .limit(10)

        if (staffData) {
          staffData.forEach(staff => {
            const names = staff.name.split(' ')
            results.push({
              id: staff.id,
              pno: staff.pno,
              unique_id: staff.pno,
              first_name: names[0] || '',
              last_name: names.slice(1).join(' ') || '',
              phone: staff.mobile_number,
              department: staff.current_posting_district,
              designation: staff.rank,
              type: 'staff',
              status: 'active'
            })
          })
        }
      }

      // Search trainees if type is 'all' or 'trainee'
      if (personnelType === 'all' || personnelType === 'trainee') {
        const { data: traineeData } = await supabase
          .from('trainees')
          .select('id, pno, chest_no, name, father_name, mobile_number, current_posting_district, education, rank')
          .or(`name.ilike.%${searchTerm}%, pno.ilike.%${searchTerm}%, chest_no.ilike.%${searchTerm}%`)
          .limit(10)

        if (traineeData) {
          traineeData.forEach(trainee => {
            const names = trainee.name.split(' ')
            results.push({
              id: trainee.id,
              pno: trainee.pno,
              unique_id: trainee.chest_no || trainee.pno,
              first_name: names[0] || '',
              last_name: names.slice(1).join(' ') || '',
              phone: trainee.mobile_number,
              department: trainee.current_posting_district,
              designation: trainee.rank,
              type: 'trainee',
              status: 'active'
            })
          })
        }
      }

      return new Response(
        JSON.stringify({ data: results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET' && action === 'attendance-history') {
      const personnelId = url.searchParams.get('personnel_id')
      
      if (!personnelId) {
        throw new Error('Personnel ID is required')
      }

      const { data, error } = await supabase
        .from('attendance_leave_records')
        .select('*')
        .eq('personnel_id', personnelId)
        .order('record_date', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
