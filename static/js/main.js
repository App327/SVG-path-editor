window.onmouseover = function(event) {
 let text = event.target.dataset.tooltip;
 let tooltip = document.getElementsByClassName('tooltip')[0];
 if (text !== undefined) {
  tooltip.innerHTML = text;
  let x = event.clientX;
  let y = event.clientY;
  tooltip.style.top = y + 'px';
  tooltip.style.left = x + 'px';
  tooltip.style.display = 'block';
 } else if (!event.target.closest('[data-tooltip]')) {
  tooltip.style.display = 'none';
 }
 window.onmousemove = function(event) {
  let x = event.clientX;
  let y = event.clientY;
  tooltip.style.top = y + 'px';
  tooltip.style.left = x + 'px';
 }
}

let loader = document.getElementById('app-loader');
let ac = document.getElementById('app-content');
let al_l = document.getElementById('al-l');

window.onload = function() {
 setTimeout(() => al_l.value = '0.7', 300);
 setTimeout(appLoadFinish, 1000);
}

function appLoadFinish() {
 al_l.value = '1.0';
 setTimeout(showApp, 500);
}

function showApp() {
 loader.style.display = 'none';
 ac.style.display = 'block';
}

let svg = document.getElementById('svg');
let svgPath = document.getElementById('svg-path');
let pathCopyBtn = document.getElementById('path-copy-btn');
let pathPasteBtn = document.getElementById('path-paste-btn');
let pathSelectBtn = document.getElementById('path-select-btn');
let pathClearBtn = document.getElementById('path-clear-btn');
let outputRefreshBtn = document.getElementById('output-refresh-btn');
let outputDownloadBtn = document.getElementById('output-download-btn');
let outputOpenBtn = document.getElementById('output-open-btn');
let paramResetBtn = document.getElementById('parameters-reset-btn');
let paramFillCb = document.getElementById('param-fill-cb');
let paramFillColor = document.getElementById('param-fill-color');
let paramStrokeCb = document.getElementById('param-stroke-cb');
let paramStrokeColor = document.getElementById('param-stroke-color');
let paramStrokeWidthCb = document.getElementById('param-stroke_width-cb');
let paramStrokeWidth = document.getElementById('param-stroke_width');
let paramSvgWidth = document.getElementById('param-svg-width');
let paramSvgHeight = document.getElementById('param-svg-height');
let paramHighlightCb = document.getElementById('param-highlight-cb');
let svgPathInput = document.getElementById('svg-path-input');
let clearConfirmDialog = document.getElementById('clear-confirm-dialog');
let pasteConfirmDialog = document.getElementById('paste-confirm-dialog');
let highlight = document.getElementById('size-hl');
let dataLink = document.getElementById('data-dialog');
let dataLinkURL = document.getElementById('data-link-open-btn');
let dataDialogCopyBtn = document.getElementById('data-dialog-copy-btn');
let resetParamsConfirm = document.getElementById('reset-params-confirm-dialog');
let resetParamsBtn = document.getElementById('parameters-reset-btn');
let unsupWarn = document.getElementById('unsupported-warn-dialog');

let pathPaste = '';
let pathPasteC = false;

let useHightlight = false;

let dataLnk = '';

function refreshOutput() {
 svg.setAttribute('height', paramSvgHeight.value);
 svg.setAttribute('width', paramSvgWidth.value);
 if (paramFillCb.checked == true) {
  paramFillColor.removeAttribute('disabled');
  svgPath.setAttribute('fill', paramFillColor.value);
 } else if (paramFillCb.checked == false) {
  paramFillColor.setAttribute('disabled', '');
  svgPath.removeAttribute('fill');
 }
 if (paramStrokeCb.checked == true) {
  paramStrokeColor.removeAttribute('disabled');
  svgPath.setAttribute('stroke', paramStrokeColor.value);
 } else if (paramStrokeCb.checked == false) {
  paramStrokeColor.setAttribute('disabled', '');
  svgPath.removeAttribute('stroke');
 }
 if (paramStrokeWidthCb.checked == true) {
  paramStrokeWidth.removeAttribute('disabled');
  svgPath.setAttribute('stroke-width', paramStrokeWidth.value);
 } else if (paramStrokeWidthCb.checked == false) {
  paramStrokeWidth.setAttribute('disabled', '');
  svgPath.removeAttribute('stroke-width');
 }
 if (paramHighlightCb.checked == true) {
  useHighlight = true;
  highlight.style.display = 'block';
 } else if (paramHighlightCb.checked == false) {
  useHighlight = false;
  highlight.style.display = 'none';
 }
 svgPath.setAttribute('d', svgPathInput.value);
}

