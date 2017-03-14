function addDebug(e) {
  const debug = document.createElement('div');
  debug.style.color = '#D32F2F';
  debug.style.fontWeight = 'bold';
  debug.innerText = e.getAttribute('var') || e.getAttribute('ng-model');
  if (debug.innerText !== '$ctrl.model[$ctrl.attribute]') {
    e.appendChild(debug);
    e.classList.add('debug');
  }
}

const debugStyle = document.createElement('style');
debugStyle.innerText = '.debug {border: 1px solid #D32F2F;margin-bottom: 8px;padding: 4px;}';
document.head.appendChild(debugStyle);
document.querySelectorAll('base-input-container').forEach(addDebug);
document.querySelectorAll('base-checkbox').forEach(addDebug);
document.querySelectorAll('[ng-model]').forEach(addDebug);
