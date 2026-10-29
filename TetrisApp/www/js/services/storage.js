let highScores = [];
let sessionSequence = 0;
function normalizeScore(s) {
  if (typeof s === 'number' && Number.isFinite(s)) return {score:s, durationMs:null, id:'old-'+(++sessionSequence)};
  if (!s || !Number.isFinite(s.score)) return null;
  return {score:s.score,durationMs:Number.isFinite(s.durationMs)?Math.max(0,Math.round(s.durationMs)):null,id:s.id||'old-'+(++sessionSequence)};
}
function sortScores() { highScores.sort((a,b)=>b.score-a.score); highScores=highScores.slice(0,MAX_HIGH_SCORES); }
function loadHighScoresFromStorage() {
  try { const arr=JSON.parse(localStorage.getItem(HIGH_SCORES_KEY)||'[]'); if(Array.isArray(arr)){ highScores=arr.map(normalizeScore).filter(Boolean);sortScores();return getHighScores(); } }
  catch(e) { console.error('Score load',e); }
  highScores=[]; return [];
}
function getHighScores(){return highScores.map(x=>({...x}));}
function saveHighScoresToStorage(){try{localStorage.setItem(HIGH_SCORES_KEY,JSON.stringify(highScores));}catch(e){console.error('Score save',e);}}
function addScoreToHighScoresList(score,durationMs=null,id=null){
  const key=id||'run-'+Date.now()+'-'+(++sessionSequence);
  highScores.push(normalizeScore({score,durationMs,id:key}));sortScores();saveHighScoresToStorage();
  return highScores.some(x=>x.id===key);
}
function updateSessionHighScore(oldScore,score,durationMs=null,id=null){
  let x=id?highScores.find(x=>x.id===id):highScores.find(x=>x.score===oldScore);
  if(x){x.score=score;x.durationMs=durationMs;}
  else highScores.push(normalizeScore({score,durationMs,id:id||'run-'+Date.now()+'-'+(++sessionSequence)}));
  sortScores();saveHighScoresToStorage();
  return id?highScores.some(x=>x.id===id):highScores.some(x=>x.score===score);
}