function refreshParams() {
 if (paramFillCb.checked == true) {
  paramFillColor.removeAttribute('disabled');
 } else if (paramFillCb.checked == false) {
  paramFillColor.setAttribute('disabled', '');
 }
 if (paramStrokeCb.checked == true) {
  paramStrokeColor.removeAttribute('disabled');
 } else if (paramStrokeCb.checked == false) {
  paramStrokeColor.setAttribute('disabled', '');
 }
 if (paramStrokeWidthCb.checked == true) {
  paramStrokeWidth.removeAttribute('disabled');
 } else if (paramStrokeWidthCb.checked == false) {
  paramStrokeWidth.setAttribute('disabled', '');
 }
}

paramFillCb.onchange = refreshParams;
paramStrokeCb.onchange = refreshParams;
paramStrokeWidthCb.onchange = refreshParams;

svgPathInput.oninput = refreshOutput;
svgPathInput.onchange = refreshOutput;
svgPathInput.onfocus = refreshOutput;
svgPathInput.onblur = refreshOutput;
svgPathInput.onclick = refreshOutput;


function selectPath() {
 svgPathInput.select();
}

function copyPath() {
 if ('clipboard' in navigator) {
  navigator.clipboard.writeText(svgPathInput.value).then(copyPathOK).catch(copyPathErr);
 } else {
  selectPath();
  let c = document.execCommand('copy');
  if (c) {
   copyPathOK();
  } else {
   copyPathErr();
  }
 }
}

function copyPathOK() {
 pathCopyBtn.innerHTML = '<md-icon>check</md-icon>';
 setTimeout(() => pathCopyBtn.innerHTML = '<md-icon>content_copy</md-icon>', 3000);
}

function copyPathErr() {
 pathCopyBtn.innerHTML = '<md-icon>close</md-icon>';
 alert('Не удалось скопировать текст.');
 setTimeout(() => pathCopyBtn.innerHTML = '<md-icon>content_copy</md-icon>', 3000);
}

function clearPath() {
 clearConfirmDialog.show();
}

function cancelClearPath() {
 clearConfirmDialog.close();
}


function confirmClearPath() {
 let cccb = document.getElementById('clear-copy-cb');
 if (cccb.checked == true) {
  copyPath();
 }
 svgPathInput.value = '';
 refreshParams();
 refreshOutput();
 clearConfirmDialog.close();
}

function pastePath() {
 navigator.clipboard.readText().then((clipText) => (runPathPaste(clipText)));
}

function runPathPaste(t) {
 pathPaste = t;
 if (!pathPaste) {
  openPathPasteErr();
 } else {
  if (svgPathInput.value !== '' && svgPathInput.value !== pathPaste) {
   confirmPathPaste();
   pathPasteC = true;
  } else {
   pathPaste_paste();
   pathPasteC = false;
  }
 }
}

function openPathPasteErr() {
 alert('Не удалось вставить path.\n\nБуфер обмена пуст или произошла ошибка.');
}

function confirmPathPaste() {
 pasteConfirmDialog.show();
}

function pathPaste_cancel() {
 pasteConfirmDialog.close();
}

function pathPaste_paste() {
 if (pathPasteC == true) {
  let rccb = document.getElementById('replace-copy-cb');
  if (rccb.checked == true) {
   copyPath();
  }
  pasteConfirmDialog.close();
 }
 svgPathInput.value = pathPaste;
 refreshOutput();
}

function downloadOutput() {
 let date = new Date();
 let d = date.getDate();
 let mt = date.getMonth();
 mt++;
 let y = date.getFullYear();
 let h = date.getHours();
 let m = date.getMinutes();
 let s = date.getSeconds();
 if (d < 10) {
  d = '0' + d;
 }
 if (mt < 10) {
  mt = '0' + mt;
 }
 if (h < 10) {
  h = '0' + h;
 }
 if (m < 10) {
  m = '0' + m;
 }
 if (s < 10) {
  s = '0' + s;
 }
 let dt = d + '_' + mt + '_' + y + '-' + h + '_' + m + '_' + s;
 let filename = 'result-' + dt + '.svg';
 let pathFill = '';
 if (paramFillCb.checked == true) {
  pathFill = ' fill="' + paramFillColor.value + '"';
 }
 let pathStroke = '';
 if (paramStrokeCb.checked == true) {
  pathStroke = ' stroke="' + paramStrokeColor.value + '"';
 }
 let pathStrokeWidth = '';
 if (paramStrokeWidthCb.checked == true) {
  pathStrokeWidth = ' stroke-width="' + paramStrokeWidth.value + '"';
 }
 let pathData = 'd="' + svgPathInput.value + '"' + pathFill + pathStroke + pathStrokeWidth;
 let hl = '';
 if (useHighlight == true) {
  hl = '    <rect x="0" y="0" width="100%" height="100%" fill="rgb(230, 230, 230)" />\n';
 }
 let svg_code = ['<?xml version="1.1" encoding="utf-8" ?>\n\n<!DOCTYPE svg>\n<svg height="' + paramSvgHeight.value + '" width="' + paramSvgWidth.value + '" xmlns="http://www.w3.org/2000/svg">\n    <title>SVG path</title>\n\n    <!-- Сгенерировано редактором SVG path -->\n    <!-- GitHub: https://github.com/App327/SVG-path-editor -->\n\n' + hl + '    <path ' + pathData + ' />\n</svg>'];
 let link = document.createElement('a');
 link.download = filename;
 let blob = new Blob(svg_code, {type: 'image/svg+xml'});
 link.href = URL.createObjectURL(blob);
 link.click();
 URL.revokeObjectURL(link.href);
}

