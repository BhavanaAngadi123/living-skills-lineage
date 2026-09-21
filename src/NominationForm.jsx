import React, {useState} from "react";
import {emptyNomination, validateNomination} from "./domain";

export default function NominationForm(){
 const [value,setValue]=useState({...emptyNomination});
 const [errors,setErrors]=useState({});
 const [sent,setSent]=useState(false);
 const change=e=>{const {name,type,checked,value:v}=e.target;setValue(x=>({...x,[name]:type==="checkbox"?checked:v}))};
 const submit=e=>{
  e.preventDefault();
  const next=validateNomination(value); setErrors(next);
  if(Object.keys(next).length) return;
  // Prototype: no personal data is transmitted until a reviewed backend exists.
  setSent(true);
 };
 if(sent) return <div className="formSuccess"><p className="eyebrow">Nomination prepared</p><h3>Thank you for noticing this knowledge.</h3><p>This prototype intentionally does not transmit personal information yet. A production submission service will only launch after privacy, consent and editorial review controls are connected.</p><button onClick={()=>{setSent(false);setValue({...emptyNomination})}}>Nominate another</button></div>;
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
  <button className="primary" type="submit">Prepare nomination →</button>
 </form>
}
