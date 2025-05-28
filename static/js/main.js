let curVer = '1.2'; // текущая версия
let curVerCode = 3; // код текущей версии

let updateDialog = document.getElementById('update-dialog');

setTimeout(checkForUpdates, 30);

async function checkForUpdates() {
 if (!sessionStorage.getItem('update-dialog-closed')) {
  sessionStorage.setItem('update-dialog-closed', 'false');
 }
 if (sessionStorage.getItem('update-dialog-closed') == 'true') {
  return false;
 }

 let response = await fetch('https://raw.githubusercontent.com/App327/SVG-path-editor/refs/heads/main/data/versions.json');

 if (response.ok) {
  let j = await response.json();
  let vc = Number(j["latest_version_code"]);
  if (vc > curVerCode) {
   updateDialog.style.visibility = 'visible';
   setTimeout(() => updateDialog.show(), 20);
  }
 } else {
  console.warn('⚠️ Не удалось проверить наличие обновлений.\n\nОшибка HTTP: ' + response.status);
 }
}

function closeUpdateDialog() {
 sessionStorage.setItem('update-dialog-closed', 'true');
 updateDialog.close();
 setTimeout(() => updateDialog.style.visibility = 'hidden', 100);
}


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
let pathOptionsBtn = document.getElementById('path-moreopt-btn');
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
let paramHighlightDarkening = document.getElementById('param-highlight-darkening');
let paramHighlightDarkeningValue = document.getElementById('param-highlight-darkening-value');
let paramGridCb = document.getElementById('param-grid-cb');
let pathGrid = document.getElementById('path-scgrid');
let svgPathInput = document.getElementById('svg-path-input');
let clearConfirmDialog = document.getElementById('clear-confirm-dialog');
let pasteConfirmDialog = document.getElementById('paste-confirm-dialog');
let highlight = document.getElementById('size-hl');
let dataLink = document.getElementById('data-dialog');
let dataLinkURL = document.getElementById('data-link-open-btn');
let dataDialogCopyBtn = document.getElementById('data-dialog-copy-btn');
let resetParamsConfirm = document.getElementById('reset-params-confirm-dialog');
let resetParamsBtn = document.getElementById('parameters-reset-btn');
let pathSamplesDialog = document.getElementById('path-samples-dialog');
let pathImportDialog = document.getElementById('path-import-dialog');
let pathImport2Dialog = document.getElementById('path-import-step2-dialog');
let pathImport2NSB = document.getElementById('import-step2-btn'); // NSB = Next Step Button
let pathImport2Fileinp = document.getElementById('import-fileinp');
let pathImport3Dialog = document.getElementById('path-import-step3-dialog');


let pathPaste = '';
let pathPasteC = false;

let useHightlight = false;
let highlightDarkening = 230;

let useSCGrid = false;

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
  highlight.setAttribute('fill', 'rgb(' + paramHighlightDarkening.value + ', ' + paramHighlightDarkening.value + ', ' + paramHighlightDarkening.value + ')');
 } else if (paramHighlightCb.checked == false) {
  useHighlight = false;
  highlight.style.display = 'none';
 }
 if (paramGridCb.checked == true) {
  useSCGrid = true;
  pathGrid.style.display = 'block';
 } else if (paramGridCb.checked == false) {
  useSCGrid = false;
  pathGrid.style.display = 'none';
 }
 drawPathGrid(paramSvgHeight.value, paramSvgWidth.value);
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
 if (paramHighlightCb.checked == true) {
  paramHighlightDarkening.removeAttribute('disabled');
 } else if (paramHighlightCb.checked == false) {
  paramHighlightDarkening.setAttribute('disabled', 'true');
 }
 refreshHighlightDarkening();
}

function refreshHighlightDarkening() {
 paramHighlightDarkeningValue.innerHTML = paramHighlightDarkening.value;
 highlightDarkening = paramHighlightDarkening.value;
 highlight.setAttribute('fill', 'rgb(' + paramHighlightDarkening.value + ', ' + paramHighlightDarkening.value + ', ' + paramHighlightDarkening.value + ')');
}

