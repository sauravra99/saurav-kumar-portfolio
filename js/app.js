// Interactive Application Logic for Saurav Kumar's Portfolio Website
(function () {
  'use strict';

  var state = {
    theme: 'dark',
    skillCategory: 'All',
    skillSearch: '',
    selectedSkillId: 'aemaacs',
    expFilter: 'All',
    expSearch: '',
    activeBlueprintId: 'dam-workflow',
    activeBlueprintTab: 'overview',
    oakScenario: 'dam-approved',
    oakMode: 'lucene',
    chartInstance: null
  };

  function showToast(message) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'flex items-center gap-2.5 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-xl border border-indigo-400/40 transition-all duration-300 transform translate-y-0 opacity-100';
    toast.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-cyan-300"></span><span>' + escapeHtml(message) + '</span>';
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2800);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function copyTextToClipboard(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(label || 'Copied to clipboard!');
      }).catch(function () {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  }

  function fallbackCopy(text, label) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast(label || 'Copied to clipboard!');
    } catch (err) {
      showToast('Copy ready: ' + text);
    }
    document.body.removeChild(ta);
  }

  // Theme Toggle
  function applyTheme() {
    var body = document.body;
    var label = document.getElementById('theme-toggle-label');
    if (state.theme === 'light') {
      body.classList.add('light-mode');
      if (label) label.textContent = 'Dark';
    } else {
      body.classList.remove('light-mode');
      if (label) label.textContent = 'Light';
    }
    renderSkillsChart();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('saurav_portfolio_theme', state.theme);
    } catch (e) {}
    applyTheme();
    showToast('Switched to ' + (state.theme === 'light' ? 'Light' : 'Dark') + ' theme');
  }

  // Skills Matrix & Detail Inspector
  function renderSkills() {
    var data = window.PORTFOLIO_DATA.skills;
    var grid = document.getElementById('skills-grid');
    var countBadge = document.getElementById('skills-count-badge');
    if (!grid) return;

    var q = state.skillSearch.trim().toLowerCase();
    var filtered = data.filter(function (s) {
      var catMatch = state.skillCategory === 'All' || s.category === state.skillCategory;
      var qMatch = !q ||
        s.name.toLowerCase().indexOf(q) !== -1 ||
        s.summary.toLowerCase().indexOf(q) !== -1 ||
        s.category.toLowerCase().indexOf(q) !== -1;
      return catMatch && qMatch;
    });

    if (countBadge) {
      countBadge.textContent = filtered.length + ' of ' + data.length + ' skill modules';
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="col-span-full p-6 rounded-xl glass-panel text-center text-slate-400">No skills match your current filter. Click "Reset Filters" to view all AEM & backend competencies.</div>';
      return;
    }

    // Ensure selectedSkillId is valid
    var activeSkill = data.find(function (s) { return s.id === state.selectedSkillId; }) || filtered[0];
    state.selectedSkillId = activeSkill.id;

    grid.innerHTML = filtered.map(function (skill) {
      var isSelected = skill.id === state.selectedSkillId;
      var borderClass = isSelected
        ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/30'
        : 'border-white/10 hover:border-cyan-400/50';
      return (
        '<button type="button" data-skill-id="' + skill.id + '" ' +
        'class="skill-card-btn text-left p-4 rounded-xl glass-panel transition-all duration-200 flex flex-col justify-between ' + borderClass + '">' +
          '<div>' +
            '<div class="flex items-start justify-between gap-2 mb-2">' +
              '<span class="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">' + escapeHtml(skill.category) + '</span>' +
              '<span class="text-xs font-mono-code text-cyan-400 font-semibold">' + escapeHtml(skill.years) + '</span>' +
            '</div>' +
            '<h4 class="text-base font-bold text-white theme-heading mb-1">' + escapeHtml(skill.name) + '</h4>' +
            '<p class="text-xs text-slate-300 theme-text-muted line-clamp-2">' + escapeHtml(skill.summary) + '</p>' +
          '</div>' +
          '<div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">' +
            '<div class="flex flex-wrap gap-1">' +
              skill.usedAt.map(function (co) {
                return '<span class="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">' + escapeHtml(co) + '</span>';
              }).join('') +
            '</div>' +
            '<span class="text-xs font-medium text-indigo-400">' + (isSelected ? 'Inspecting ●' : 'Inspect →') + '</span>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    grid.querySelectorAll('.skill-card-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.selectedSkillId = btn.getAttribute('data-skill-id');
        renderSkills();
        renderSkillDetail();
      });
    });

    renderSkillDetail();
  }

  function renderSkillDetail() {
    var panel = document.getElementById('skill-inspector-panel');
    if (!panel) return;
    var skill = window.PORTFOLIO_DATA.skills.find(function (s) { return s.id === state.selectedSkillId; }) || window.PORTFOLIO_DATA.skills[0];

    panel.innerHTML =
      '<div class="flex flex-wrap items-center justify-between gap-2 mb-3">' +
        '<span class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">' + escapeHtml(skill.category) + '</span>' +
        '<span class="text-xs font-mono-code px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300">Experience: ' + escapeHtml(skill.years) + '</span>' +
      '</div>' +
      '<h3 class="text-xl font-bold text-white theme-heading mb-2">' + escapeHtml(skill.name) + '</h3>' +
      '<p class="text-sm text-slate-300 theme-text-muted leading-relaxed mb-4">' + escapeHtml(skill.summary) + '</p>' +
      '<div class="mb-4">' +
        '<div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Applied In Production At</div>' +
        '<div class="flex flex-wrap gap-2">' +
          skill.usedAt.map(function (c) {
            return '<span class="text-xs font-medium px-3 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-cyan-500/20">' + escapeHtml(c) + '</span>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div>' +
        '<div class="flex items-center justify-between mb-1.5">' +
          '<span class="text-xs font-mono-code text-slate-400">Production Implementation Snippet</span>' +
          '<button type="button" id="copy-skill-snippet-btn" class="text-xs px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-white font-medium transition">Copy Snippet</button>' +
        '</div>' +
        '<pre class="p-3.5 rounded-xl bg-slate-950 text-cyan-200 font-mono-code text-xs overflow-x-auto code-scroll border border-white/10"><code>' + escapeHtml(skill.snippet) + '</code></pre>' +
      '</div>';

    var copyBtn = document.getElementById('copy-skill-snippet-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyTextToClipboard(skill.snippet, 'Copied ' + skill.name + ' code snippet!');
      });
    }
  }

  // Chart.js Competency Chart
  function renderSkillsChart() {
    var canvas = document.getElementById('competencyChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (state.chartInstance) {
      state.chartInstance.destroy();
      state.chartInstance = null;
    }

    var isLight = state.theme === 'light';
    var textColor = isLight ? '#334155' : '#cbd5e1';
    var gridColor = isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.1)';

    var ctx = canvas.getContext('2d');
    state.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'AEM 6.5 On-Prem (4+ Yrs)',
          'AEMaaCS Cloud (1+ Yr)',
          'AEM Assets / DAM',
          'Java / OSGi / Sling',
          'Oak Indexing & JCR',
          'Editable Templates / HTL',
          'GA4 / GTM / Looker Studio'
        ],
        datasets: [{
          label: 'Production Depth Score (%)',
          data: [96, 92, 95, 95, 93, 94, 88],
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(52, 211, 153, 0.8)',
            'rgba(129, 140, 248, 0.8)',
            'rgba(34, 211, 238, 0.8)',
            'rgba(167, 139, 250, 0.8)',
            'rgba(244, 114, 182, 0.8)'
          ],
          borderColor: [
            '#6366f1',
            '#06b6d4',
            '#34d399',
            '#818cf8',
            '#22d3ee',
            '#a78bfa',
            '#f472b6'
          ],
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctxItem) {
                return ' Competency Index: ' + ctxItem.raw + '%';
              }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 11, weight: '600' } }
          }
        }
      }
    });
  }

  // Work Experience Timeline Renderer
  function renderExperience() {
    var listEl = document.getElementById('experience-timeline');
    if (!listEl) return;
    var q = state.expSearch.trim().toLowerCase();

    var filtered = window.PORTFOLIO_DATA.experiences.filter(function (exp) {
      var envMatch = true;
      if (state.expFilter === 'AEMaaCS') {
        envMatch = exp.environment.indexOf('Cloud') !== -1 || exp.environment.indexOf('AEMaaCS') !== -1;
      } else if (state.expFilter === 'AEM 6.5') {
        envMatch = exp.environment.indexOf('6.5') !== -1;
      }
      var textBlob = (exp.role + ' ' + exp.company + ' ' + exp.environment + ' ' + exp.highlights.join(' ') + ' ' + exp.techTags.join(' ')).toLowerCase();
      var qMatch = !q || textBlob.indexOf(q) !== -1;
      return envMatch && qMatch;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="p-6 rounded-xl glass-panel text-center text-slate-400">No work experience entries match that filter. Click "All Environments" to reset.</div>';
      return;
    }

    listEl.innerHTML = filtered.map(function (exp) {
      return (
        '<article class="relative pl-6 sm:pl-8 pb-8 border-l-2 border-indigo-500/40 last:pb-0">' +
          '<div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full ' + (exp.current ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-indigo-500') + '"></div>' +
          '<div class="glass-panel rounded-2xl p-5 sm:p-6 transition hover:border-indigo-400/40">' +
            '<div class="flex flex-wrap items-start justify-between gap-3 mb-3">' +
              '<div>' +
                '<div class="flex flex-wrap items-center gap-2">' +
                  '<h3 class="text-lg sm:text-xl font-bold text-white theme-heading">' + escapeHtml(exp.role) + ' <span class="text-indigo-400">@ ' + escapeHtml(exp.company) + '</span></h3>' +
                  (exp.current ? '<span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Current Role</span>' : '') +
                '</div>' +
                '<p class="text-xs sm:text-sm font-medium text-cyan-400 mt-0.5">Environment: ' + escapeHtml(exp.environment) + '</p>' +
              '</div>' +
              '<span class="text-xs font-mono-code px-3 py-1 rounded-lg bg-slate-800/90 text-slate-200 border border-white/10">' + escapeHtml(exp.period) + '</span>' +
            '</div>' +
            '<ul class="space-y-2.5 text-sm text-slate-300 theme-text-muted mb-4">' +
              exp.highlights.map(function (bullet) {
                return (
                  '<li class="flex items-start gap-2.5">' +
                    '<span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>' +
                    '<span>' + escapeHtml(bullet) + '</span>' +
                  '</li>'
                );
              }).join('') +
            '</ul>' +
            '<div class="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">' +
              exp.techTags.map(function (tag) {
                return '<span class="text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">' + escapeHtml(tag) + '</span>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  // Architectural Blueprints & Code Viewer
  function renderBlueprints() {
    var tabsEl = document.getElementById('blueprint-selector-tabs');
    var detailEl = document.getElementById('blueprint-detail-view');
    if (!tabsEl || !detailEl) return;

    var blueprints = window.PORTFOLIO_DATA.blueprints;
    var current = blueprints.find(function (b) { return b.id === state.activeBlueprintId; }) || blueprints[0];

    tabsEl.innerHTML = blueprints.map(function (b) {
      var active = b.id === current.id;
      return (
        '<button type="button" data-blueprint-id="' + b.id + '" ' +
        'class="blueprint-select-btn text-left p-4 rounded-xl transition-all border ' +
        (active ? 'bg-indigo-600/25 border-indigo-400 text-white shadow-lg' : 'glass-panel border-white/10 text-slate-300 hover:border-white/25') + '">' +
          '<div class="text-[11px] font-mono-code uppercase tracking-wider text-cyan-400 mb-1">' + escapeHtml(b.category) + '</div>' +
          '<div class="text-sm font-bold text-white theme-heading leading-snug">' + escapeHtml(b.title) + '</div>' +
          '<div class="text-xs text-slate-400 mt-1">' + escapeHtml(b.org) + '</div>' +
        '</button>'
      );
    }).join('');

    tabsEl.querySelectorAll('.blueprint-select-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.activeBlueprintId = btn.getAttribute('data-blueprint-id');
        renderBlueprints();
      });
    });

    detailEl.innerHTML =
      '<div class="glass-panel rounded-2xl p-5 sm:p-6">' +
        '<div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">' +
          '<div>' +
            '<span class="text-xs font-mono-code text-cyan-400">' + escapeHtml(current.org) + '</span>' +
            '<h3 class="text-xl font-bold text-white theme-heading mt-0.5">' + escapeHtml(current.title) + '</h3>' +
          '</div>' +
          '<div class="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-white/10">' +
            '<button type="button" data-bp-tab="overview" class="bp-mode-btn px-3 py-1.5 rounded-lg text-xs font-semibold transition ' + (state.activeBlueprintTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white') + '">Architecture Overview</button>' +
            '<button type="button" data-bp-tab="code" class="bp-mode-btn px-3 py-1.5 rounded-lg text-xs font-semibold transition ' + (state.activeBlueprintTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white') + '">Code Blueprint</button>' +
          '</div>' +
        '</div>' +
        (state.activeBlueprintTab === 'overview'
          ? (
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">' +
              '<div class="p-4 rounded-xl bg-slate-900/60 border border-white/10 theme-subsurface">' +
                '<div class="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">Enterprise Challenge</div>' +
                '<p class="text-sm text-slate-300 theme-text-muted leading-relaxed">' + escapeHtml(current.problem) + '</p>' +
              '</div>' +
              '<div class="p-4 rounded-xl bg-slate-900/60 border border-white/10 theme-subsurface">' +
                '<div class="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">AEM Architectural Solution</div>' +
                '<p class="text-sm text-slate-300 theme-text-muted leading-relaxed">' + escapeHtml(current.solution) + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="mb-4">' +
              '<div class="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5">Key Deliverables & Production Outcomes</div>' +
              '<ul class="space-y-2 text-sm text-slate-300 theme-text-muted">' +
                current.outcomes.map(function (o) {
                  return '<li class="flex items-start gap-2.5"><span class="text-emerald-400 font-bold">✓</span><span>' + escapeHtml(o) + '</span></li>';
                }).join('') +
              '</ul>' +
            '</div>' +
            '<div class="pt-3 border-t border-white/10 flex items-center justify-between">' +
              '<span class="text-xs font-mono-code text-slate-400">Reference File: ' + escapeHtml(current.codeFilename) + '</span>' +
              '<button type="button" id="switch-to-code-btn" class="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Inspect Code Implementation →</button>' +
            '</div>'
          )
          : (
            '<div>' +
              '<div class="flex items-center justify-between bg-slate-900 px-4 py-2.5 rounded-t-xl border border-b-0 border-white/10">' +
                '<span class="text-xs font-mono-code text-cyan-300">' + escapeHtml(current.codeFilename) + '</span>' +
                '<button type="button" id="copy-blueprint-code-btn" class="text-xs px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition">Copy Blueprint Code</button>' +
              '</div>' +
              '<pre class="p-4 rounded-b-xl bg-slate-950 text-slate-200 font-mono-code text-xs overflow-x-auto code-scroll border border-white/10 max-h-96"><code>' + escapeHtml(current.code) + '</code></pre>' +
            '</div>'
          )
        ) +
      '</div>';

    detailEl.querySelectorAll('.bp-mode-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.activeBlueprintTab = btn.getAttribute('data-bp-tab');
        renderBlueprints();
      });
    });

    var switchBtn = document.getElementById('switch-to-code-btn');
    if (switchBtn) {
      switchBtn.addEventListener('click', function () {
        state.activeBlueprintTab = 'code';
        renderBlueprints();
      });
    }

    var copyCodeBtn = document.getElementById('copy-blueprint-code-btn');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', function () {
        copyTextToClipboard(current.code, 'Copied ' + current.codeFilename + ' to clipboard!');
      });
    }
  }

  // Interactive JCR Query & Oak Index Tuner Sandbox
  function renderOakSimulator() {
    var container = document.getElementById('oak-simulator-output');
    if (!container) return;
    var scenarioObj = window.PORTFOLIO_DATA.oakScenarios[state.oakScenario];
    var modeObj = scenarioObj.modes[state.oakMode];

    container.innerHTML =
      '<div class="space-y-4">' +
        '<div class="p-3.5 rounded-xl bg-slate-950 border border-white/10">' +
          '<div class="flex items-center justify-between mb-1">' +
            '<span class="text-[11px] font-mono-code uppercase tracking-wider text-indigo-400">Executed JCR-SQL2 Query</span>' +
            '<button type="button" id="copy-sql2-btn" class="text-[11px] font-mono-code text-cyan-400 hover:underline">Copy Query</button>' +
          '</div>' +
          '<p class="font-mono-code text-xs text-slate-200 break-words">' + escapeHtml(scenarioObj.sql2) + '</p>' +
        '</div>' +
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">' +
          '<div class="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 theme-subsurface">' +
            '<div class="text-xs text-slate-400">Nodes / Entries Read</div>' +
            '<div class="text-sm font-bold text-white theme-heading mt-0.5">' + escapeHtml(modeObj.nodesScanned) + '</div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 theme-subsurface">' +
            '<div class="text-xs text-slate-400">Simulated JCR Execution Time</div>' +
            '<div class="text-sm font-bold text-cyan-400 mt-0.5">' + escapeHtml(modeObj.execTime) + '</div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 theme-subsurface">' +
            '<div class="text-xs text-slate-400 mb-1">Repository Traversal Load</div>' +
            '<div class="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">' +
              '<div class="h-full rounded-full transition-all duration-300 ' + (modeObj.costScore > 60 ? 'bg-rose-500' : (modeObj.costScore > 20 ? 'bg-cyan-400' : 'bg-emerald-400')) + '" style="width: ' + modeObj.costScore + '%"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="p-3.5 rounded-xl border text-xs font-medium ' + modeObj.statusClass + '">' +
          escapeHtml(modeObj.status) +
        '</div>' +
        '<div class="p-3.5 rounded-xl bg-slate-950 border border-white/10">' +
          '<div class="text-[11px] font-mono-code uppercase tracking-wider text-slate-400 mb-1">Oak Query Explanation Plan</div>' +
          '<p class="font-mono-code text-xs text-emerald-300 break-words">' + escapeHtml(modeObj.plan) + '</p>' +
        '</div>' +
      '</div>';

    var copySqlBtn = document.getElementById('copy-sql2-btn');
    if (copySqlBtn) {
      copySqlBtn.addEventListener('click', function () {
        copyTextToClipboard(scenarioObj.sql2, 'Copied JCR-SQL2 query to clipboard!');
      });
    }
  }

  // Contact Composer & Modals
  function initContactAndModals() {
    var form = document.getElementById('recruiter-contact-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('sender-name').value || 'Hiring Team').trim();
        var company = (document.getElementById('sender-company').value || 'Enterprise Organization').trim();
        var roleType = document.getElementById('sender-role-type').value;
        var notes = (document.getElementById('sender-message').value || '').trim();

        var subject = roleType + ' Opportunity for Saurav Kumar (' + company + ')';
        var body =
          'Hi Saurav,\n\n' +
          'I reviewed your AEM Developer portfolio and 5+ years of experience across AEM as a Cloud Service (AEMaaCS) at Capgemini, Aventior Digital, and AEM 6.5 at Wipro.\n\n' +
          'We are looking for a ' + roleType + ' at ' + company + '.\n' +
          (notes ? '\nAdditional Details:\n' + notes + '\n' : '') +
          '\nBest regards,\n' + name + ' (' + company + ')';

        var previewBox = document.getElementById('composed-outreach-preview');
        var previewText = document.getElementById('composed-outreach-text');
        var mailtoLink = document.getElementById('composed-mailto-link');
        if (previewBox && previewText && mailtoLink) {
          previewText.textContent = 'Subject: ' + subject + '\n\n' + body;
          mailtoLink.setAttribute('href', 'mailto:sauravraj32424@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
          previewBox.classList.remove('hidden');
          showToast('Prepared outreach message for Saurav Kumar!');
        }
      });
    }

    var copyOutreachBtn = document.getElementById('copy-outreach-btn');
    if (copyOutreachBtn) {
      copyOutreachBtn.addEventListener('click', function () {
        var txt = document.getElementById('composed-outreach-text');
        if (txt) copyTextToClipboard(txt.textContent, 'Outreach message copied to clipboard!');
      });
    }

    // Resume Modal
    var openResumeBtns = document.querySelectorAll('.open-resume-modal-btn');
    var closeResumeBtn = document.getElementById('close-resume-modal-btn');
    var resumeModal = document.getElementById('resume-modal');
    var printResumeBtn = document.getElementById('print-resume-btn');

    openResumeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (resumeModal) resumeModal.classList.remove('hidden');
      });
    });

    if (closeResumeBtn && resumeModal) {
      closeResumeBtn.addEventListener('click', function () {
        resumeModal.classList.add('hidden');
      });
    }

    if (printResumeBtn) {
      printResumeBtn.addEventListener('click', function () {
        window.print();
      });
    }
  }

  function initEventListeners() {
    // Theme button
    var themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Mobile Menu
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-nav-drawer');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
      });
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.add('hidden');
        });
      });
    }

    // Copy buttons (Email, Phone, LinkedIn)
    document.querySelectorAll('[data-copy-value]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-copy-value');
        var label = btn.getAttribute('data-copy-label') || 'Copied!';
        copyTextToClipboard(val, label);
      });
    });

    // Skill Category Buttons
    document.querySelectorAll('.skill-cat-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.skillCategory = btn.getAttribute('data-cat');
        document.querySelectorAll('.skill-cat-btn').forEach(function (b) {
          if (b.getAttribute('data-cat') === state.skillCategory) {
            b.className = 'skill-cat-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition bg-indigo-600 text-white shadow';
          } else {
            b.className = 'skill-cat-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition glass-panel text-slate-300 hover:text-white';
          }
        });
        renderSkills();
      });
    });

    var skillSearchInput = document.getElementById('skill-search-input');
    if (skillSearchInput) {
      skillSearchInput.addEventListener('input', function (e) {
        state.skillSearch = e.target.value;
        renderSkills();
      });
    }

    var resetSkillBtn = document.getElementById('reset-skill-filter-btn');
    if (resetSkillBtn) {
      resetSkillBtn.addEventListener('click', function () {
        state.skillCategory = 'All';
        state.skillSearch = '';
        if (skillSearchInput) skillSearchInput.value = '';
        document.querySelectorAll('.skill-cat-btn').forEach(function (b) {
          if (b.getAttribute('data-cat') === 'All') {
            b.className = 'skill-cat-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition bg-indigo-600 text-white shadow';
          } else {
            b.className = 'skill-cat-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition glass-panel text-slate-300 hover:text-white';
          }
        });
        renderSkills();
      });
    }

    // Experience environment filter buttons
    document.querySelectorAll('.exp-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.expFilter = btn.getAttribute('data-exp-filter');
        document.querySelectorAll('.exp-filter-btn').forEach(function (b) {
          if (b.getAttribute('data-exp-filter') === state.expFilter) {
            b.className = 'exp-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition bg-indigo-600 text-white shadow';
          } else {
            b.className = 'exp-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition glass-panel text-slate-300 hover:text-white';
          }
        });
        renderExperience();
      });
    });

    var expSearchInput = document.getElementById('exp-search-input');
    if (expSearchInput) {
      expSearchInput.addEventListener('input', function (e) {
        state.expSearch = e.target.value;
        renderExperience();
      });
    }

    // Oak Simulator Controls
    var oakScenarioSelect = document.getElementById('oak-scenario-select');
    if (oakScenarioSelect) {
      oakScenarioSelect.addEventListener('change', function (e) {
        state.oakScenario = e.target.value;
        renderOakSimulator();
      });
    }

    document.querySelectorAll('.oak-mode-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.oakMode = btn.getAttribute('data-oak-mode');
        document.querySelectorAll('.oak-mode-btn').forEach(function (b) {
          if (b.getAttribute('data-oak-mode') === state.oakMode) {
            b.className = 'oak-mode-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition bg-cyan-500 text-slate-950 shadow';
          } else {
            b.className = 'oak-mode-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition bg-slate-800 text-slate-300 hover:text-white';
          }
        });
        renderOakSimulator();
      });
    });

    initContactAndModals();
  }

  window.addEventListener('DOMContentLoaded', function () {
    try {
      var savedTheme = localStorage.getItem('saurav_portfolio_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        state.theme = savedTheme;
      }
    } catch (e) {}

    initEventListeners();
    renderSkills();
    renderExperience();
    renderBlueprints();
    renderOakSimulator();
    applyTheme();
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  });
})();
