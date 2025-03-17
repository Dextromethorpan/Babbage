// ==UserScript==
// @name         Tickets Page
// @version      20221213-1534
// @author       FG, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "NAAM" verbeteren.
// @match        *://www.w3.org/WAI/demos/bad/before/*
// @include      /regex mogelijkheid/
// @grant        none
// ==/UserScript==


// ==Debug shortcuts==
// ctrl alt e    Haal alle elementen aan de hand van een CSS selector op,
//               en markeer deze met een rode omlijning.
//               Er wordt een pop-up getoond die vraagt naar de selector.
// ctrl alt j    Voer het script handmatig uit.
// ctrl alt m    Verkrijg de coordinaten van de muiscursor en de
//               gegevens van het element onder de muiscursor. Toon deze
//               in de console.
// ==/Debug shortcuts==

// ==Built-in validator==
// @validator    ESLint (Tampermonkey)
// @url          https://eslint.org/
// @configure    https://eslint.org/docs/user-guide/configuring/
// ==/Built-in validator==

// ==External validator==
// @validator    JSLint (Edition v2022.11.20)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// ==/External validator==

// ==External validator settings==
// @description  Om JSLint handmatig in te stellen, indien nodig.
// @settings     Env...: "a browser"
// @globals      "performance", "AudioContext"
// @options      Allow...: "long lines"
// ==/External validator settings==

// --- [ ESLINT UITSCHAKELEN ] ---
// ESLint binnen Tampermonkey tijdelijk uitschakelen om meldingen over de
// instellingen voor JSLint te verbergen:
/* eslint-disable */

// --- [ INSTELLINGEN VOOR JSLINT ] ---
// Automatisch instellen van de externe validator:
/*jslint
    browser, long
*/
/*global
    performance, AudioContext
*/

// --- [ ESLINT INSCHAKELEN ] ---
// ESLint binnen Tampermonkey weer inschakelen voor de rest van het script:
/* eslint-enable */

// --- [ GLOBALE CONSTANTEN ] ---
// Schakel alle meldingen in de console in of uit. Zet de waarde op 'false'
// als je met het script klaar bent en definitief bij de klant plaatst:
const GLOBALDEBUG = true;
// In combinatie met globaldebug toont dit iedere aria-role binnen de dom
// in de console:
const DOMDEBUG = false;
// In combinatie met globaldebug toont dit iedere mutatie in de console:
const OBSERVERDEBUG = false;
// Schakel de debug sneltoetsen in of uit (zie regel 20):
const DEBUGSHORTCUTKEYS = false;
const APPNAME = "NAAM";

// --- [ PERFORMANCE METING ] ---
// Controleer of de browser de volgende functie ondersteund:
let START = (
    performance.now()
    ? performance.now()
    : null
);

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
// Bron: https://javascript.info/mutation-observer
// Filteren op veranderingen van attributen kan voor een negatieve impact op de
// performance zorgen. Met name binnen grote tabellen:
const OBSERVERCONTAINER = window.self.document;
const OBSERVERCONFIG = {
    // attributes: true,
    // attributeOldValue: true,
    // attributeFilter: ["class"],
    // characterData: true,
    // characterDataOldValue: true,
    childList: true,
    subtree: true
};

