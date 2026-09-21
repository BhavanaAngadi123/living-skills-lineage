const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const backendConfigured = Boolean(url && key);
export async function submitNomination(value) {
  if (!backendConfigured) return {ok:false,offline:true,message:"The secure submission service is not configured for this deployment yet."};
  const response = await fetch(`${url}/rest/v1/rpc/submit_nomination`, {
    method:"POST", headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"},
    body:JSON.stringify({p_skill_name:value.skillName,p_local_name:value.localName,p_country:value.country,p_region:value.region,p_community:value.community,p_why_it_matters:value.whyItMatters,p_why_at_risk:value.whyAtRisk,p_relationship:value.relationship,p_contact:value.contact,p_permission:value.permissionToContact})
  });
  if(!response.ok) return {ok:false,message:"We could not securely submit this nomination. Please try again later."};
  return {ok:true,id:await response.json()};
}
