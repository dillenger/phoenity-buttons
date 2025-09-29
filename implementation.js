var { ExtensionCommon } = ChromeUtils.importESModule("resource://gre/modules/ExtensionCommon.sys.mjs");
var { ExtensionSupport } = ChromeUtils.importESModule("resource:///modules/ExtensionSupport.sys.mjs");
var { MailUtils } = ChromeUtils.importESModule("resource:///modules/MailUtils.sys.mjs");

var phoenityButtonsApi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      phoenityButtonsApi: {
        async phoenityButtons() {
          ExtensionSupport.registerWindowListener("phoenityButtonsListener", {
            chromeURLs: [
              "chrome://messenger/content/messenger.xhtml",
            ],
            onLoadWindow(window) {
              let targetToolbar = window.document.getElementById("tabs-toolbar");
              targetToolbar.setAttribute("mode", "icons");

              let addonsButton = window.document.getElementById("phb_addonsButton");
              if (addonsButton == null) {
                let addonsButton = window.document.createXULElement("toolbarbutton");
                addonsButton.id = "phb_addonsButton";
                addonsButton.setAttribute("class", "toolbarbutton-1");
                addonsButton.setAttribute("removable", "true");
                addonsButton.setAttribute("label", "addons");
                let addonsButtonIcon = context.extension.rootURI.resolve("icons/addonsButton.png");
                addonsButton.setAttribute("image", addonsButtonIcon);
                addonsButton.setAttribute("tooltiptext", "Add-ons and Themes");
                addonsButton.addEventListener("command", () => window.openAddonsMgr());
                targetToolbar.appendChild(addonsButton);
              }

              let configButton = window.document.getElementById("phb_configButton");
              if (configButton == null) {
                let configButton = window.document.createXULElement("toolbarbutton");
                configButton.id = "phb_configButton";
                configButton.setAttribute("class", "toolbarbutton-1");
                configButton.setAttribute("removable", "true");
                configButton.setAttribute("label", "Config");
                let configButtonIcon = context.extension.rootURI.resolve("icons/configButton.png");
                configButton.setAttribute("image", configButtonIcon);
                configButton.setAttribute("tooltiptext", "Config Editor");
                configButton.addEventListener("command", () => window.openContentTab("about:config"));
                targetToolbar.appendChild(configButton);
              }

              let devToolsButton = window.document.getElementById("phb_devToolsButton");
              if (devToolsButton == null) {
                let devToolsButton = window.document.createXULElement("toolbarbutton");
                devToolsButton.id = "phb_devToolsButton";
                devToolsButton.setAttribute("class", "toolbarbutton-1");
                devToolsButton.setAttribute("removable", "true");
                devToolsButton.setAttribute("label", "DevTools");
                let devToolsButtonIcon = context.extension.rootURI.resolve("icons/devToolsButton.png");
                devToolsButton.setAttribute("image", devToolsButtonIcon);
                devToolsButton.setAttribute("tooltiptext", "Developer Tools");
                devToolsButton.addEventListener("command", () => window.BrowserToolboxLauncher.init());
                targetToolbar.appendChild(devToolsButton);
              }

              let prefsButton = window.document.getElementById("phb_prefsButton");
              if (prefsButton == null) {
                let prefsButton = window.document.createXULElement("toolbarbutton");
                prefsButton.id = "phb_prefsButton";
                prefsButton.setAttribute("class", "toolbarbutton-1");
                prefsButton.setAttribute("removable", "true");
                prefsButton.setAttribute("label", "Options");
                let prefsButtonIcon = context.extension.rootURI.resolve("icons/prefsButton.png");
                prefsButton.setAttribute("image", prefsButtonIcon);
                prefsButton.setAttribute("tooltiptext", "Preferences");
                prefsButton.addEventListener("command", () => window.openOptionsDialog());
                targetToolbar.appendChild(prefsButton);
              }

              let searchButton = window.document.getElementById("phb_searchButton");
              if (searchButton == null) {
                let searchButton = window.document.createXULElement("toolbarbutton");
                searchButton.id = "phb_searchButton";
                searchButton.setAttribute("class", "toolbarbutton-1");
                searchButton.setAttribute("removable", "true");
                searchButton.setAttribute("label", "Search");
                let searchButtonIcon = context.extension.rootURI.resolve("icons/searchButton.png");
                searchButton.setAttribute("image", searchButtonIcon);
                searchButton.setAttribute("tooltiptext", "Search Messages");
                searchButton.addEventListener("command", () => window.searchAllMessages());
                searchButton.style.maxWidth = "0px";
                targetToolbar.appendChild(searchButton);
              }

              let restartButton = window.document.getElementById("phb_restartButton");
              if (restartButton == null) {
                let restartButton = window.document.createXULElement("toolbarbutton");
                restartButton.id = "phb_restartButton";
                restartButton.setAttribute("class", "toolbarbutton-1");
                restartButton.setAttribute("removable", "true");
                restartButton.setAttribute("label", "Restart");
                let restartButtonIcon = context.extension.rootURI.resolve("icons/restartButton.png");
                restartButton.setAttribute("image", restartButtonIcon);
                restartButton.setAttribute("tooltiptext", "Restart Thunderbird");
                restartButton.addEventListener("command", () => MailUtils.restartApplication());
                targetToolbar.appendChild(restartButton);
              }
            },
          });
        },
      },
    };
  }

  onShutdown(isAppShutdown) {
  if (isAppShutdown) return;

  for (let window of Services.wm.getEnumerator("mail:3pane")) {
    let addonsButton = window.document.getElementById("phb_addonsButton");
    if (addonsButton) {
      addonsButton.remove();
    }
    let configButton = window.document.getElementById("phb_configButton");
    if (configButton) {
      configButton.remove();
    }
    let devToolsButton = window.document.getElementById("phb_devToolsButton");
    if (devToolsButton) {
      devToolsButton.remove();
    }
    let prefsButton = window.document.getElementById("phb_prefsButton");
    if (prefsButton) {
      prefsButton.remove();
    }
    let searchButton = window.document.getElementById("phb_searchButton");
    if (searchButton) {
      searchButton.remove();
    }
    let restartButton = window.document.getElementById("phb_restartButton");
    if (restartButton) {
      restartButton.remove();
    }
  }
  ExtensionSupport.unregisterWindowListener("phoenityButtonsListener");
  //Services.obs.notifyObservers(null, "startupcache-invalidate");
  }
};
