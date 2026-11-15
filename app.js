(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const subjects = {};
  let progress = {};
  let activeSubject = null;
  let activeTopic = null;
  let activeQuestion = 0;
  let lastProgressSignature = '';

  function setStorageState(text, online){
    const badge=$('#storage-state');
    badge.textContent=text;
    badge.classList.toggle('storage-offline',!online);
  }
  function statusKey(subjectId, questionId){ return `${subjectId}:${questionId}`; }
  function current(){ return subjects[activeSubject]; }
  function topicQuestions(index){ return current().bank.filter(q=>q.topicIndex===index); }
  function wasChecked(q){ return Boolean(progress[statusKey(activeSubject,q.id)]); }

  async function loadCatalog(){
    const result=await fetch('/api/catalog',{cache:'no-store'});
    if(!result.ok)throw new Error('Question catalog could not be loaded.');
    const payload=await result.json();
    for(const subject of payload.subjects||[]){
      const topics=subject.topics.map(topic=>({id:topic.id,title:topic.title,subtitle:topic.subtitle,icon:topic.icon}));
      const bank=subject.topics.flatMap((topic,topicIndex)=>topic.questions.map(question=>({...question,topicIndex})));
      subjects[subject.id]={...subject,topics,bank};
    }
    if(!Object.keys(subjects).length)throw new Error('The database has no subjects yet.');
  }

  async function refreshProgress(render=true){
    const result=await fetch('/api/progress',{cache:'no-store'});
    if(!result.ok)throw new Error('Progress could not be loaded.');
    const payload=await result.json();
    const incoming=payload.progress||{};
    const signature=JSON.stringify(incoming);
    if(signature===lastProgressSignature){setStorageState('SHARED DATABASE',true);return;}
    const activeQuestionKey=activeSubject&&current()&&activeTopic!==null
      ? statusKey(activeSubject,topicQuestions(activeTopic)[activeQuestion]?.id||'') : null;
    const currentWasChecked=activeQuestionKey&&Boolean(progress[activeQuestionKey]);
    progress=incoming;
    lastProgressSignature=signature;
    setStorageState('SHARED DATABASE',true);
    if(!render)return;
    if($('#practice-view').classList.contains('hidden')){
      renderHome();
    }else if(activeQuestionKey&&Boolean(progress[activeQuestionKey])!==currentWasChecked){
      renderQuestion();
    }else{
      updateTopicProgress();
    }
  }

  async function saveCheckedAnswer(q,response){
    const result=await fetch('/api/progress',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({subject:activeSubject,question_id:q.id,response})
    });
    if(!result.ok)throw new Error('The database did not save this answer.');
    await refreshProgress();
  }

  function renderHome(){
    $('#home-view').classList.remove('hidden');
    $('#practice-view').classList.add('hidden');
    $('#hero-count').textContent=Object.values(subjects).reduce((sum,s)=>sum+s.bank.length,0);
    $('#subject-selection').classList.toggle('hidden',Boolean(activeSubject));
    $('#topic-selection').classList.toggle('hidden',!activeSubject);
    if(!activeSubject){
      $('#subject-grid').innerHTML=Object.entries(subjects).map(([id,subject])=>{
        const checked=subject.bank.filter(q=>progress[statusKey(id,q.id)]).length;
        return `<button class="subject-card" data-subject="${id}"><span class="subject-meta">GATE CS · ${subject.topics.length} TOPICS</span><h3>${escapeHtml(subject.title)}</h3><p>${escapeHtml(subject.description)}</p><span class="subject-count">${subject.bank.length} QUESTIONS · ${checked} CHECKED</span><span class="subject-arrow">↗</span></button>`;
      }).join('');
      document.querySelectorAll('.subject-card').forEach(card=>card.addEventListener('click',()=>{
        activeSubject=card.dataset.subject;renderHome();window.scrollTo({top:0,behavior:'smooth'});
      }));
      return;
    }
    $('#subject-kicker').textContent=`CHOOSE A TOPIC · ${current().short}`;
    $('#subject-heading').innerHTML=`${escapeHtml(current().title)} <span class="muted">/ ${String(current().topics.length).padStart(2,'0')}</span>`;
    $('#topic-grid').innerHTML=current().topics.map((topic,i)=>{
      const qs=topicQuestions(i),done=qs.filter(wasChecked).length,percent=qs.length?Math.round(done/qs.length*100):0;
      return `<button class="topic-card" data-topic="${i}" aria-label="Practice ${escapeHtml(topic.title)}">
        <div class="topic-top"><span class="topic-number">${String(i+1).padStart(2,'0')} / TOPIC</span><span class="topic-icon">${escapeHtml(topic.icon)}</span></div>
        <h3>${escapeHtml(topic.title)}</h3><p>${escapeHtml(topic.subtitle)}</p>
        <div class="topic-card-foot"><span>${qs.length} QUESTIONS · ${done} CHECKED</span><span class="topic-progress-mini"><i style="width:${percent}%"></i></span></div>
      </button>`;
    }).join('');
    document.querySelectorAll('.topic-card').forEach(card=>card.addEventListener('click',()=>openTopic(Number(card.dataset.topic))));
  }

  function openTopic(index){
    activeTopic=index;activeQuestion=0;
    const topic=current().topics[index];
    $('#home-view').classList.add('hidden');$('#practice-view').classList.remove('hidden');
    $('#topic-kicker').textContent=`${current().short} · ${topicQuestions(index).length} QUESTIONS`;
    $('#topic-title').textContent=topic.title;
    $('#topic-desc').textContent=topic.subtitle;
    renderQuestion();window.scrollTo({top:0,behavior:'smooth'});
  }

  function updateTopicProgress(){
    if(activeTopic===null||!activeSubject)return;
    const qs=topicQuestions(activeTopic),done=qs.filter(wasChecked).length;
    const score=$('#topic-score'),bar=$('#topic-progress');
    if(score)score.textContent=`${done} / ${qs.length} checked`;
    if(bar)bar.style.width=`${qs.length?done/qs.length*100:0}%`;
    document.querySelectorAll('.q-nav-btn').forEach((button,index)=>button.classList.toggle('done',wasChecked(qs[index])));
  }

  function renderQuestion(){
    const qs=topicQuestions(activeTopic),q=qs[activeQuestion];
    if(!q)return;
    updateTopicProgress();
    $('#nav-count').textContent=`${activeQuestion+1} / ${qs.length}`;
    $('#question-list').innerHTML=qs.map((item,i)=>`<button class="q-nav-btn ${i===activeQuestion?'current':''} ${wasChecked(item)?'done':''}" data-q="${i}" aria-label="Question ${i+1}${wasChecked(item)?', checked':''}">${String(i+1).padStart(2,'0')}</button>`).join('');
    document.querySelectorAll('.q-nav-btn').forEach(button=>button.addEventListener('click',()=>{activeQuestion=Number(button.dataset.q);renderQuestion();}));
    const checked=progress[statusKey(activeSubject,q.id)];
    let response='';
    if(q.type==='NAT'){
      response=`<label class="sr-only" for="nat-answer">Your numeric answer</label><input class="answer-input" id="nat-answer" type="text" inputmode="decimal" placeholder="Enter your answer" ${checked?'disabled':''}>`;
    }else{
      const inputType=q.type==='MSQ'?'checkbox':'radio';
      response=`<div class="options">${q.options.map(option=>{const chosen=checked&&checked.response.includes(option);return `<label class="option ${chosen?'selected':''}"><input type="${inputType}" name="answer" value="${escapeHtml(option)}" ${chosen?'checked':''} ${checked?'disabled':''}><span>${escapeHtml(option)}</span></label>`;}).join('')}</div>`;
    }
    $('#question-panel').innerHTML=`<div class="question-meta"><span class="type-tag">${q.type}${q.type==='MSQ'?' · SELECT ALL':''}</span><span class="difficulty-tag">${q.difficulty}</span><span class="question-index">${String(activeQuestion+1).padStart(2,'0')} / ${String(qs.length).padStart(2,'0')}</span></div>
      <p class="question-text">${escapeHtml(q.prompt)}</p>${response}${checked?feedbackHtml(q,checked):''}
      <div class="question-actions">${checked?`<button class="next-btn" id="next-btn">${activeQuestion===qs.length-1?'Back to topics':'Next question'} <span>→</span></button>`:`<button class="check-btn" id="check-btn">Check answer <span>↗</span></button>`}<span class="keyboard-hint">${q.type==='MSQ'?'SELECT ALL THAT APPLY':q.type==='NAT'?'NUMERIC ANSWER':'SELECT ONE ANSWER'}</span></div>`;
    if(!checked){
      $('#check-btn').addEventListener('click',()=>checkAnswer(q));
      $('#question-panel').addEventListener('change',ev=>{
        if(ev.target.matches('input[type=radio]'))document.querySelectorAll('.option').forEach(el=>el.classList.toggle('selected',el.contains(ev.target)));
        if(ev.target.matches('input[type=checkbox]'))ev.target.closest('.option').classList.toggle('selected',ev.target.checked);
      });
    }else $('#next-btn').addEventListener('click',()=>activeQuestion<qs.length-1?(activeQuestion++,renderQuestion()):renderHome());
  }

  function normalizeNat(value){return String(value).trim().replace(/,/g,'');}
  async function checkAnswer(q){
    let response;
    if(q.type==='NAT'){const input=$('#nat-answer');if(!input.value.trim())return;response=normalizeNat(input.value);}
    else{response=[...document.querySelectorAll('input[name="answer"]:checked')].map(input=>input.value);if(!response.length)return;}
    const button=$('#check-btn');button.disabled=true;button.textContent='Saving…';setStorageState('SAVING TO DATABASE…',true);
    try{await saveCheckedAnswer(q,response);}
    catch{button.disabled=false;button.textContent='Save failed · try again';setStorageState('DATABASE ERROR',false);}
  }
  function feedbackHtml(q,result){
    const answer=result.answer??q.answer;
    const answerText=Array.isArray(answer)?answer.join(', '):String(answer??'');
    const explanation=result.explanation??q.explanation??'';
    return `<div class="feedback ${result.correct?'':'incorrect'}"><h4>${result.correct?'Correct. Good reasoning.':'Not quite. Review the steps below.'}</h4><p class="answer-line">${result.correct?'ANSWER':'CORRECT ANSWER'} · ${escapeHtml(answerText)}</p><p>${escapeHtml(explanation)}</p></div>`;
  }

  async function start(){
    setStorageState('LOADING FROM DATABASE…',true);
    try{
      await loadCatalog();
      await refreshProgress(false);
      renderHome();
      setStorageState('SHARED DATABASE',true);
      window.setInterval(()=>refreshProgress().catch(()=>setStorageState('DATABASE OFFLINE',false)),3000);
      window.addEventListener('focus',()=>refreshProgress().catch(()=>setStorageState('DATABASE OFFLINE',false)));
    }catch(error){
      setStorageState('DATABASE UNAVAILABLE',false);
      $('#subject-grid').innerHTML=`<p class="intro">${escapeHtml(error.message)} Start the app with <code>docker compose up</code>, then reload this page.</p>`;
    }
  }
  $('#start-btn').addEventListener('click',()=>$(activeSubject?'#topic-grid':'#subject-grid').scrollIntoView({behavior:'smooth',block:'center'}));
  $('#subjects-back').addEventListener('click',()=>{activeSubject=null;renderHome();});
  $('#back-btn').addEventListener('click',renderHome);
  start();
})();