function refreshParamsAndOutput() {
 refreshParams();
 refreshOutput();
}

paramFillCb.onchange = refreshParamsAndOutput;
paramStrokeCb.onchange = refreshParamsAndOutput;
paramStrokeWidthCb.onchange = refreshParamsAndOutput;
paramHighlightCb.onchange = refreshParamsAndOutput;
paramHighlightDarkening.onchange = refreshParamsAndOutput;
paramGridCb.onchange = refreshParamsAndOutput;

svgPathInput.oninput = refreshOutput;
svgPathInput.onchange = refreshOutput;
svgPathInput.onfocus = refreshOutput;
svgPathInput.onblur = refreshOutput;
svgPathInput.onclick = refreshOutput;

setInterval(refreshHighlightDarkening, 100);

function drawPathGrid() {
 let g = pathGrid;
 let h = svg.scrollHeight;
 let w = svg.scrollWidth;
 g.innerHTML = '';
 for (let i = 0; i < w;) {
  g.innerHTML += '<line x1="' + i + '" x2="' + i + '" y1="0" y2="' + h + '" fill="none" stroke="silver" stroke-width="1px" />';
  i = i + 10;
 }
 for (let i = 0; i < h;) {
  g.innerHTML += '<line x1="0" x2="' + w + '" y1="' + i + '" y2="' + i + '" fill="none" stroke="silver" stroke-width="1px" />';
  i = i + 10;
 }
}


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
 let filename = 'svg_path-' + dt + '.svg';
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
  hl = '    <rect x="0" y="0" width="100%" height="100%" fill="rgb(' + highlightDarkening + ', ' + highlightDarkening + ', ' + highlightDarkening + ')" />\n';
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
  hl = '    <rect x="0" y="0" width="100%" height="100%" fill="rgb(' + highlightDarkening + ', ' + highlightDarkening + ', ' + highlightDarkening + ')" />\n';
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
  navigator.clipboard.writeText(dataLnk).then(changeDataCopyBtnText).catch(() => alert('Не удалось скопировать data URL.'));
 } else {
  alert('Ошибка.\n\nNavigator.clipboard не поддерживается в этом браузере/ОС.');
 }
}

function changeDataCopyBtnText() {
 dataDialogCopyBtn.innerHTML = 'Скопировано';
 setTimeout(() => dataDialogCopyBtn.innerHTML = 'Скопировать', 3000);
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
 paramHighlightDarkening.value = 230;
 paramGridCb.checked = false;
 paramFillColor.value = 'none';
 paramStrokeColor.value = 'dodgerblue';
 paramStrokeWidth.value = '2px';
 paramSvgWidth.value = '200px';
 paramSvgHeight.value = '200px';
 refreshParamsAndOutput();
}

window.onbeforeunload = function() {
 // Показываем подтверждение при перезагрузке/закрытии страницы,
 // чтобы предотвратить случайное удаление введённого path и сброс параметров.
 return false;
}

let pathMO = document.getElementById('path-moreopt-menu');
pathOptionsBtn.onclick = function() {
 pathMO.open = !pathMO.open;
};

function showPathSamples() {
 pathSamplesDialog.show();
}

function closePathSamples() {
 pathSamplesDialog.close();
}

function pastePathSample(path) {
 closePathSamples();
 runPathPaste(path);
}

