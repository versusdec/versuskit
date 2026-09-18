/**
 * VersusKit — основний скрипт (jQuery).
 *
 * Модалки (нативний <dialog>):
 *   <button data-modal-open="thanks">…</button>
 *   <dialog class="modal" id="thanks">… <button data-modal-close>…</button></dialog>
 *   З коду: modal.open('thanks'), modal.close('thanks')
 *
 * Dropdown (розмітка — у scss/components/_dropdown.scss):
 *   клік по .dropdown-toggle, закриття кліком поза ним і по Esc.
 *   .dropdown.select — кастомний селект, подія: $('.dropdown').on('dropdown:change', function (e, value) {…})
 *   З коду: dropdown.toggle($el, true|false), dropdown.closeAll()
 *
 * Тогл класу (бургер, меню):
 *   <button data-toggle="#menu">…</button>  → перемикає .active на кнопці і #menu
 *   data-toggle-class="open" — інший клас замість .active
 */

var modal = {
  open: function (id) {
    var dialog = document.getElementById(id);
    if (!dialog || dialog.open) return;
    // Закриваємо іншу відкриту модалку, щоб не було "стопки"
    $('dialog.modal[open]').each(function () {
      this.close();
    });
    dialog.showModal();
  },
  close: function (id) {
    var $dialog = id ? $('#' + id) : $('dialog.modal[open]');
    $dialog.each(function () {
      this.close();
    });
  },
};

var dropdown = {
  toggle: function ($dropdown, isOpen) {
    $dropdown = $($dropdown);
    $dropdown.toggleClass('active', isOpen);
    $dropdown.find('.dropdown-toggle').attr('aria-expanded', $dropdown.hasClass('active'));
  },
  // Закрити всі, крім переданого
  closeAll: function ($except) {
    $('.dropdown.active').not($except).each(function () {
      dropdown.toggle(this, false);
    });
  },
};

$(function () {
  var $doc = $(document);

  // ---------- Модалки ----------
  $doc.on('click', '[data-modal-open]', function (e) {
    e.preventDefault();
    modal.open($(this).data('modal-open'));
  });

  $doc.on('click', '[data-modal-close]', function () {
    var dialog = $(this).closest('dialog')[0];
    if (dialog) dialog.close();
  });

  // Клік по підкладці (поза .inner) закриває модалку
  $doc.on('click', 'dialog.modal', function (e) {
    if (e.target === this) this.close();
  });

  // ---------- Тогли ----------
  $doc.on('click', '[data-toggle]', function () {
    var $btn = $(this);
    var cls = $btn.data('toggle-class') || 'active';
    var isActive = !$btn.hasClass(cls);

    $btn.toggleClass(cls, isActive).attr('aria-expanded', isActive);
    $($btn.data('toggle')).toggleClass(cls, isActive);
  });

  // ---------- Dropdown ----------
  var canHover = window.matchMedia('(hover: hover)').matches;

  $doc.on('click', '.dropdown-toggle', function (e) {
    var $dropdown = $(this).closest('.dropdown');
    // .hover на десктопі працює через CSS — клік не потрібен
    if ($dropdown.hasClass('hover') && canHover) return;

    e.preventDefault();
    var isOpen = !$dropdown.hasClass('active');
    dropdown.closeAll($dropdown);
    dropdown.toggle($dropdown, isOpen);
  });

  // Вибір пункту
  $doc.on('click', '.dropdown-item', function () {
    var $item = $(this);
    var $dropdown = $item.closest('.dropdown');

    $item.addClass('active').siblings('.dropdown-item').removeClass('active');

    // Кастомний селект: текст пункту → у кнопку, значення → у data-value і в input[type=hidden]
    if ($dropdown.hasClass('select')) {
      var value = $item.data('value') !== undefined ? $item.data('value') : $item.text().trim();
      var $label = $dropdown.find('.dropdown-label');
      if (!$label.length) $label = $dropdown.find('.dropdown-toggle');
      $label.text($item.text().trim());
      $dropdown.attr('data-value', value);
      $dropdown.find('input[type="hidden"]').val(value).trigger('change');
      $dropdown.trigger('dropdown:change', [value, $item]);
    }

    dropdown.toggle($dropdown, false);
  });

  // Клік поза dropdown закриває його
  $doc.on('click', function (e) {
    if (!$(e.target).closest('.dropdown').length) dropdown.closeAll();
  });

  // Esc закриває відкриті тогли і дропдауни
  $doc.on('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $('[data-toggle][aria-expanded="true"]').trigger('click');
    dropdown.closeAll();
  });

  // ---------- Код проєкту ----------

});
