<?php

header('HTTP/1.1 200 OK');

echo '<!DOCTYPE html>
<html lang="ru" dir="ltr">
 <head>
  <meta charset="utf-8" />
  <title>Редактор SVG path</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" media="all" type="text/css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" media="all" type="text/css" />
  <link rel="stylesheet" href="/static/css/main.css" media="all" type="text/css" />
  <link rel="icon" href="/static/img/site/favicon.ico" type="image/vnd.microsoft.icon" />
  <style type="text/css">
#app-loader {
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: white;
}

#al-v {
 position: absolute;
 bottom: 5px;
 right: 10px;
 color: grey;
 user-select: none;
}

#al-l {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
}

#al-cl {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
}
  </style>
  <script type="importmap">
    {
      "imports": {
        "@material/web/": "https://esm.run/@material/web/"
      }
    }
  </script>
  <script type="module">
    import \'@material/web/all.js\';
    import {styles as typescaleStyles} from \'@material/web/typography/md-typescale-styles.js\';

    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
  </script>
 </head>
 <body>
  <!-- v1.1 -->
  <!-- GitHub: https://github.com/App327/SVG-path-editor -->

  <md-dialog type="alert" id="update-dialog" style="visibility: hidden;">
   <div slot="headline">Доступно обновление</div>
   <div slot="content">
    <p>Доступно обновление Редактора SVG path.</p>
    <p>Чтобы установить обновление, перейдите на GitHub проекта, далее нажмите зелёную кнопку <code>Code</code>, а затем — <code>Download ZIP</code>. После этого распакуйте скачанный ZIP-архив и замените его содержимым файлы текущей установки Редактора.</p>
   </div>
   <div slot="actions">
    <md-filled-tonal-button onclick="window.open(\'https://www.github.com/App327/SVG-path-editor\')">GitHub<br />проекта</md-filled-tonal-button>
    <md-text-button onclick="closeUpdateDialog()">Закрыть и<br />напомнить позже</md-text-button>
   </div>
  </md-dialog>

  <div id="app-content" style="display: none;">

  <header>
   <h1 class="site-name"><img src="/static/img/site/logo.svg" alt="Логотип" height="30px" width="30px" /> Редактор SVG path</h1>
  </header>

  <div class="screen-sep ss1">
   <div class="ss-header">
    <p class="ssh-name">SVG path</p>
    <div class="ssh-buttons">
     <md-icon-button onclick="copyPath()" id="path-copy-btn" data-tooltip="Скопировать"><md-icon>content_copy</md-icon></md-icon-button>
     <md-icon-button onclick="pastePath()" id="path-paste-btn" data-tooltip="Вставить"><md-icon>content_paste</md-icon></md-icon-button>
     <md-icon-button onclick="selectPath()" id="path-select-btn" data-tooltip="Выделить всё"><md-icon>text_select_start</md-icon></md-icon-button>
     <md-icon-button onclick="clearPath()" id="path-clear-btn" data-tooltip="Очистить"><md-icon>delete</md-icon></md-icon-button>
     <span style="position: relative;">
      <md-icon-button id="path-moreopt-btn" data-tooltip="Доп. опции"><md-icon>more_vert</md-icon></md-icon-button>
      <md-menu id="path-moreopt-menu" anchor="path-moreopt-btn">
       <md-menu-item onclick="showPathSamples()">
        <div slot="start"><md-icon>style</md-icon></div>
        <div slot="headline">Образцы path</div>
       </md-menu-item>
      </md-menu>
     </span>
    </div>
   </div>
   <div class="ss-content">
    <textarea class="ss-path-input" id="svg-path-input" placeholder="M 10 10 H 90 V 90 H 10 Z"></textarea>
   </div>
  </div>

  <div class="screen-sep ss2">
   <div class="ss-header">
    <p class="ssh-name">Вывод</p>
    <div class="ssh-buttons">
     <md-icon-button onclick="refreshOutput()" id="output-refresh-btn" data-tooltip="Обновить"><md-icon>refresh</md-icon></md-icon-button>
     <md-icon-button onclick="downloadOutput()" id="output-download-btn" data-tooltip="Скачать"><md-icon>download</md-icon></md-icon-button>
     <md-icon-button onclick="linkOutput()" id="output-link-btn" data-tooltip="Data URL"><md-icon>link</md-icon></md-icon-button>
     <md-icon-button onclick="openOutput()" id="output-open-btn" data-tooltip="Открыть в новой вкладке"><md-icon>open_in_new</md-icon></md-icon-button>
    </div>
   </div>
   <div class="ss-content">
    <svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" id="svg">
     <rect x="0" y="0" width="100%" height="100%" fill="rgb(230, 230, 230)" id="size-hl" style="display: none;" />
     <g id="path-scgrid" style="display: none;">
     </g>
     <path d="" fill="none" stroke="dodgerblue" stroke-width="2px" id="svg-path" />
    </svg>
   </div>
  </div>

  <div class="screen-sep ss3">
   <div class="ss-header">
    <p class="ssh-name">Параметры</p>
    <div class="ssh-buttons">
     <md-icon-button onclick="refreshParams()" id="output-refresh-btn" data-tooltip="Обновить"><md-icon>refresh</md-icon></md-icon-button>
     <md-icon-button onclick="resetParameters()" id="parameters-reset-btn" data-tooltip="Сбросить"><md-icon>reset_settings</md-icon></md-icon-button>
    </div>
   </div>
   <div class="ss-content">
    <label><md-checkbox checked id="param-fill-cb"></md-checkbox> Заполнение фигуры: <md-filled-text-field label="Цвет" value="none" placeholder="none" id="param-fill-color"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label><md-checkbox checked id="param-stroke-cb"></md-checkbox> Цвет обводки: <md-filled-text-field label="Цвет" value="dodgerblue" placeholder="dodgerblue" id="param-stroke-color"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label><md-checkbox checked id="param-stroke_width-cb"></md-checkbox> Толщина обводки: <md-filled-text-field label="Толщина" value="2px" placeholder="2px" id="param-stroke_width"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label>Высота SVG: <md-filled-text-field label="Высота" value="200px" placeholder="200px" id="param-svg-height"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label>Ширина SVG: <md-filled-text-field label="Ширина" value="200px" placeholder="200px" id="param-svg-width"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label><md-checkbox id="param-highlight-cb"></md-checkbox> Подсветка размеров SVG</label><br /><br />
    <label>Затемнённость подложки: <md-slider min="0" max="254" value="230" id="param-highlight-darkening" disabled="false"></md-slider> <span id="param-highlight-darkening-value">230</span></label>
    <hr noshade color="lightgrey" />
    <label><md-checkbox id="param-grid-cb"></md-checkbox> Сетка размеров и координат</label>
    <hr noshade color="silver" />
    <md-filled-button onclick="exportPath()"><md-icon slot="icon">upload</md-icon> Экспорт</md-filled-button>
    <md-outlined-button onclick="importPath()"><md-icon slot="icon">download</md-icon> Импорт</md-filled-button>
   </div>
  </div>


  <!-- Диалоговые окна -->

  <md-dialog type="alert" id="clear-confirm-dialog">
   <div slot="headline">Очистить path?</div>
   <div slot="content">
    <p>Весь введённый path будет очищен без возможности восстановления (если вы не выполнили экспорт).</p>
    <p>Перед очисткой рекомендуем скопировать текущее содержимое path в буфер обмена.</p>
    <p><label><md-checkbox id="clear-copy-cb" checked></md-checkbox> Скопировать</label></p>
   </div>
   <div slot="actions">
    <md-text-button onclick="cancelClearPath()">Отмена</md-text-button>
    <md-filled-tonal-button onclick="confirmClearPath()">Очистить</md-filled-tonal-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" id="paste-confirm-dialog">
   <div slot="headline">Заменить path?</div>
   <div slot="content">
    <p>У вас уже введён path. При его замене старое содержимое удалится без возможности восстановления (если вы не выполнили экспорт).</p>
    <p>Перед заменой рекомендуем скопировать текущее содержимое path в буфер обмена.</p>
    <p><label><md-checkbox id="replace-copy-cb" checked></md-checkbox> Скопировать</label></p>
   </div>
   <div slot="actions">
    <md-text-button onclick="pathPaste_cancel()">Отмена</md-text-button>
    <md-filled-tonal-button onclick="pathPaste_paste()" id="path-paste-confirm-dialog-mainbtn">Заменить</md-filled-tonal-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" id="data-dialog">
   <div slot="headline">Data URL сгенерирован</div>
   <div slot="content">
    <p>Теперь вы можете открыть и/или скопировать полученный data URL.</p>
    <p>Если при открытии data URL у вас открывается страница <code>about:blank</code> или если у вас открывается страница <code>data:image/svg+xml;base64,...</code>, но, при этом, она пустая, то просто обновите страницу <code>about:blank</code> / <code>data:...</code>.</p>
    <p><a id="data-link-open-btn" href="#" target="_blank">Открыть data URL <md-icon style="font-size: 15px;">open_in_new</md-icon></a></p>
   </div>
   <div slot="actions">
    <md-text-button onclick="copyDataDialog()" id="data-dialog-copy-btn">Скопировать</md-text-button>
    <md-text-button onclick="closeDataDialog()">Закрыть</md-text-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" id="reset-params-confirm-dialog">
   <div slot="headline">Сбросить параметры?</div>
   <div slot="content">
    <p>Все заданные параметры будут сброшены на значения по умолчанию без возможности восстановления (если вы не выполнили экспорт).</p>
   </div>
   <div slot="actions">
    <md-text-button onclick="closeResetParamsConfirm()">Отмена</md-text-button>
    <md-filled-tonal-button onclick="resetParams_run()">Сбросить</md-filled-tonal-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" style="width: 100%; height: 100%;" id="path-samples-dialog">
   <div slot="headline">Образцы path</div>
   <div slot="content">
    <md-list style="max-width: 300px;">
     <md-list-item><b>Геометрические фигуры</b></md-list-item>
     <md-divider></md-divider>
     <md-list-item type="link" href="javascript:pastePathSample(\'M 10 10 H 90 V 90 H 10 Z\')">
      <div slot="start"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4xIiBlbmNvZGluZz0idXRmLTgiID8+Cgo8IURPQ1RZUEUgc3ZnPgo8c3ZnIGhlaWdodD0iMTAwcHgiIHdpZHRoPSIxMDBweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDx0aXRsZT5TVkcgcGF0aDwvdGl0bGU+CgogICAgPCEtLSDQodCz0LXQvdC10YDQuNGA0L7QstCw0L3QviDRgNC10LTQsNC60YLQvtGA0L7QvCBTVkcgcGF0aCAtLT4KICAgIDwhLS0gR2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vQXBwMzI3L1NWRy1wYXRoLWVkaXRvciAtLT4KCiAgICA8cGF0aCBkPSJNIDEwIDEwIEggOTAgViA5MCBIIDEwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iZG9kZ2VyYmx1ZSIgc3Ryb2tlLXdpZHRoPSIycHgiIC8+Cjwvc3ZnPg==" alt="Квадрат" height="30px" /></div>
      <div slot="headline">Квадрат</div>
      <div slot="supporting-text" style="padding: 5px;"><code>M 10 10 H 90 V 90 H 10 Z</code></div>
     </md-list-item>
     <md-list-item type="link" href="javascript:pastePathSample(\'M 50 10 L 90 90 H 10 Z\')">
      <div slot="start"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4xIiBlbmNvZGluZz0idXRmLTgiID8+Cgo8IURPQ1RZUEUgc3ZnPgo8c3ZnIGhlaWdodD0iMTAwcHgiIHdpZHRoPSIxMDBweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDx0aXRsZT5TVkcgcGF0aDwvdGl0bGU+CgogICAgPCEtLSDQodCz0LXQvdC10YDQuNGA0L7QstCw0L3QviDRgNC10LTQsNC60YLQvtGA0L7QvCBTVkcgcGF0aCAtLT4KICAgIDwhLS0gR2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vQXBwMzI3L1NWRy1wYXRoLWVkaXRvciAtLT4KCiAgICA8cGF0aCBkPSJNIDUwIDEwIEwgOTAgOTAgSCAxMCBaIiBmaWxsPSJub25lIiBzdHJva2U9ImRvZGdlcmJsdWUiIHN0cm9rZS13aWR0aD0iMnB4IiAvPgo8L3N2Zz4=" alt="Треугольник" height="30px" /></div>
      <div slot="headline">Треугольник</div>
      <div slot="supporting-text" style="padding: 5px;"><code>M 50 10 L 90 90 H 10 Z</code></div>
     </md-list-item>
     <md-list-item type="link" href="javascript:pastePathSample(\'M 10 70 H 90 L 70 20 H 30 Z\')">
      <div slot="start"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4xIiBlbmNvZGluZz0idXRmLTgiID8+Cgo8IURPQ1RZUEUgc3ZnPgo8c3ZnIGhlaWdodD0iMTAwcHgiIHdpZHRoPSIxMDBweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDx0aXRsZT5TVkcgcGF0aDwvdGl0bGU+CgogICAgPCEtLSDQodCz0LXQvdC10YDQuNGA0L7QstCw0L3QviDRgNC10LTQsNC60YLQvtGA0L7QvCBTVkcgcGF0aCAtLT4KICAgIDwhLS0gR2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vQXBwMzI3L1NWRy1wYXRoLWVkaXRvciAtLT4KCiAgICA8cGF0aCBkPSJNIDEwIDcwIEggOTAgTCA3MCAyMCBIIDMwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iZG9kZ2VyYmx1ZSIgc3Ryb2tlLXdpZHRoPSIycHgiIC8+Cjwvc3ZnPg==" alt="Трапеция" height="30px" /></div>
      <div slot="headline">Трапеция</div>
      <div slot="supporting-text" style="padding: 5px;"><code>M 10 70 H 90 L 70 20 H 30 Z</code></div>
     </md-list-item>
    </md-list>
   </div>
   <div slot="actions">
    <md-text-button onclick="closePathSamples()">Закрыть</md-text-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" id="path-import-dialog">
   <div slot="headline">1/3. Импорт параметров и path</div>
   <div slot="content">
    <p>Здесь вы можете импортировать ранее экспортированные параметры и SVG path. Для этого вам необходимо иметь ранее скачанный при экспорте JSON-файл.</p>
    <p>Обратите внимание, что импортирование может заменить часть (или все) текущих параметров и SVG path. Перед выполнением процесса импорта, если вам нужно сохранить текущий path, пожалуйста, сохраните его (и/или параметры) любым удобным для вас образом, например, с помощью экспорта. В случае замены значений, предупреждения (как, например, при вставке path из буфера обмена при перезаписи path) показаны <b>не</b> будут.</p>
   </div>
   <div slot="actions">
    <md-text-button onclick="closePathImportDialog()">Отмена</md-text-button>
    <md-filled-tonal-button onclick="importPath_nextStep()">Продолжить</md-filled-tonal-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" id="path-import-step2-dialog">
   <div slot="headline">2/3. Импорт</div>
   <div slot="content">
    <p>Пожалуйста, загрузите сюда JSON-файл экспорта.</p>
    <input type="file" id="import-fileinp" style="background: white; padding: 5px; width: calc(100% - 10px);" accept="application/json" />
   </div>
   <div slot="actions">
    <md-filled-tonal-button onclick="importPath_start()" id="import-step2-btn" style="visibility: hidden;">Импортировать</md-filled-tonal-button>
    <md-text-button onclick="closePathImport2Dialog()">Отмена</md-text-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" id="path-import-step3-dialog">
   <div slot="headline">3/3. Импортирование</div>
   <div slot="content">
    <p>Импорт параметров и SVG path успешно выполнен.</p>
   </div>
   <div slot="actions">
    <md-text-button onclick="closePathImport3Dialog()">Закрыть</md-text-button>
   </div>
  </md-dialog>

  <p class="tooltip" style="display: none; top: 0; left: 0;">Подсказка</p>

  </div>

  <div id="app-loader">
   <p id="al-v">v1.2</p>
   <md-linear-progress value="0.2" id="al-l"></md-linear-progress>
   <md-circular-progress indeterminate id="al-cl"></md-circular-progress>
  </div>

  <script type="text/javascript" src="/static/js/main.js"></script>
 </body>
</html>';

?>