function exportPath() {
 let pathData = {
  'export_version': '2',
  'path': svgPathInput.value,
  'params': {
   'fill': {
    'enabled': paramFillCb.checked,
    'value': paramFillColor.value
   },
   'stroke': {
    'color': {
     'enabled': paramStrokeCb.checked,
     'value': paramStrokeColor.value
    },
    'width': {
     'enabled': paramStrokeWidthCb.checked,
     'value': paramStrokeWidth.value
    }
   },
   'svg_height': paramSvgHeight.value,
   'svg_width': paramSvgWidth.value,
   'scgrid': paramGridCb.checked, // [НОВОЕ]/[NEW]
   'size_highlight': {
    'enabled': paramHighlightCb.checked,
    'darkening': paramHighlightDarkening.value
   }
  }
 };
 let json = JSON.stringify(pathData);
 let j = ['' + json + ''];
 let blob = new Blob(j, {type: 'application/json'});
 let reader = new FileReader();
 reader.readAsDataURL(blob);
 reader.onload = function() {
  let el = document.createElement('a');
  el.href = reader.result;
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
  el.download = 'svg_path_export-' + dt + '.json';
  el.click();
 };
}

function importPath() {
 pathImportDialog.show();
}

function importPath_nextStep() {
 pathImportDialog.close();
 pathImport2Fileinp.value = null;
 pathImport2NSB.style.visibility = 'hidden';
 pathImport2Dialog.show();
}

function closePathImportDialog() {
 pathImportDialog.close();
}

function closePathImport2Dialog() {
 pathImport2Dialog.close();
}

pathImport2Fileinp.onchange = function() {
 let curFile = pathImport2Fileinp.files[0];
 if (curFile) {
  pathImport2NSB.style.visibility = 'visible';
 } else {
  pathImport2NSB.style.visibility = 'hidden';
 }
}

function importPath_start() {
 pathImport2Dialog.close();
 let file = pathImport2Fileinp.files[0];
 let reader = new FileReader();
 reader.readAsText(file);
 reader.onload = function() {
  let f = reader.result;
  j = JSON.parse(f);
  if (j['export_version'] == '2' || j['export_version'] == '1') {
   if (j['export_version'] == '1') {
    alert('[i] ИНФОРМАЦИЯ\n\nВы используете старую версию экспортного формата (' + j['export_version'] + '). Экспорты из этой версии будут загружаться, но параметр «Сетка размеров и координат», добавленный в последней версии экспортного формата 2, будет установлен как отключённый. Вы можете в любое время включить его в параметрах.');
   }
   svgPathInput.value = j['path'];
   if (j['params']['fill']['enabled'] == true) {
    paramFillCb.checked = true;
   } else {
    paramFillCb.checked = false;
   }
   paramFillColor.value = j['params']['fill']['value'];
   if (j['params']['stroke']['color']['enabled'] == true) {
    paramStrokeCb.checked = true;
   } else {
    paramStrokeCb.checked = false;
   }
   paramStrokeColor.value = j['params']['stroke']['color']['value'];
   if (j['params']['stroke']['width']['enabled'] == true) {
    paramStrokeWidthCb.checked = true;
   } else {
    paramStrokeWidthCb.checked = false;
   }
   paramStrokeWidth.value = j['params']['stroke']['width']['value'];
   paramSvgWidth.value = j['params']['svg_width'];
   paramSvgHeight.value = j['params']['svg_height'];
   if (j['params']['size_highlight']['enabled'] == true) {
    paramHighlightCb.checked = true;
   } else {
    paramHighlightCb.checked = false;
   }
   if (j['export_version'] == '2') {
    paramGridCb.checked = j['params']['scgrid']; // scgrid = Sizes & Coordinates Grid
   } else {
    paramGridCb.checked = false;
   }
   paramHighlightDarkening.value = j['params']['size_highlight']['darkening'];
   refreshParamsAndOutput();
  } else {
   alert('Неподдерживаемая версия экспортного формата: <' + j['export_version'] + '>');
   return false;
  }
 }
 reader.onerror = function() {
  alert('Не удаётся прочитать содержимое файла. Ошибка FileReader: [' + reader.error + '].');
  return false;
 }
 pathImport3Dialog.show();
}

function closePathImport3Dialog() {
 pathImport3Dialog.close();
}