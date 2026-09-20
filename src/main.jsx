import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";

const stories=[
 {id:"kalamkari",place:"Srikalahasti, India",skill:"Kalamkari",local:"కలంకారి",person:"A living textile tradition",quote:"The line begins before the colour.",status:"Endangered knowledge",years:"Generations of practice",image:"https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1600&q=85",category:"Textile",story:"Kalamkari is more than a finished cloth. It carries drawing, mordanting, washing, dye preparation and judgement learned through repeated practice. This prototype story shows how the platform will place the practitioner and their own account before an encyclopedia description.",lineage:["Teacher / family elder","Current practitioner","Apprentice / next generation"],remember:"How the cloth feels after each wash — something a written recipe cannot fully teach."},
 {id:"patola",place:"Patan, Gujarat, India",skill:"Patola",local:"પટોળું",person:"A double-ikat weaving lineage",quote:"The pattern exists before the threads meet.",status:"Rare practice",years:"Knowledge held in specialist lineages",image:"https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&w=1600&q=85",category:"Weaving",story:"Patola's double-ikat process demands planning before weaving begins. Living Skills Lineage would document not only objects, but the people, vocabulary, decisions and teaching relationships behind the work.",lineage:["Earlier generation","Master practitioner","Learner"],remember:"The tiny corrections made while aligning dyed warp and weft — judgement built through years of looking."},
 {id:"kalaripayattu",place:"Kerala, India",skill:"Kalaripayattu",local:"കളരിപ്പയറ്റ്",person:"A martial knowledge tradition",quote:"A movement survives because someone corrects it.",status:"Living tradition",years:"Teacher-to-student transmission",image:"https://images.unsplash.com/photo-1555597408-26bc8e548a46?auto=format&fit=crop&w=1600&q=85",category:"Movement",story:"A martial tradition cannot be preserved as a list of techniques. Timing, correction, discipline, context and teacher-student transmission matter. The platform is designed to keep that human chain visible.",lineage:["Gurukkal / teacher","Practitioner","Student"],remember:"The correction a teacher gives with a glance, before the student can explain what was wrong."}
];

function Mark(){return <button className="mark" onClick={()=>location.hash=""} aria-label="Living Skills Lineage home"><span>LS</span><b>Living Skills<br/>Lineage</b></button>}
function Nav(){return <header><Mark/><nav><a href="#explore">Explore</a><a href="#at-risk">At risk</a><a href="#about">Why this exists</a></nav><a className="quietBtn" href="#nominate">Nominate a skill</a></header>}
function Status({children}){return <span className="status"><i/> {children}</span>}

function Home({open}){
 return <main>
  <section className="hero" id="explore">
   <div className="heroCopy">
    <p className="eyebrow">A living archive of human knowledge</p>
    <h1>Some knowledge disappears when the last person who knows it is gone.</h1>
    <p className="lede">Meet the people, practices and lineages keeping it alive — in their own voices, on their own terms.</p>
    <div className="actions"><button className="primary" onClick={()=>document.querySelector("#stories").scrollIntoView({behavior:"smooth"})}>Meet the knowledge keepers <span>↓</span></button><a href="#about">Why this matters</a></div>
   </div>
   <div className="heroVisual" onClick={()=>open(stories[0])} role="button" tabIndex="0">
    <img src={stories[0].image} alt="Hands working with traditional materials — representative prototype imagery"/>
    <div className="photoNote"><span>Prototype story</span><strong>{stories[0].skill}</strong><small>{stories[0].place}</small></div>
   </div>
  </section>

  <section className="manifesto" id="about">
   <p>Not a catalogue of objects.</p><h2>A record of <em>who knows</em>, who taught them, and who might carry it next.</h2>
  </section>

  <section className="stories" id="stories">
   <div className="sectionHead"><div><p className="eyebrow">Meet living knowledge</p><h2>Start with a person, not a category.</h2></div><p>These are prototype stories showing the intended experience. Real profiles will only be published with evidence, consent and clear attribution.</p></div>
   <div className="storyGrid">{stories.map((s,i)=><article className={"storyCard "+(i===0?"wide":"")} key={s.id} onClick={()=>open(s)}>
     <div className="cardImage"><img src={s.image} alt="Representative imagery for prototype story"/><span>Prototype</span></div>
     <div className="cardBody"><Status>{s.status}</Status><p className="place">{s.place}</p><h3>{s.skill} <small>{s.local}</small></h3><blockquote>“{s.quote}”</blockquote><button>Enter the story <span>→</span></button></div>
    </article>)}</div>
  </section>

  <section className="atRisk" id="at-risk">
   <div><p className="eyebrow">Knowledge at risk</p><h2>When there may be no one left to ask.</h2></div>
   <div className="riskText"><p>We will not use dramatic countdowns or unverified “last practitioner” claims. Preservation status must show its evidence, source and date.</p><div className="riskScale"><span>Living</span><span>Declining</span><span>Endangered</span><span>Critically endangered</span><span>Last known practitioners</span></div></div>
  </section>

  <section className="memory">
   <div className="memoryQuote"><span className="quoteMark">“</span><h2>Someone should know this after me.</h2><p>A place for the small knowledge that rarely reaches books: how the right wood sounds, what the thread should feel like, the local name of a tool, the mistake an apprentice learns to see.</p></div>
   <div className="memoryObject"><div className="rings"/><p>One remembered detail<br/><strong>can carry a practice forward.</strong></p></div>
  </section>

  <section className="principles">
   <p className="eyebrow">How we behave</p>
   <div className="principleGrid"><div><b>01</b><h3>People before content</h3><p>The practitioner is not raw material for a platform. Their voice, consent and context come first.</p></div><div><b>02</b><h3>Original voice stays</h3><p>Record in the language a person actually speaks. Translation helps others listen; it never replaces the original.</p></div><div><b>03</b><h3>Not everything belongs online</h3><p>Communities decide what can be public, taught, commercial, restricted, sacred or not recorded at all.</p></div></div>
  </section>

  <section className="nominate" id="nominate"><div><p className="eyebrow">Help us find what is being missed</p><h2>Do you know a skill that should not disappear?</h2></div><div><p>A nomination is a starting point, not automatic publication. Every claim needs human verification and practitioner consent.</p><a href="mailto:hello@livingskillslineage.org?subject=Nominate%20a%20living%20skill" className="primary">Nominate a living skill →</a></div></section>
 </main>
}

