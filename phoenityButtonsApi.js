var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");
var Services = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm");
var { MailUtils } = ChromeUtils.import("resource:///modules/MailUtils.jsm");
var xulAppInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);

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
              let targetToolbar = window.document.getElementById("tabbar-toolbar");
              let targetMailbar = window.document.getElementById("mail-bar3");
              let searchBox = window.document.getElementById("gloda-search");
              let addonsButton = window.document.getElementById("button-addons");
              let calendarTabButton = window.document.getElementById("calendar-tab-button");
              let quickFilterButton = window.document.getElementById("qfb-show-filter-bar");

              let configButton = window.document.getElementById("phb_configButton");
              if (configButton == null) { // add button
                //console.debug("configButton added");
                let configButton = window.document.createXULElement("toolbarbutton");
                configButton.id = "phb_configButton";
                configButton.setAttribute("class", "toolbarbutton-1");
                configButton.setAttribute("removable", "true");
                configButton.setAttribute("label", "Config");
                let configButtonIcon = context.extension.rootURI.resolve("icons/configButton.png");
                configButton.setAttribute("image", configButtonIcon);
                configButton.setAttribute("tooltiptext", "Config Editor");
                configButton.addEventListener("command", () => window.openDialog("about:config","","width=800,height=600,centerscreen,resizable"));
                targetToolbar.appendChild(configButton);
                //console.debug("configButton enabled");
              }

              let devToolsButton = window.document.getElementById("phb_devToolsButton");
              if (devToolsButton == null) { // add button
                //console.debug("devToolsButton added");
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
                //console.debug("devToolsButton enabled");
              }

              let prefsButton = window.document.getElementById("phb_prefsButton");
              if (prefsButton == null) { // add button
                //console.debug("prefsButton added");
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
                //console.debug("prefsButton enabled");
              }

              let searchButton = window.document.getElementById("phb_searchButton");
              if (searchButton == null) { // add button
                //console.debug("searchButton added");
                let searchButton = window.document.createXULElement("toolbarbutton");
                searchButton.id = "phb_searchButton";
                searchButton.setAttribute("class", "toolbarbutton-1");
                searchButton.setAttribute("removable", "true");
                searchButton.setAttribute("label", "Search");
                let searchButtonIcon = context.extension.rootURI.resolve("icons/searchButton.png");
                searchButton.setAttribute("image", searchButtonIcon);
                searchButton.setAttribute("tooltiptext", "Search Messages");
                searchButton.addEventListener("command", () => window.goDoCommand("cmd_searchMessages"));
                targetToolbar.appendChild(searchButton);
                //console.debug("searchButton enabled");
              }

              let restartButton = window.document.getElementById("phb_restartButton");
              if (restartButton == null) { // add button
                //console.debug("restartButton added");
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
                //console.debug("restartButton enabled");
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
    let configButton = window.document.getElementById("phb_configButton");
    if (configButton) {
      configButton.remove();
      //console.debug("configButton disabled");
    }
    let devToolsButton = window.document.getElementById("phb_devToolsButton");
    if (devToolsButton) {
      devToolsButton.remove();
      //console.debug("devToolsButton disabled");
    }
    let prefsButton = window.document.getElementById("phb_prefsButton");
    if (prefsButton) {
      prefsButton.remove();
      //console.debug("prefsButton disabled");
    }
    let searchButton = window.document.getElementById("phb_searchButton");
    if (searchButton) {
      searchButton.remove();
      //console.debug("searchButton disabled");
    }
    let restartButton = window.document.getElementById("phb_restartButton");
    if (restartButton) {
      restartButton.remove();
      //console.debug("restartButton disabled");
    }
  }
  ExtensionSupport.unregisterWindowListener("phoenityButtonsListener");
  //Services.obs.notifyObservers(null, "startupcache-invalidate");
  }
};