function linkOutput() {
 let pathFill = '';
 if (paramFillCb.checked == true) {
  pathFill = ' fill="' + paramFillColor.value + '"';
 }
 let pathStroke = '';
 if (paramStrokeCb.checked == true) {
  pathStroke = ' stroke="' + paramStrokeColor.value + '"';
 }
 let pathStrokeWidth = '';
 if (paramStrokeWidthCb.checked == true) {
  pathStrokeWidth = ' stroke-width="' + paramStrokeWidth.value + '"';
 }
 let pathData = 'd="' + svgPathInput.value + '"' + pathFill + pathStroke + pathStrokeWidth;
 let hl = '';
 if (useHighlight == true) {
  hl = '    <rect x="0" y="0" width="100%" height="100%" fill="rgb(230, 230, 230)" />\n';
 }
 let svg_code = ['<?xml version="1.1" encoding="utf-8" ?>\n\n<!DOCTYPE svg>\n<svg height="' + paramSvgHeight.value + '" width="' + paramSvgWidth.value + '" xmlns="http://www.w3.org/2000/svg">\n    <title>SVG path</title>\n\n    <!-- Сгенерировано редактором SVG path -->\n    <!-- GitHub: https://github.com/App327/SVG-path-editor -->\n\n' + hl + '    <path ' + pathData + ' />\n</svg>'];
 let blob = new Blob(svg_code, {type: 'image/svg+xml'});
 let reader = new FileReader();
 reader.readAsDataURL(blob);
 reader.onload = function() {
  dataLink.show();
  dataLnk = reader.result;
  dataLinkURL.href = dataLnk;
 };
}

function closeDataDialog() {
  dataLink.close();
}

function copyDataDialog() {
 if ('clipboard' in navigator) {
  navigator.clipboard.writeText(dataLnk).then(dataDialogCopyBtn.innerHTML = 'Скопировано').catch(() => alert('Не удалось скопировать data URL.'));
 } else {
  alert('Ошибка.\n\nNavigator.clipboard не поддерживается в этом браузере/ОС.');
 }
}

function openOutput() {
 let pathFill = '';
 if (paramFillCb.checked == true) {
  pathFill = ' fill="' + paramFillColor.value + '"';
 }
 let pathStroke = '';
 if (paramStrokeCb.checked == true) {
  pathStroke = ' stroke="' + paramStrokeColor.value + '"';
 }
 let pathStrokeWidth = '';
 if (paramStrokeWidthCb.checked == true) {
  pathStrokeWidth = ' stroke-width="' + paramStrokeWidth.value + '"';
 }
 let pathData = 'd="' + svgPathInput.value + '"' + pathFill + pathStroke + pathStrokeWidth;
 let hl = '';
 if (useHighlight == true) {
  hl = '    <rect x="0" y="0" width="100%" height="100%" fill="rgb(230, 230, 230)" />\n';
 }
 let sc = '<svg height="' + paramSvgHeight.value + '" width="' + paramSvgWidth.value + '" xmlns="http://www.w3.org/2000/svg">\n\n    <!-- Сгенерировано редактором SVG path -->\n    <!-- GitHub: https://github.com/App327/SVG-path-editor -->\n\n' + hl + '    <path ' + pathData + ' />\n</svg>';
 let win = window.open('about:blank', 'Предпросмотр SVG path', 'left=100,top=100,width=300,height=300,menubar=no,toolbar=no,location=no,status=yes,resizable=yes,scrollbars=yes');
 win.focus();
 win.document.body.innerHTML = sc;
 win.document.head.innerHTML = '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>SVG path</title>';
}

function resetParameters() {
 resetParamsConfirm.show();
}

function closeResetParamsConfirm() {
 resetParamsConfirm.close();
}

function resetParams_run() {
 resetParamsBtn.innerHTML = '<md-icon>check</md-icon>';
 setTimeout(() => resetParamsBtn.innerHTML = '<md-icon>reset_settings</md-icon>', 3000);
 resetParamsConfirm.close();
 paramFillCb.checked = true;
 paramStrokeCb.checked = true;
 paramStrokeWidthCb.checked = true;
 paramHighlightCb.checked = false;
 paramFillColor.value = 'none';
 paramStrokeColor.value = 'dodgerblue';
 paramStrokeWidth.value = '2px';
 paramSvgWidth.value = '200px';
 paramSvgHeight.value = '200px';
 refreshParams();
 refreshOutput();
}

window.onbeforeunload = function() {
  return false;
}