// @ts-nocheck
function showNav() {
  document.getElementById("nav_list").classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', function () {
  initDirectoryUi();
});

document.addEventListener('pjax:complete', function() {
  initDirectoryUi();
});

function initDirectoryUi() {
  const pjax = new Pjax({
    selectors: [
      "title",
      "#web_content"
    ]
  })

  directoryUi.initNavLink();
  directoryUi.listenNavScroll();
}