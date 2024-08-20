# SVG-path-editor
Удобный, полезный и функциональный редактор SVG path. Во время редактирования можно сразу увидеть результат.

# Установка
Для того, чтобы начать работать с редактором SVG path, нужно установить веб-сервер. Во время разработки данного редактора использовался сервер Apache 2.4 и PHP 8.2.6. Поэтому, эти версии можно смело использовать.

# Использование
Для открытия редактора, в браузере откройте сайт «localhost» (127.0.0.1).

Редактор поделён на 3 группы: код SVG path, вывод (результат) и параметры.

В 1 группе (код SVG path) вводятся сами [команды](https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial), отрисовывающие path. В качестве шаблона указан «M 10 10 H 90 V 90 H 10 Z». Эта команда отрисовывает простой квадрат. В шапке группы справа есть 4 кнопки: скопировать, вставить, выделить, очистить всё.

Во 2 группе (вывод) отрисовывается результат с учётом кода path и параметров. В правой части шапки этой группы также есть кнопки, их тоже 4: обновить (эту кнпку нужно нажимать после изменения параметров), скачать, создать Data URL и открыть в новом окне/вкладке.

В 3 группе (параметры) есть 2 кнопки в правой части шапки: обновить и сбросить. Кнопка «обновить» нужна для случая, когда при установке/снятии флажка по какой-то причине не включилось/выключилось поле ввода.

# Интересная информация
## Как работает функция «Вставить»
Если в поле ввода ничего не введено, то просто вставится текст из буфера обмена.

Если до этого что-то было введено, то при нажатии на кнопку «Вставить» появится предупреждение о замене.

Если содержимое буфера обмена равно тому, что введено в поле ввода, ничего не вставится.

## Как работает функция «Скопировать»

Если браузер поддерживает объект Navigator.clipboard, копирование происходит через него. В противном случае, текст в поле ввода выделяется и выполняется функция `document.execCommand('copy')`.

А вот кнопка «Скопировать» в окне Data URL работает только через Navigator.clipboard. В будущем появится альтернативный вариант.

## Что такое подсветка размеров и как она работает

Еали в параметрах включить функцию «Подсветка размеров», во всю ширину и высоту SVG (указывается в соответствующих параметрах) на заднем плане будет показываться светло-серый квадрат. Этот квадрат помогает определить границу всего холста SVG. По умолчанию эта функция выключена.

Если этот параметр включён, то в скачанный файл и в Data URL также будет включён этот светло-серый квадрат.
