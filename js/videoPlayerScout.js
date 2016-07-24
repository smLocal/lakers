/*
 * We essentially are only creating a script that finds the configuration
 * on the current script tag and injects the following on the page with the
 * proper configuration:
 *    <script src="..analytics.js" />
 *    <script src="...nbaCvpWrapper.js" />
 *    <script src="...cvp.js" // this is loaded by nbaCVPWrapper.js
 *    />
 *    <div id="a-video-container-with-a-uniqueID" />
 *
 * 1.) search from settings, and pass them to appropriate place
 */



/*------/opt/agent_home/xml-data/build-dir/NBACMS3-BASEFUNCTIONALITY-JOB1/src/main/js/lib/namespaceTools.js------*/
;
(function(namespace, settings, w, d) {
  if (!w[namespace]) {
    w[namespace] = {};
  }
  if (!w[namespace][settings]) {
    w[namespace][settings] = {};
  }
  if (!w[namespace].namespaceTools) {
    w[namespace].namespaceTools = w._nbaNamespaceTools = (function NamespaceTools(w, d, undefined) {
      var my = {},
        type = "NamespaceTools";

      my.safeCreate = function _safeCreate(namespaceChain) {
        if (namespaceChain) {
          if (namespaceChain instanceof Array) {
            var namespaces = namespaceChain;
          } else if (namespaceChain.indexOf(".") != -1) {
            var namespaces = namespaceChain.split(".");
          }
          if (namespaces) {
            var nsCount = namespaces.length,
              currNs = w;

            for (var i = 0; i < nsCount; i++) {
              if (!currNs[namespaces[i]]) {
                currNs = currNs[namespaces[i]] = {};
              } else {
                currNs = currNs[namespaces[i]];
              }
            }
            currNs = w;
          } else {
            if (!w[namespaceChain]) {
              w[namespaceChain] = {};
            }
          }
        }
      }

      return my;
    }(w,
      d));
  }
}("_nba", "settings", window, document));
/*
 * We essentially are only creating a script that finds the configuration
 * on the current script tag and injects the following on the page with the
 * proper configuration:
 *    <script src="..analytics.js" />
 *    <script src="...nbaCvpWrapper.js" />
 *    <script src="...cvp.js" // this is loaded by nbaCVPWrapper.js
 *    />
 *    <div id="a-video-container-with-a-uniqueID" />
 *
 * 1.) search for script tag's data-params, and pass them to a config object
 * 2.) merge config default objects and override objects together
 * 3.) Add approptriate markup for player
 * 4.) initialize the player with the correct cvp-config object
 */
/*------/opt/agent_home/xml-data/build-dir/NBACMS3-BASEFUNCTIONALITY-JOB1/src/main/js/cvp/scoutExternal.js------*/
/**
 * This is the scout file intended to be used to share our _nba.cvp
 * implementation with third-party sites. Having the scout file makes future
 * updates easier.
 * @namespace _nba.settings.scout.cvpExternal
 * @memberof! <global>
 */