function Story({story,back}){
 return <main className="detail">
  <button className="back" onClick={back}>← Back to stories</button>
  <section className="storyHero"><div className="storyPhoto"><img src={story.image} alt="Representative prototype imagery"/><span>Representative prototype imagery</span></div><div className="storyIntro"><Status>{story.status}</Status><p className="eyebrow">{story.place} · {story.category}</p><h1>{story.skill}</h1><p className="localName">{story.local}</p><blockquote>“{story.quote}”</blockquote><p className="prototype">This is a <b>prototype story</b>, not a claim about a specific named practitioner. It demonstrates how verified, consented stories will appear.</p></div></section>
  <section className="storyNarrative"><aside><span>THE PRACTICE</span><strong>{story.years}</strong></aside><div><h2>Knowledge lives in decisions.</h2><p>{story.story}</p><p>The finished object is evidence of knowledge, but it is not the whole knowledge. The platform records the language, judgement, memory and teaching relationship around the practice.</p></div></section>
  <section className="lineage"><p className="eyebrow">The human chain</p><h2>Who taught you?<br/>Who are you teaching?</h2><div className="line">{story.lineage.map((x,i)=><React.Fragment key={x}><div className="personNode"><span>{String(i+1).padStart(2,"0")}</span><strong>{x}</strong></div>{i<story.lineage.length-1&&<i>↓</i>}</React.Fragment>)}</div><p className="lineageNote">A real lineage is published only when the people involved consent and the relationship can be responsibly documented.</p></section>
  <section className="remember"><p className="eyebrow">Someone should know this after me</p><blockquote>“{story.remember}”</blockquote><p>This space preserves tacit details in the practitioner’s own voice — audio or video first, translation second.</p></section>
  <section className="support"><div><p className="eyebrow">Help knowledge continue</p><h2>Understanding comes before transaction.</h2></div><div className="supportOptions"><span>Learn directly</span><span>Visit a workshop</span><span>Support an apprentice</span><span>Buy from the maker</span><span>Help document</span></div></section>
 </main>
}

function App(){
 const [selected,setSelected]=useState(null);
 useEffect(()=>{const id=location.hash.replace("#story/",""); if(location.hash.startsWith("#story/")) setSelected(stories.find(s=>s.id===id)||null)},[]);
 const open=s=>{setSelected(s);location.hash="story/"+s.id;scrollTo(0,0)};
 const back=()=>{setSelected(null);history.pushState(null,"",location.pathname);scrollTo(0,0)};
 return <><Nav/>{selected?<Story story={selected} back={back}/>:<Home open={open}/>}<footer><Mark/><p>Built to help knowledge pass from one human to another before it disappears.</p><small>Prototype · Living Skills Lineage</small></footer></>
}
createRoot(document.getElementById("root")).render(<App/>);