// --- [ DEBUG FUNCTIES ] ---
function debugConsoleMessage(level, error, message) {
    "use strict";
    // Geeft een debug message al dan wel of niet weer. Dit is afhankelijk van
    // de constant globaldebug:
    try {
        let newDate = null;
        let time = null;
        if (GLOBALDEBUG) {
            // Level 1 geeft alleen de boodschap weer, error is optioneel:
            if (level === 1) {
                if (error === 0) {
                    window.console.log(message);
                } else if (error === 1) {
                    window.console.error(message);
                }
            }
            // Level 2 geeft de boodschap inclusief het huidig aantal seconden
            // en milliseconden weer. Dit is te gebruiken voor en na het
            // uitvoeren van een functie om het verschil te berekenen:
            if (level === 2) {
                newDate = new Date();
                time = `${newDate.getSeconds()}:${newDate.getMilliseconds()}`;
                window.console.log(message, time, "ss:ms.");
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen:
        window.console.log(`Babbage debugConsoleMessage: ${err.message}`);
    }
}

// --- [ HELPER FUNCTIES ] ---
function check(object) {
    "use strict";
    // Controleer of een object niet de waarde null of undefined bevat en dat
    // het object een lengte heeft groter dan 0:
    try {
        if (object !== null && object !== undefined) {
            // Arrays en nodeLists kennen een lengte property. Als deze 0 is,
            // dan kun je er niets mee, geef dan 'false' terug:
            if (object.length !== undefined || object.hasOwnProperty("length")) {
                if (object.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
            // Als het element geen lengte property kent, dan is het in ieder
            // geval niet null en niet undefined, geef dan altijd true terug:
            return true;
        } else {
            return false;
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `check: ${err.message}`);
    }
}

function checkAttribute(object, attr, value) {
    "use strict";
    // Controleer of een attribuut van een object bestaat en of het
    // attribuut de waarde heeft die verwacht wordt:
    try {
        if (object.hasAttribute(attr) && object.getAttribute(attr) === value) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `checkAttribute: ${err.message}`);
    }
}

function setAriaLabel(target, label) {
    "use strict";
    // Plaats een aria-label op een gegeven element:
    try {
        // Controleer de lengte van het gegeven argument:
        if (check(label)) {
            // Maak alle labels uniform, kleine letters en geen spaties aan
            // het begin of het eind van de string:
            label = label.trim().toLowerCase();
            // Bestaat het aria-label al en is deze hetzelfde als wat je wenst
            // te plaatsen? Dan overslaan:
            if (target.getAttribute("aria-label") !== label) {
                target.setAttribute("aria-label", label);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setAriaLabel: ${err.message}`);
    }
}

function setTitle(target, title) {
    "use strict";
    // Plaats een title-attribuut met een waarde op een gegeven element:
    try {
        // Controleer de lengte van het gegeven argument:
        if (check(title)) {
            // Maak alle titles uniform, kleine letters en geen spaties aan
            // het begin of het eind van de string:
            title = title.trim().toLowerCase();
            // Bestaat de title al en is deze hetzelfde als wat je wenst
            // te plaatsen? Dan overslaan:
            if (target.getAttribute("title") !== title) {
                target.setAttribute("title", title);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setTitle: ${err.message}`);
    }
}

function setAttribute(target, attr, value) {
    "use strict";
    // Plaats een attribuut op een gegeven element:
    try {
        // Controleer de lengte van de gegeven argumenten:
        if (check(attr) && check(value)) {
            // Bestaat het attribuut al en is deze hetzelfde als wat je wenst
            // te plaatsen? Dan overslaan:
            if (target.getAttribute(attr) !== value) {
                target.setAttribute(attr, value);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setAttribute: ${err.message}`);
    }
}

function forEachSetAttribute(targets, attr, value) {
    "use strict";
    // Voeg atrributen toe aan elementen binnen een NodeList:
    try {
        // Controleer de opgegeven argumenten:
        if (check(targets) && check(attr) && check(value)) {
            // Voeg aan ieder element binnen de targets NodeList een
            // attribuut toe met een bepaalde waarde:
            targets.forEach(function (target) {
                setAttribute(target, attr, value);
            });
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `forEachSetAttribute: ${err.message}`);
    }
}

function removeAttribute(target, attr) {
    "use strict";
    // Verwijder een attribuut van een gegeven element:
    try {
        // Verwijder een attribuut alleen als het aanwezig is:
        if (target.hasAttribute(attr)) {
            target.removeAttribute(attr);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `removeAttribute: ${err.message}`);
    }
}

function reportRolesFromChildren(element) {
    "use strict";
    // Verkrijg alle aria-rollen van alle kind elementen en rapporteer deze in
    // een array naar de console:
    try {
        const elements = element.querySelectorAll("*");
        let roles = [];
        // Controleer of de constant een element kent:
        if (check(elements)) {
            elements.forEach(function (element) {
                // Controleer eerst of een element wel een aria-rol heeft:
                if (element.hasAttribute("role")) {
                    // Plaats de aria-role in een array, zodoende blijft
                    // de uitvoer richting de console beperkt:
                    roles.push(element.getAttribute("role"));
                }
            });
            debugConsoleMessage(1, 1, roles);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `reportRolesFromChildren: ${err.message}`);
    }
}

function qsAll(query) {
    "use strict";
    // Geeft een querySelectorAll-resultaat terug:
    try {
        return window.self.document.querySelectorAll(query);
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `qsAll: ${err.message}`);
    }
}

function qsSingle(query) {
    "use strict";
    // Geeft een enkel querySelector-resultaat terug:
    try {
        return window.self.document.querySelector(query);
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `qsSingle: ${err.message}`);
    }
}

function confirmationSoundSource() {
    "use strict";
    // Speel een "beep"-geluid ter confirmatie, zonder dat er
    // een externe bron nodig is, maar wel een media-src:
    try {
        const sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="); //jslint-quiet
        sound.play();
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `confirmationSoundSource: ${err.message}`);
    }
}

// Bron: https://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep
function confirmationSoundGenerated(duration) {
    "use strict";
    // Geef de duration door in ms, dus 1 seconde is 1000 ms.
    // Speel een door JavaScript gegenereerd "beep"-geluid ter confirmatie:
    try {
        let context = new AudioContext();
        let oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = 800;
        oscillator.connect(context.destination);
        oscillator.start();
        setTimeout(function () {
            oscillator.stop();
        }, duration);
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `confirmationSoundGenerated: ${err.message}`);
    }
}

// --- [ GENERIEKE FUNCTIES ] ---
function removeElements(query) {
    "use strict";
    // Verwijder elementen uit de DOM:
    try {
        const targets = qsAll(query);
        // Controleer of de constant een element kent:
        if (check(targets)) {
            // Verwijder ieder element binnen de targets NodeList:
            targets.forEach(function (target) {
                target.remove();
            });
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `removeElements: ${err.message}`);
    }
}

function setAttrForClass(className, attr, value) {
    "use strict";
    // Stel een enkel attribuut in voor generieke elementen:
    try {
        const elements = qsAll(className);
        // Controleer of de constant een element kent:
        if (check(elements)) {
            forEachSetAttribute(elements, attr, value);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setAttrForClass: ${err.message}`);
    }
}

function setRoleLabelForClass(className, role, label) {
    "use strict";
    // Stel een role en label in voor generieke elementen:
    try {
        const elements = qsAll(className);
        // Controleer of de constant een element kent:
        if (check(elements)) {
            elements.forEach(function (element) {
                setAttribute(element, "role", role);
                setAriaLabel(element, label);
            });
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setRoleLabelForClass: ${err.message}`);
    }
}

function setAttrForId(id, attr, value) {
    "use strict";
    // Stel een enkel attribuut in voor een uniek element:
    try {
        const element = qsSingle(id);
        // Controleer of de constant een element kent:
        if (check(element)) {
            setAttribute(element, attr, value);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setAttrForId: ${err.message}`);
    }
}

function setRoleLabelForId(id, role, label) {
    "use strict";
    // Stel een role en label in voor unieke elementen:
    try {
        const element = qsSingle(id);
        // Controleer of de constant een element kent:
        if (check(element)) {
            setAttribute(element, "role", role);
            setAriaLabel(element, label);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setRoleLabelForId: ${err.message}`);
    }
}

function setAttrForTag(tagName, attr, value) {
    "use strict";
    // Stel een enkel attribuut in voor generieke elementen:
    try {
        const elements = qsAll(tagName);
        // Controleer of de constant een element kent:
        if (check(elements)) {
            forEachSetAttribute(elements, attr, value);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setAttrForTag: ${err.message}`);
    }
}

function setStylePropValue(query, property, value, priority) {
    "use strict";
    // Geef elementen een andere stijl mee. Voor o.a. een beter contrast of om
    // een element zichtbaar te maken of juist te verbergen. Priority is niet
    // verplicht om op te geven. Priority heeft een standaardwaarde van een
    // lege string. Priority kan gebruikt worden om de nieuwe stijl voorrang te
    // geven ten opzichte van een al aanwezige stijl met de waarde "important":
    try {
        const elements = qsAll(query);
        // Controleer of de constant een element kent:
        if (check(elements)) {
            elements.forEach(function (element) {
                if (element.style.getPropertyValue(property) !== value) {
                    element.style.setProperty(property, value, priority);
                }
            });
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `setStylePropValue: ${err.message}`);
    }
}

function dblClickActiveElement() {
    "use strict";
    // Voert een dubbelklik uit op het actieve element. Bijvoorbeeld binnen een
    // tabel waarbij je moet dubbelklikken op een cel. Er wordt gebruikgemaakt
    // van een mouseevent om eventuele sandboxing tegen te gaan, dit is de
    // correcte manier om een dubbelklik uit te voeren met JavaScript:
    try {
        const element = window.self.document.activeElement;
        let clickEvent = null;
        // Controleer of de constant daadwerkelijk een element kent:
        if (check(element)) {
            // MDN-artikel: https://developer.mozilla.org/en-US/docs/Web/Events
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("dblclick", true, true);
            element.dispatchEvent(clickEvent);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `dblClickActiveElement: ${err.message}`);
    }
}

// --- [ SPECIFIEKE FUNCTIES ] ---
// Schrijf hier de functies specifiek voor de betreffende klant of applicatie.

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // alle functie aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van 'NAAM' te verbeteren:
    try {
        
        debugConsoleMessage(1, 0, "start changing title");
        
        // example of how to use a function to change the role and label of an element using css queries.
        // the function "setRoleLabelForClass" is defined above.
        setRoleLabelForClass("#main > p > img", "heading", "Citylights ticket offers"); 
        setAttrForClass("#main > p > img", "aria-level", "1");
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `accessibilityChanges: ${err.message}`);
    }
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
// Bron: https://javascript.info/mutation-observer
const domObserver = new MutationObserver(function (mutations) {
    "use strict";
    // Functies die aangeroepen moeten worden nadat er een mutatie binnen de
    // container heeft plaatsgevonden:
    try {
        if (OBSERVERDEBUG && GLOBALDEBUG) {
            // Binnen de constant 'OBSERVERCONFIG' configureer je de mutatie-
            // observer waar deze op moet letten. Als je bijvoorbeeld de optie
            // 'attributes' toevoegd, dan is de 'type' property 'attributes'
            // beschikbaar. Op deze manier kun je binnen de mutatieobserver gaan
            // filteren per mutatietype. Bijvoorbeeld een aparte functie voor
            // als kindelementen worden toegevoegd of een specifieke functie
            // draaien als een mutatie plaatsvindt met een bepaalde klassennaam:
            mutations.forEach(function (mutation) {
                debugConsoleMessage(1, 1, mutation.type);
            });
        }
        if (DOMDEBUG && GLOBALDEBUG) {
            // Extra informatie verkrijgen omtrent de DOM. De volgende functie
            // verkrijgt alle rollen binnen de huidige DOM:
            reportRolesFromChildren(window.self.document);
        }
        // Roep nu de algemene functie per mutatie aan. De foreach binnen de
        // eerste 'if' kan gebruikt worden als er specifiek op bepaalde mutaties
        // getriggerd moet worden:
        accessibilityChanges();
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `domObserver: ${err.message}`);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de mutatie observer. Container en config worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(OBSERVERCONTAINER, OBSERVERCONFIG);

// --- [ IFRAME CONTROLE ] ---
// Mutaties binnen een iframe worden afgehandeld. Maar er dient een mutatie
// plaats te vinden alvorens de aanpassingen binnen dit script toegepast worden:
if (window.top !== window.self) {
    try {
        window.onload = accessibilityChanges();
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `iframe controle: ${err.message}`);
    }
}

// --- [ SNELTOETS TOEVOEGEN ] ---
function addEventKeyDown() {
    "use strict";
    // Een functie van gemaakt zodat de eventListener aan het document-object
    // toegevoegd kan worden zodra het window-object klaar is met laden.
    // De sneltoetsen kunnen in- of uitgeschakeld worden met de globale constant
    // DEBUGSHORTCUTKEYS. Deze sneltoetsen uitschakelen in de release versie:
    try {
        if (DEBUGSHORTCUTKEYS) {
            window.self.document.addEventListener("keydown", function (keyEvent) {
                // Voer het script handmatig uit met de combinatie: ctrl + alt + j:
                if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyJ") {
                    accessibilityChanges();
                    debugConsoleMessage(1, 0, `Handmatig: ${APPNAME} script.`);
                    if (GLOBALDEBUG) {
                        window.alert(`Handmatig: ${APPNAME} script.`);
                    }
                }
                // Verkrijg de coordinaten van de muiscursor en de gegevens van het
                // element onder de muiscursor, met de combinatie: ctrl + alt + m:
                if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyM") {
                    const handleMouseMove = function (event) {
                        window.console.log(`Locatie: ${event.x}:${event.y}`);
                        window.console.log(window.self.document.elementFromPoint(event.x, event.y));
                    };
                    // Doorgeef-functie die handleMouseMove pas aanspreekt na het
                    // verstrijken van het opgegeven aantal miliseconden:
                    const throttle = function (func, delay) {
                        let prev = Date.now() - delay;
                        return function (...args) {
                            let current = Date.now();
                            if (current - prev >= delay) {
                                prev = current;
                                func.apply(null, args);
                            }
                        };
                    };
                    // Zorg voor een vertraging in de uitvoer van de locatie van de
                    // muiscursor, met name voor performance en het gebruiksgemak:
                    window.self.document.addEventListener("mousemove", throttle(handleMouseMove, 400));
                }
                // Haal alle elementen van een bepaald type op, met de combinatie: ctrl + alt + e:
                if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyE") {
                    let elements = null;
                    let output = [];
                    let input = window.prompt(
                        "Naar welk(e) element(en) wil je zoeken?",
                        "(Geef een geldige query in)"
                    );
                    if (check(input)) {
                        elements = qsAll(input);
                        // Controleer of er een element gevonden is:
                        if (check(elements)) {
                            elements.forEach(function (element) {
                                // Plaats de gevonden elementen in een array, zo
                                // blijft de uitvoer richting de console beperkt:
                                output.push(element);
                            });
                        }
                        debugConsoleMessage(1, 1, output);
                        setStylePropValue(input, "border-style", "dashed", "important");
                        setStylePropValue(input, "border-color", "red", "important");
                        setStylePropValue(input, "border-width", "3px", "important");
                    }
                }
            });
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `addEventKeyDown: ${err.message}`);
    }
}

// --- [ PERFORMANCE METING ] ---
// Als de browser de functie 'performance.now' ondersteund, dan kan met deze
// funcie een grove schatting gemaakt worden hoe lang het script nodig heeft om
// uitgevoerd te worden. Deze functie geeft resultaat per window/frame:
(function () {
    "use strict";
    try {
        // Verkrijg, als mogelijk, de huidige tijd:
        let curr = (
            performance.now()
            ? performance.now()
            : null
        );
        if (check(START) && check(curr)) {
            debugConsoleMessage(1, 0, `Uitvoering duurde: ${curr - START} ms`);
        } else {
            // Geef een melding als 'performance.now' niet wordt ondersteund:
            window.console.warn("Performance meting is niet mogelijk.");
        }
    } catch (err) {
        // Functienaam en foutmelding naar de console sturen.
        // Geef alleen de boodschap weer inclusief inspringing:
        debugConsoleMessage(1, 1, `Performance meting: ${err.message}`);
    }
}());

// --- [ EINDE SCRIPT ] ---
// Plaats een addEventListener op het window-object zodra het geladen is, dan
// kan de eventListener voor de sneltoetsen aan het window.document-object
// toegevoegd worden:
window.addEventListener("load", addEventKeyDown);

// Als de volgende melding in de console wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden. Dit is sinds de exit van
// Internet Explorer niet relevant meer. Onder Trixie (oude scripts) moet je dit
// wel goed controleren:
debugConsoleMessage(1, 0, `Einde script voor ${APPNAME}.`);

setTimeout(function () {
    accessibilityChanges();
}, 100);
