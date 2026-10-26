(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let report = null;
  let filter = 'all';
  const labels = { healthy: 'Healthy', broken: 'Broken', redirected: 'Redirected', unverified: 'Unverified' };
  function renderRows() {
    const query = $('search').value.trim().toLowerCase();
    const rows = report.results.filter(row => (filter === 'all' || row.status === filter) && (row.url + ' ' + (row.final_url || '')).toLowerCase().includes(query));
    $('rows').replaceChildren();
    rows.forEach(row => {
      const tr = document.createElement('tr');
      const destination = document.createElement('td');
      const link = document.createElement('a');
      link.textContent = row.url;
      link.href = row.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      destination.append(link);
      const detail = document.createElement('small');
      detail.textContent = row.detail + (row.final_url && row.final_url !== row.url ? ' → ' + row.final_url : '');
      destination.append(detail);
      const status = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = 'badge ' + row.status;
      badge.textContent = labels[row.status];
      status.append(badge);
      const code = document.createElement('td');
      code.textContent = row.code || '—';
      tr.append(destination, status, code);
      $('rows').append(tr);
    });
    $('empty').hidden = rows.length > 0;
  }
  $('scan-form').addEventListener('submit', async event => {
    event.preventDefault();
    const input = $('url').value.trim();
    let parsed;
    try { parsed = new URL(input); } catch (_) { return; }
    $('error').hidden = true;
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      $('error').textContent = 'Enter an http:// or https:// page URL.';
      $('error').hidden = false;
      return;
    }
    $('scan-button').disabled = true;
    $('scan-button').textContent = 'Checking links…';
    $('url').disabled = true;
    $('results').hidden = true;
    $('status').className = 'loading';
    $('status').textContent = 'Reading the page and checking its links. This can take about a minute.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 85000);
    try {
      const response = await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: input }), signal: controller.signal });
      const data = await response.json().catch(() => {
        throw new Error(`The checker returned an invalid response (HTTP ${response.status}). Please try again shortly.`);
      });
      if (!response.ok) throw new Error(data.error || 'The scan failed. Please try again.');
      report = data;
      filter = 'all';
      $('search').value = '';
      document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
      $('scan-summary').textContent = `${data.checked} unique links checked on ${data.page_url}`;
      $('metrics').replaceChildren();
      Object.entries(labels).forEach(([key, label]) => {
        const metric = document.createElement('div'); metric.className = 'metric';
        const count = document.createElement('strong'); count.textContent = data.results.filter(row => row.status === key).length;
        const text = document.createElement('span'); text.textContent = label;
        metric.append(count, text); $('metrics').append(metric);
      });
      $('report-note').textContent = `${data.skipped} non-web, fragment-only, empty, or unsupported links skipped. ${data.limited ? `Showing the first 100 of ${data.found} unique URLs. ` : ''}Unverified links may be blocked, rate limited, unreachable, or timed out; they are not confirmed broken.`;
      renderRows();
      $('results').hidden = false;
      $('status').textContent = data.checked ? 'Scan complete. Your report is ready below.' : 'Scan complete. No checkable links were found in this page’s HTML.';
    } catch (error) {
      $('status').textContent = '';
      $('error').textContent = error.name === 'AbortError' ? 'The scan timed out. Please try again shortly.' : (error instanceof TypeError ? 'Cannot reach the checker. Check your connection and try again shortly.' : error.message);
      $('error').hidden = false;
    } finally {
      clearTimeout(timeout);
      $('status').className = '';
      $('scan-button').disabled = false;
      $('scan-button').textContent = 'Check links ↗';
      $('url').disabled = false;
    }
  });
  $('filters').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderRows();
  });
  $('search').addEventListener('input', () => { if (report) renderRows(); });
  $('export').addEventListener('click', () => {
    if (!report) return;
    const cell = value => '"' + String(value ?? '').replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""') + '"';
    const rows = [['URL', 'Status', 'HTTP', 'Final URL', 'Details'], ...report.results.map(row => [row.url, labels[row.status], row.code, row.final_url, row.detail])];
    const blob = new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'link-report.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
