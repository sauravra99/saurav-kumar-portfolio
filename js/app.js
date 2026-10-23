(function () {
  'use strict';
  const data = window.PORTFOLIO_DATA;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let toastTimer;
  function notify(message) {
    $('toast').textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 3500);
  }
  async function copy(value) {
    try { await navigator.clipboard.writeText(value); notify('Copied to clipboard.'); }
    catch (_) { notify('Copy unavailable. Please select and copy the text directly.'); }
  }
  function codeBlock(code, label, key) {
    return '<div class="code-toolbar"><span>' + escape(label) + '</span><button type="button" class="copy-button" data-copy="' + escape(key) + '">Copy</button></div><pre tabindex="0" aria-label="' + escape(label) + '"><code>' + escape(code) + '</code></pre>';
  }
  const copyValues = {};
  const titles = ['Automating the asset lifecycle', 'Making asset search faster', 'Building for content authors', 'Delivering sites across markets'];
  $('work-list').innerHTML = data.blueprints.map((work, index) => {
    copyValues[work.id] = work.code;
    return '<details class="project"><summary><span class="project-number">0' + (index + 1) + '</span><span><span class="project-meta">' + escape(work.org) + '</span><span class="project-title">' + titles[index] + '</span></span><span class="expand-icon" aria-hidden="true">+</span></summary><div class="project-content"><div class="project-columns"><div><h4>The challenge</h4><p>' + escape(work.problem) + '</p></div><div><h4>The approach</h4><p>' + escape(work.solution) + '</p></div></div><h4>Key contributions</h4><ul>' + work.outcomes.map(item => '<li>' + escape(item) + '</li>').join('') + '</ul><details class="code-details"><summary>View example code ↗</summary>' + codeBlock(work.code, work.codeFilename, work.id) + '</details></div></details>';
  }).join('');
  const summaries = [
    'Building cloud-native AEM Assets workflows, tuning Oak indexes, and developing backend integrations. Delivering through Adobe Cloud Manager.',
    'Developed reusable components, editable templates, and backend services across AEMaaCS and AEM 6.5, working closely with designers and content authors.',
    'Delivered multi-country AEM Sites for Castrol and BP, including content migration, launch support, and GA4 / GTM analytics integration.'
  ];
  $('experience-list').innerHTML = data.experiences.map((job, index) => '<article class="job"><div class="job-heading"><h3>' + escape(job.company) + '</h3><span class="job-period">' + escape(job.period) + '</span></div><div class="job-role">' + escape(job.role) + ' · ' + escape(job.envTag) + '</div><p>' + summaries[index] + '</p><details><summary>Role details +</summary><ul>' + job.highlights.map(item => '<li>' + escape(item) + '</li>').join('') + '</ul></details></article>').join('');
  const categories = [...new Set(data.skills.map(skill => skill.category))];
  const categoryNames = ['AEM platforms', 'Backend & content', 'Front end', 'Build & delivery', 'Analytics'];
  $('skills-list').innerHTML = categories.map((category, index) => '<div class="skill-row"><h3>' + categoryNames[index] + '</h3><p>' + data.skills.filter(skill => skill.category === category).map(skill => escape(skill.name)).join(' · ') + '</p></div>').join('');
  $('skill-select').innerHTML = data.skills.map(skill => '<option value="' + escape(skill.id) + '">' + escape(skill.name) + '</option>').join('');
  function renderSkill() {
    const skill = data.skills.find(item => item.id === $('skill-select').value);
    const key = 'skill-' + skill.id;
    copyValues[key] = skill.snippet;
    $('skill-detail').innerHTML = '<p>' + escape(skill.summary) + '</p>' + codeBlock(skill.snippet, 'Illustrative implementation', key);
  }
  $('skill-select').addEventListener('change', renderSkill);
  renderSkill();
  $('education-list').innerHTML = data.education.map(item => '<div class="credential"><h4>' + escape(item.degree) + '</h4><p>' + escape(item.institution) + '<br>' + escape(item.period) + '</p></div>').join('');
  $('awards-list').innerHTML = data.achievements.map(item => '<div class="credential"><h4>' + escape(item.title) + '</h4><p>' + escape(item.subtitle) + '</p></div>').join('');
  $('oak-scenario').innerHTML = Object.entries(data.oakScenarios).map(([key, item]) => '<option value="' + key + '">' + escape(item.label) + '</option>').join('');
  function renderLab() {
    const scenario = data.oakScenarios[$('oak-scenario').value];
    const mode = scenario.modes[$('oak-mode').value];
    copyValues.query = scenario.sql2;
    $('oak-output').innerHTML = codeBlock(scenario.sql2, 'JCR-SQL2 query', 'query') + '<dl class="lab-results"><div><dt>Nodes / entries read</dt><dd>' + escape(mode.nodesScanned) + '</dd></div><div><dt>Simulated execution time</dt><dd>' + escape(mode.execTime) + '</dd></div></dl><p>' + escape(mode.status) + '</p><pre class="query-code" tabindex="0" aria-label="Illustrative query plan"><code>' + escape(mode.plan) + '</code></pre>';
  }
  $('oak-scenario').addEventListener('change', renderLab);
  $('oak-mode').addEventListener('change', renderLab);
  renderLab();
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-copy]');
    if (button) copy(copyValues[button.dataset.copy]);
  });
  $('copy-email').addEventListener('click', () => copy(data.profile.email));
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const next = theme === 'dark' ? 'light' : 'dark';
    $('theme-toggle').textContent = next === 'dark' ? 'Dark mode' : 'Light mode';
    $('theme-toggle').setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
  let initialTheme = 'light';
  try { const stored = localStorage.getItem('saurav_portfolio_theme'); if (stored === 'dark' || stored === 'light') initialTheme = stored; } catch (_) {}
  applyTheme(initialTheme);
  $('theme-toggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('saurav_portfolio_theme', theme); } catch (_) {}
  });
  function closeMenu() { $('main-nav').classList.remove('is-open'); $('menu-toggle').setAttribute('aria-expanded', 'false'); }
  $('menu-toggle').addEventListener('click', () => {
    const open = $('main-nav').classList.toggle('is-open');
    $('menu-toggle').setAttribute('aria-expanded', String(open));
  });
  $('main-nav').addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('main-nav').classList.contains('is-open')) { closeMenu(); $('menu-toggle').focus(); } });
  $('year').textContent = new Date().getFullYear();
})();
