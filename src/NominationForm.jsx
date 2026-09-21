import React, {useState} from "react";
import {emptyNomination, validateNomination} from "./domain";
import {backendConfigured, submitNomination} from "./lib/supabase";

export default function NominationForm(){
 const [value,setValue]=useState({...emptyNomination});
 const [errors,setErrors]=useState({});
 const [sent,setSent]=useState(false);
 const [busy,setBusy]=useState(false);
 const [serviceMessage,setServiceMessage]=useState("");
 const change=e=>{const {name,type,checked,value:v}=e.target;setValue(x=>({...x,[name]:type==="checkbox"?checked:v}))};
 const submit=async e=>{
  e.preventDefault(); setServiceMessage("");
  const next=validateNomination(value); setErrors(next);
  if(Object.keys(next).length) return;
  if(!backendConfigured){setSent(true);return;}
  setBusy(true);
  const result=await submitNomination(value);
  setBusy(false);
  if(result.ok) setSent(true); else setServiceMessage(result.message);
 };
 if(sent) return <div className="formSuccess"><p className="eyebrow">Nomination prepared</p><h3>Thank you for noticing this knowledge.</h3><p>Your nomination has been prepared${backendConfigured ? " and securely submitted for editorial review" : " locally"}. ${backendConfigured ? "It will not be published automatically." : "This deployment is not connected to the secure submission service yet, so no personal information was transmitted."}</p><button onClick={()=>{setSent(false);setValue({...emptyNomination})}}>Nominate another</button></div>;
 const field=(label,name,required=false,placeholder="")=><label>{label}{required&&<b> *</b>}<input name={name} value={value[name]} onChange={change} placeholder={placeholder}/>{errors[name]&&<small>{errors[name]}</small>}</label>;
 return <form className="nominationForm" onSubmit={submit}>
  <div className="formIntro"><p className="eyebrow">Nominate living knowledge</p><h2>Tell us what the world may be missing.</h2><p>A nomination is private editorial input. It is <b>not</b> automatically published and it does not make an endangered-status claim.</p></div>
  <div className="formGrid">
   {field("What is the skill or practice called?","skillName",true,"Name in any language")}
   {field("Local name","localName",false,"If different")}
   {field("Country / territory","country",true)}
   {field("Region / village / place","region",true)}
   {field("Community, if relevant","community")}
   {field("Your relationship to this knowledge","relationship",false,"Practitioner, family, learner, neighbour…")}
   <label className="full">Why should this knowledge be documented? <b>*</b><textarea name="whyItMatters" value={value.whyItMatters} onChange={change}/>{errors.whyItMatters&&<small>{errors.whyItMatters}</small>}</label>
   <label className="full">Why do you think it may be at risk?<textarea name="whyAtRisk" value={value.whyAtRisk} onChange={change}/><span>It is okay to say “I don't know.” Our team verifies preservation claims separately.</span></label>
   {field("How can the editorial team contact you?","contact",true,"Email or other preferred contact")}
   <label className="check full"><input type="checkbox" name="permissionToContact" checked={value.permissionToContact} onChange={change}/><span>You may contact me about this nomination. My contact information should remain private.</span>{errors.permissionToContact&&<small>{errors.permissionToContact}</small>}</label>
  </div>
  {serviceMessage&&<p className="serviceError">{serviceMessage}</p>}<button className="primary" type="submit" disabled={busy}>{busy?"Submitting securely…":backendConfigured?"Submit for private review →":"Prepare nomination →"}</button>
 </form>
}
