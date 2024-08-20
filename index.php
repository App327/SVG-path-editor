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
  <!-- v1.0 -->
  <!-- GitHub: https://github.com/App327/SVG-path-editor -->

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
    <label><md-checkbox checked id="param-fill-cb"></md-checkbox> Заполнение: <md-filled-text-field label="Цвет" value="none" placeholder="none" id="param-fill-color"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label><md-checkbox checked id="param-stroke-cb"></md-checkbox> Цвет обводки: <md-filled-text-field label="Цвет" value="dodgerblue" placeholder="dodgerblue" id="param-stroke-color"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label><md-checkbox checked id="param-stroke_width-cb"></md-checkbox> Толщина обводки: <md-filled-text-field label="Толщина" value="2px" placeholder="2px" id="param-stroke_width"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label>Высота SVG: <md-filled-text-field label="Высота" value="200px" placeholder="200px" id="param-svg-height"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label>Ширина SVG: <md-filled-text-field label="Ширина" value="200px" placeholder="200px" id="param-svg-width"></md-filled-text-field></label>
    <hr noshade color="lightgrey" />
    <label><md-checkbox id="param-highlight-cb"></md-checkbox> Подсветка размеров</label>
   </div>
  </div>

  <md-dialog type="alert" id="clear-confirm-dialog">
   <div slot="headline">Очистить path?</div>
   <div slot="content">
    <p>Весь введённый path будет очищен без возможности восстановления.</p>
    <p>Перед очисткой рекомендуем скопировать текущее содержимое path в буфер обмена.</p>
    <p><label><md-checkbox id="clear-copy-cb" checked></md-checkbox> Скопировать</label></p>
   </div>
   <div slot="actions">
    <md-text-button onclick="cancelClearPath()">Отмена</md-text-button>
    <md-text-button onclick="confirmClearPath()">Очистить</md-text-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" id="paste-confirm-dialog">
   <div slot="headline">Заменить path?</div>
   <div slot="content">
    <p>У вас уже введён path. При его замене старое содержимое удалится без возможности восстановления.</p>
    <p>Перед заменой рекомендуем скопировать текущее содержимое path в буфер обмена.</p>
    <p><label><md-checkbox id="replace-copy-cb" checked></md-checkbox> Скопировать</label></p>
   </div>
   <div slot="actions">
    <md-text-button onclick="pathPaste_cancel()">Отмена</md-text-button>
    <md-text-button onclick="pathPaste_paste()">Заменить</md-text-button>
   </div>
  </md-dialog>

  <md-dialog type="alert" id="data-dialog">
   <div slot="headline">Data URL сгенерирован</div>
   <div slot="content">
    <p>Теперь вы можете открыть и/или скопировать получившийся data URL.</p>
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
    <p>Все заданные параметры будут сброшены на значения по умолчанию без возможности восстановления.</p>
   </div>
   <div slot="actions">
    <md-text-button onclick="closeResetParamsConfirm()">Отмена</md-text-button>
    <md-text-button onclick="resetParams_run()">Сбросить</md-text-button>
   </div>
  </md-dialog>

  <p class="tooltip" style="display: none; top: 0; left: 0;">Подсказка</p>

  </div>

  <div id="app-loader">
   <md-linear-progress value="0.2" id="al-l"></md-linear-progress>
   <md-circular-progress indeterminate id="al-cl"></md-circular-progress>
  </div>

  <script type="text/javascript" src="/static/js/main.js"></script>
 </body>
</html>';

?>