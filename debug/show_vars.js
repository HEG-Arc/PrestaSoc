function addDebug(e) {
  const debug = document.createElement('div');
  debug.style.color = 'red';
  debug.style.fontWeight = 'bold';
  debug.innerText = e.getAttribute('var') || e.getAttribute('ng-model');
  e.appendChild(debug);
}
document.querySelectorAll('base-input-container').forEach(addDebug);
document.querySelectorAll('base-checkbox').forEach(addDebug);
document.querySelectorAll('[ng-model]').forEach(addDebug);
