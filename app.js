(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const subjects = {
    pds: {title:'Programming and Data Structures',short:'PROGRAMMING & DATA STRUCTURES',topics:QUESTION_TOPICS,bank:QUESTION_BANK,description:'C programming, recursion and core data structures'},
    algorithms: {title:'Algorithms',short:'ALGORITHMS',topics:ALGORITHM_TOPICS,bank:ALGORITHM_BANK,description:'Complexity, searching, sorting, hashing, design paradigms and graphs'}
  };
  const saved = readProgress();
  let activeSubject = null;
  let activeTopic = null;
  let activeQuestion = 0;

  function readProgress(){
    try { return JSON.parse(localStorage.getItem('gate-cs-practice-v1')) || {}; }
    catch { return {}; }
  }
  function writeProgress(){ localStorage.setItem('gate-cs-practice-v1', JSON.stringify(saved)); }
  function current(){ return subjects[activeSubject]; }
  function topicQuestions(index){ return current().bank.filter(q => q.topicIndex === index); }
  function key(q){ return q.id; }
  function wasChecked(q){ return Object.prototype.hasOwnProperty.call(saved, key(q)); }

  function renderHome(){
    $('#home-view').classList.remove('hidden');
    $('#practice-view').classList.add('hidden');
    $('#hero-count').textContent = Object.values(subjects).reduce((sum,s)=>sum+s.bank.length,0);
    $('#subject-selection').classList.toggle('hidden',Boolean(activeSubject));
    $('#topic-selection').classList.toggle('hidden',!activeSubject);
    if(!activeSubject){
      $('#subject-grid').innerHTML = Object.entries(subjects).map(([id,subject])=>{
        const checked=subject.bank.filter(wasChecked).length;
        return `<button class="subject-card" data-subject="${id}"><span class="subject-meta">GATE CS · ${subject.topics.length} TOPICS</span><h3>${escapeHtml(subject.title)}</h3><p>${escapeHtml(subject.description)}</p><span class="subject-count">${subject.bank.length} QUESTIONS · ${checked} CHECKED</span><span class="subject-arrow">↗</span></button>`;
      }).join('');
      document.querySelectorAll('.subject-card').forEach(card=>card.addEventListener('click',()=>{activeSubject=card.dataset.subject;renderHome();window.scrollTo({top:0,behavior:'smooth'});}));
      return;
    }
    $('#subject-kicker').textContent=`CHOOSE A TOPIC · ${current().short}`;
    $('#subject-heading').innerHTML=`${escapeHtml(current().title)} <span class="muted">/ ${String(current().topics.length).padStart(2,'0')}</span>`;
    $('#topic-grid').innerHTML=current().topics.map((topic,i)=>{
      const qs=topicQuestions(i),done=qs.filter(wasChecked).length,percent=Math.round(done/qs.length*100);
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

  function renderQuestion(){
    const qs=topicQuestions(activeTopic),q=qs[activeQuestion],done=qs.filter(wasChecked).length;
    $('#topic-score').textContent=`${done} / ${qs.length} checked`;
    $('#topic-progress').style.width=`${qs.length?done/qs.length*100:0}%`;
    $('#nav-count').textContent=`${activeQuestion+1} / ${qs.length}`;
    $('#question-list').innerHTML=qs.map((item,i)=>`<button class="q-nav-btn ${i===activeQuestion?'current':''} ${wasChecked(item)?'done':''}" data-q="${i}" aria-label="Question ${i+1}${wasChecked(item)?', checked':''}">${String(i+1).padStart(2,'0')}</button>`).join('');
    document.querySelectorAll('.q-nav-btn').forEach(button=>button.addEventListener('click',()=>{activeQuestion=Number(button.dataset.q);renderQuestion();}));
    const checked=saved[key(q)];
    let response='';
    if(q.type==='NAT'){
      response=`<label class="sr-only" for="nat-answer">Your numeric answer</label><input class="answer-input" id="nat-answer" type="text" inputmode="decimal" placeholder="Enter your answer" value="${checked?escapeHtml(checked.response):''}" ${checked?'disabled':''}>`;
    }else{
      const inputType=q.type==='MSQ'?'checkbox':'radio';
      response=`<div class="options">${q.options.map(option=>{const chosen=checked?checked.response.includes(option):false;return `<label class="option ${chosen?'selected':''}"><input type="${inputType}" name="answer" value="${escapeHtml(option)}" ${chosen?'checked':''} ${checked?'disabled':''}><span>${escapeHtml(option)}</span></label>`;}).join('')}</div>`;
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
  function numericEqual(a,b){const x=Number(a),y=Number(b);return Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<=1e-6*Math.max(1,Math.abs(y));}
  function checkAnswer(q){
    let response;
    if(q.type==='NAT'){const input=$('#nat-answer');if(!input.value.trim())return;response=normalizeNat(input.value);}
    else{response=[...document.querySelectorAll('input[name="answer"]:checked')].map(input=>input.value);if(!response.length)return;}
    const correct=q.type==='NAT'?numericEqual(response[0],q.answer):response.length===q.answer.length&&response.every(a=>q.answer.includes(a));
    saved[key(q)]={response,correct};writeProgress();renderQuestion();
  }
  function feedbackHtml(q,result){const answer=q.type==='NAT'?q.answer:q.answer.join(', ');return `<div class="feedback ${result.correct?'':'incorrect'}"><h4>${result.correct?'Correct. Good reasoning.':'Not quite. Review the steps below.'}</h4><p class="answer-line">${result.correct?'ANSWER':'CORRECT ANSWER'} · ${escapeHtml(answer)}</p><p>${escapeHtml(q.explanation)}</p></div>`;}
  $('#start-btn').addEventListener('click',()=>$(activeSubject?'#topic-grid':'#subject-grid').scrollIntoView({behavior:'smooth',block:'center'}));
  $('#subjects-back').addEventListener('click',()=>{activeSubject=null;renderHome();});
  renderHome();
})();
