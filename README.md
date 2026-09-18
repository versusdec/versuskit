# VersusKit

Набір класів для найчастіших стилів + готові компоненти. Сирий SCSS + jQuery, без збирачів.
Готовий CSS важить ~40 КБ (~8 КБ gzip).

## Старт

Без збирачів і npm: копіюєш папку в проєкт і працюєш.

- `scss/`: сирі SCSS-файли
- `css/main.css`: скомпільований результат
- `js/main.js`: сирий JS на jQuery (`js/vendor/jquery.min.js` 3.7.1 уже лежить поруч)
- `index.html`: документація з живими прикладами (вона ж сайт на GitHub Pages)

### Компіляція SCSS

Компілюється лише `scss/main.scss` → `css/main.css`. Файли з `_` на початку — це партіали, які він підключає.

**PhpStorm / WebStorm**: File Watcher уже налаштований у `.idea/watcherTasks.xml`.
Щоб перенести його в інший проєкт: Settings → Tools → File Watchers → **SCSS**:

| Поле | Значення |
|---|---|
| Program | `sass` |
| Arguments | `--silence-deprecation=import $FileName$:../css/$FileNameWithoutExtension$.css` |
| Output paths | `../css/$FileNameWithoutExtension$.css:../css/$FileNameWithoutExtension$.css.map` |
| Working directory | `$FileDir$` |
| Track only root files | ✔ |

**VS Code**: розширення *Live Sass Compiler*, `savePath` = `/css`.

**Термінал**:

```bash
sass --watch scss/main.scss:css/main.css --silence-deprecation=import
```

```bash
node-sass --watch scss/main.scss -o css
```

### Чому `@import`, а не `@use`

Код навмисно сумісний з **обома** компіляторами: Dart Sass (`sass`) і node-sass (LibSass). Обидва дають ідентичний CSS.
node-sass не розуміє `@use`, тому тут `@import`. Dart Sass на нього видає попередження, прапорець `--silence-deprecation=import` його приховує.

## Структура

```
scss/
  _variables.scss   кольори, відступи, шрифт, брейкпоінти — усі налаштування тут
  _mixins.scss      tablet / mobile / hover і кілька хелперів
  base/             reset, заголовки, контейнер, анімації
  components/       кнопки, іконки, форми, акордеон, модалка, dropdown, бургер…
  utilities/
    _classes.scss     кольори, текст, рамки, тіні, позиціонування…
    _responsive.scss  відступи, flex, grid, display + версії tab- / mob-
  main.scss         точка входу
css/main.css        результат
js/main.js          модалки, dropdown, тогли + місце для коду проєкту
js/vendor/          jQuery
```

## Ідея

Типові стилі задаються класами прямо в HTML, окремий CSS для елемента не потрібен:

```html
<section class="section bg-dark">
  <div class="container">
    <h2 class="mb-sm">Наші послуги</h2>
    <p class="text-lg opacity-75 mb-lg mob-mb-md">Опис секції</p>

    <div class="grid cols-3 tab-cols-2 mob-cols-1 gap-md">
      <div class="bg-white text-dark padding-lg mob-padding-md border-radius shadow">…</div>
    </div>
  </div>
</section>
```

Класи з префіксом `tab-` діють при ширині ≤ 1200px, з `mob-` — при ширині ≤ 768px. Повний список з живими прикладами є в **index.html**.

## Налаштування

Усе в `scss/_variables.scss`. Кожен колір з `$colors` дає класи `.text-*`, `.bg-*`, `.border-*`, кожен відступ з `$spacers` — класи `.mt-*`, `.padding-*`, `.gap-*` і т.д.

Якщо все ж потрібен свій стиль, створи файл (напр. `scss/blocks/_header.scss`) і підключи в `main.scss` у блоці «Стилі проєкту»:

```scss
.header {
  height: 80px;

  @include mobile {
    height: 60px;
  }
}
```