;
(function(namespace, settings, scout, subNamespace, ns, w, d) {
  'use strict';
  ns.safeCreate([namespace, settings, scout, "cvp"]);
  ns.safeCreate([namespace, scout]);
  w[namespace][scout] = function() {
    var analyticsScript, nbaCvpScript, videoWrapper, videoContainer, videoPlayer,
      df = d.createDocumentFragment(),
      current = currentScript(this),
      // Generate a random hex-number string ([0-9a-f]) to use to identify the object
      random = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1),
      domId = "_nba_cvp_" + random,

      // Only use these options if you really know what you are doing.
      // They will affect all analytics on the page
      currentAnalytics = expandDataObj.call(current, {
        disableAutoPage: "data-analytics-disableautopage",
        league: "data-analytics-league",
        team: "data-analytics-team",
        section: "data-analytics-section"
      }),
      defaultStylings = {
        width: "1280px;"
      },
      playerStylings = expandDataObj.call(current, {
        height: "data-cvp-height",
        width: "data-cvp-width"
      }),
      legacyStylings = expandDataObj.call(current, {
        height: "data-height",
        width: "data-width",
        team: "data-team",
      }),
      playerStylings = deepExtend(deepExtend(defaultStylings, playerStylings), legacyStylings),
      // This is the map of the cvp settings to the data attributes on
      // the 'current' script tag
      currentOverrides = expandDataObj.call(current, {
        analytics: {
          videoPlayerName: "data-cvp-videoplayername",
          videoPlayerType: "data-cvp-videoplayertype"
        },
        adFree: "data-cvp-adfree",
        adSection: "data-cvp-adsection",
        context: "data-cvp-context",
        headline: "data-cvp-headline",
        description: "data-cvp-description",
        flashVars: {
          autostart: "data-cvp-autostart",
          contentId: "data-cvp-contentid",
          context: "data-cvp-context"
        },
        domId: "data-cvp-domid",
        playerType: "data-cvp-playertype"
      }),
      legacyOverrides = expandDataObj.call(current, {
        flashVars: {
          contentId: "data-videoid"
        },
      }),
      // These are the default cvp settings that should be applied to
      // all external video players.
      defaults = {
        analytics: {
          videoPlayerName: "TEMCVP",
          videoPlayerType: "external"
        },
        callbacks: {
          onContentEntryLoad: function onContentEntryLoad(my, s, playerId, contentId, queued) {
            if ((scoutCvp.headline && scoutCvp.headline == "true") || (scoutCvp.description && scoutCvp.description == "true")) {
              var videoMetaData = w.JSON.parse(my.getContentEntry(contentId)),
                playerWrapper = d.getElementById(s.domId + "_player_wrapper");
            }
            if (playerWrapper && scoutCvp.description && scoutCvp.description == "true") {
              var description = d.createElement("DIV");
              para = d.createElement("P");
              description.style.width = playerStylings && playerStylings.width ? playerStylings.width : '1280px';
              para.appendChild(d.createTextNode(videoMetaData.description));
              description.className = "nbaCvpDescription";
              description.appendChild(para);
              playerWrapper.parentNode.insertBefore(description, playerWrapper.nextSibling);
            }
            if (playerWrapper && scoutCvp.headline && scoutCvp.headline == "true") {
              var headline = d.createElement("DIV"),
                para = d.createElement("P"),
                bold = d.createElement("B");
              headline.style.width = playerStylings && playerStylings.width ? playerStylings.width : '1280px';
              bold.appendChild(d.createTextNode(videoMetaData.headline));
              para.appendChild(bold);
              headline.appendChild(para);
              headline.className = "nbaCvpHeadline";
              playerWrapper.parentNode.insertBefore(headline, playerWrapper.nextSibling);
            }
          },
          onCVPReady: function(my, s) {
            if (playerStylings.team) {
              var isMobile = CVP.Browser.isPlatform(CVP.Browser.MOBILE),
                teamInfo = teamMap(playerStylings.team),
                section;
              if (teamInfo) {
                section = "nba.com_teams_" + teamInfo.city + teamInfo.nick + "_articleplayer";
                if (isMobile) {
                  section = "nba.com_mobile_web_teamsites_" + teamInfo.city + teamInfo.nick;
                }
                s.adSection = scoutCvp.adSection = section;
                my.setAdSection(section);
              }
            }
          }
        },
        debug: false,
        domId: domId,
        flashVars: {
          autostart: "false",
        },
        instanceName: "external_" + (current.getAttribute("data-cvp-domid") ? current.getAttribute("data-cvp-domid") : random)
      },
      scoutCvp = deepExtend(defaults, deepExtend(currentOverrides, legacyOverrides));
    // Nothing can happen if there is no contentId
    if (!scoutCvp.flashVars || (scoutCvp.flashVars && !scoutCvp.flashVars.contentId)) {
      return;
    }

    /* Check if the analytics package is loaded on the page, if not, set it up. */
    if (!w[namespace].analytics) {
      /* Set some information about this scout file. */
      var sctAnalytics = {
        name: "pkgAnalyticsScout",
        nonsecure: "z.cdn.",
        source: "http://z.cdn.turner.com/nba/tmpl_asset/static/nba-cms3-base/347/js/pkgAnalytics.js",
        secure: "s.cdn."
      };
      addScript(turnerSecure(sctAnalytics), overrideAnalytics, df);
    } else {
      overrideAnalytics();
    }


    if (Number(playerStylings.width)) {
      playerStylings.width += 'px';
    }

    //Genearte
    videoWrapper = d.createElement('div');
    videoWrapper.id = (scoutCvp.domId ? scoutCvp.domId : domId) + "_wrapper";
    videoWrapper.className = "nbaCvpWrapper";
    videoWrapper.style.maxWidth = playerStylings.width;
    videoWrapper.style.width = '100%';
    videoWrapper.style.position = 'relative';
    videoWrapper.style.overflow = 'hidden';

    //Rough hack to make the player reponsive
    var ratioDiv = d.createElement('div');
    //Give it the height ratio of 16:9
    ratioDiv.style.paddingTop = '56.24%';
    videoWrapper.appendChild(ratioDiv);

    videoContainer = d.createElement('div');
    videoContainer.id = (scoutCvp.domId ? scoutCvp.domId : domId) + "_player_wrapper";
    videoContainer.style.width = '100%';
    videoContainer.style.height = '100%';
    videoContainer.style.position = 'absolute';
    videoContainer.style.top = 0;
    videoContainer.style.bottom = 0;
    videoContainer.style.left = 0;
    videoContainer.style.right = 0;
    videoWrapper.appendChild(videoContainer);

    videoPlayer = d.createElement('div');
    videoPlayer.id = (scoutCvp.domId ? scoutCvp.domId : domId);
    videoPlayer.className = "nbaCvpPlayer";
    videoContainer.appendChild(videoPlayer);

    df.appendChild(videoWrapper);

    if (!w[namespace].cvp) {
      /* Set some information about this scout file. */
      var sctCvp = {
        name: "pkgCvpExternalScout",
        nonsecure: "z.cdn.",
        source: "http://z.cdn.turner.com/nba/nba/scout/team/cvp/pkgCvp.js",
        secure: "s.cdn."
      };
      addScript(turnerSecure(sctCvp), _loadTimeout, df);
      if (d.readyState === 'complete') {
        init(w, namespace, scoutCvp)();
      }
    } else {
      if (d.readyState === 'complete') {
        init(w, namespace, scoutCvp)();
      }
      _loadTimeout();
    }
    /* Initialize when the DOM is ready. */
    addEvent(d, "DOMContentLoaded", init(w, namespace, scoutCvp));
    addEvent(w, "load", init(w, namespace, scoutCvp));

    /*=== Helper Functions ===*/
    function init(w, namespace, scoutCvp) {
        return function _init() {

          /* Check to make sure we have not already tried to initialize this instance. */
          if (!w[namespace][settings][scout].cvp[scoutCvp.instanceName] || (w[namespace][settings][scout].cvp[scoutCvp.instanceName] && !w[namespace][settings][scout].cvp[scoutCvp.instanceName].initialized)) {

            (w.console ? w.console.log((scoutCvp.domId ? scoutCvp.domId : domId) + " CVP instance is initializing.") : undefined);
            current.parentNode.insertBefore(df, current.nextSibling);

            /* Set the flag for this instance so that we won't try to initialize again. */
            w[namespace][settings][scout].cvp[scoutCvp.instanceName] = {
              initialized: true
            };
          } else {
            (w.console ? w.console.log((scoutCvp.domId ? scoutCvp.domId : domId) + " CVP instance is already initialized.") : undefined);
          }
        };
      }
      /* Actually create the instance. */
    function _loadTimeout() {

      w[namespace].cvp.createInstance(scoutCvp);
    }

    function overrideAnalytics() {
      var a = window._nba ? window._nba.analytics : undefined;
      for (override in currentAnalytics) {
        a.setOverride(override, currentAnalytics[override]);
      }

      // TODO: Fix a bug in analytics which makes the following override needed
      w[namespace].analytics.setOverride("server", w.location.hostname);
    }

    function turnerSecure(urlPatterns) {
      return (urlPatterns.source.replace("http:", "").replace(urlPatterns.nonsecure, (d.location.protocol == "http:" ? urlPatterns.nonsecure : urlPatterns.secure)));
    };

    /* Takes an object map of {key:'attribute'} and returns the same object map with
     * the 'attributes' expanded using getAttribute and pulled from the
     * element it was
     * called on.  the return object will be {key: "string"}
     * empty attributes will be added as empty strings.
     * Key/attributes pairs will be dropped from the object map if the
     * attribute doesn't
     * exist in the element.
     */

    function expandDataObj(obj) {
      var s, o, setting, options, key,
        bool = false,
        robj = {};
      for (setting in obj) {
        if (typeof obj[setting] === "string") {
          s = this.getAttribute(obj[setting]);
          if (typeof s === "string") {
            robj[setting] = s;
            bool = true;
          }
        } else if (getConsName(obj) === "Object") {
          o = expandDataObj.call(this, obj[setting]);
          if (o) {
            robj[setting] = o;
            bool = true;
          }
        }
      }
      return bool ? robj : null;
    }

    function deepExtend(destination, source) {
      if (!destination) {
        destination = {}
      }
      for (var property in source) {
        if (destination && source[property] && source[property].constructor &&
          source[property].constructor === Object) {
          destination[property] = destination[property] || {};
          deepExtend(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }

    function addScript(url, onload, df) {
      if (url && onload && df) {
        var script = d.createElement('script');
        script.src = url;
        script.onload = onload;
        df.appendChild(script);
        return df;
      }

      return null;
    }

    /* Though this could be put in a shared module, adding this to each core module so that basic initialization doesn't require other libraries/modules. */
    /* TODO: Once IE8 finally dies, this function will no longer be needed. */
    function addEvent(element, event, fn) {
      if (element.addEventListener) {
        element.addEventListener(event, fn, false);
      } else if (element.attachEvent) {
        if (element === d && event == "DOMContentLoaded") {
          element.attachEvent("onreadystatechange", fn);
        } else {
          element.attachEvent("on" + event, fn);
        }
      }
    }

    /* Get the constructor name */
    function getConsName(o) {
      var results = /function (.+)\(/.exec(o.constructor.toString());
      return (results && results.length > 1) ? results[1] : "";
    };

    function currentScript(o) {
      if (o && o.tagName) {
        return o;
      } else {
        var scripts = d.getElementsByTagName("script"),
          current = scripts[scripts.length - 1];
        return current;
      }
    };

    /*hack to get the team city info easilty.  It was between this or another network call*/
    function teamMap(team) {
      var teams = {
        "hawks": {
          "city": "atlanta",
          "nick": "hawks"
        },
        "celtics": {
          "city": "boston",
          "nick": "celtics"
        },
        "cavaliers": {
          "city": "cleveland",
          "nick": "cavaliers"
        },
        "pelicans": {
          "city": "neworleans",
          "nick": "pelicans"
        },
        "bulls": {
          "city": "chicago",
          "nick": "bulls"
        },
        "mavericks": {
          "city": "dallas",
          "nick": "mavericks"
        },
        "nuggets": {
          "city": "denver",
          "nick": "nuggets"
        },
        "warriors": {
          "city": "goldenstate",
          "nick": "warriors"
        },
        "rockets": {
          "city": "houston",
          "nick": "rockets"
        },
        "clippers": {
          "city": "losangeles",
          "nick": "clippers"
        },
        "lakers": {
          "city": "losangeles",
          "nick": "lakers"
        },
        "heat": {
          "city": "miami",
          "nick": "heat"
        },
        "bucks": {
          "city": "milwaukee",
          "nick": "bucks"
        },
        "timberwolves": {
          "city": "minnesota",
          "nick": "timberwolves"
        },
        "nets": {
          "city": "brooklyn",
          "nick": "nets"
        },
        "knicks": {
          "city": "newyork",
          "nick": "knicks"
        },
        "magic": {
          "city": "orlando",
          "nick": "magic"
        },
        "pacers": {
          "city": "indiana",
          "nick": "pacers"
        },
        "sixers": {
          "city": "philadelphia",
          "nick": "76ers"
        },
        "suns": {
          "city": "phoenix",
          "nick": "suns"
        },
        "blazers": {
          "city": "portland",
          "nick": "trailblazers"
        },
        "kings": {
          "city": "sacramento",
          "nick": "kings"
        },
        "spurs": {
          "city": "sanantonio",
          "nick": "spurs"
        },
        "thunder": {
          "city": "oklahomacity",
          "nick": "thunder"
        },
        "raptors": {
          "city": "toronto",
          "nick": "raptors"
        },
        "jazz": {
          "city": "utah",
          "nick": "jazz"
        },
        "grizzlies": {
          "city": "memphis",
          "nick": "grizzlies"
        },
        "wizards": {
          "city": "washington",
          "nick": "wizards"
        },
        "pistons": {
          "city": "detroit",
          "nick": "pistons"
        },
        "hornets": {
          "city": "charlotte",
          "nick": "hornets"
        },
        "maccabi_electra": {
          "city": "telaviv",
          "nick": "maccabielectra"
        },
        "alba_berlin": {
          "city": "berlin",
          "nick": "albaberlin"
        },
        "fenerbahce_ulker": {
          "city": "istanbul",
          "nick": "fenerbahceulker"
        },
        "maccabi_haifa": {
          "city": "haifa",
          "nick": "maccabihaifa"
        },
        "flamengo": {
          "city": "riodejaneiro",
          "nick": "flamengo"
        }
      };
      return teams[team];
    }
  };
  w[namespace][scout]();
}("_nba", "settings", "scout", "cvpExternal", window._nbaNamespaceTools, window, document));

/*------/opt/agent_home/xml-data/build-dir/NBACMS3-BASEFUNCTIONALITY-JOB1/src/main/js/pkgCvpExternalScout.js------*/
