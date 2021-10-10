export const keyToKeyCode = JSON.parse(`
{
  "0": 48,
  "1": 49,
  "2": 50,
  "3": 51,
  "4": 52,
  "5": 53,
  "6": 54,
  "7": 55,
  "8": 56,
  "9": 57,
  "unk": 0,
  "mouse1": 1,
  "mouse2": 2,
  "break": 3,
  "mouse3": 4,
  "mouse4": 5,
  "mouse5": 6,
  "Backspace": 8,
  "Tab": 9,
  "Clear": 254,
  "Enter": 13,
  "Shift": 16,
  "Ctrl": 17,
  "Alt": 18,
  "Pause": 19,
  "CapsLock": 20,
  "imehangul": 21,
  "imejunja": 23,
  "imefinal": 24,
  "imekanji": 25,
  "Escape": 27,
  "imeconvert": 28,
  "imenonconvert": 29,
  "imeaccept": 30,
  "imemodechange": 31,
  "Space": 32,
  "pageup": 33,
  "pagedown": 34,
  "end": 35,
  "home": 36,
  "ArrowLeft": 37,
  "ArrowUp": 38,
  "ArrowRight": 39,
  "ArrowDown": 40,
  "Select": 41,
  "Print": 42,
  "execute": 43,
  "snapshot": 44,
  "insert": 45,
  "Delete": 46,
  "help": 47,
  ":": 58,
  ";": 186,
  "<": 60,
  "=": 187,
  ">": 62,
  "?": 63,
  "@": 64,
  "a": 65,
  "b": 66,
  "c": 67,
  "d": 68,
  "e": 69,
  "f": 70,
  "g": 71,
  "h": 72,
  "i": 73,
  "j": 74,
  "k": 75,
  "l": 76,
  "m": 77,
  "n": 78,
  "o": 79,
  "p": 80,
  "q": 81,
  "r": 82,
  "s": 83,
  "t": 84,
  "u": 85,
  "v": 86,
  "w": 87,
  "x": 88,
  "y": 89,
  "z": 90,
  "meta": 224,
  "menu": 93,
  "sleep": 95,
  "num0": 96,
  "num1": 97,
  "num2": 98,
  "num3": 99,
  "num4": 100,
  "num5": 101,
  "num6": 102,
  "num7": 103,
  "num8": 104,
  "num9": 105,
  "num*": 106,
  "num+": 107,
  "numenter": 108,
  "num-": 109,
  "num.": 110,
  "num/": 111,
  "f1": 112,
  "f2": 113,
  "f3": 114,
  "f4": 115,
  "f5": 116,
  "f6": 117,
  "f7": 118,
  "f8": 119,
  "f9": 120,
  "f10": 121,
  "f11": 122,
  "f12": 123,
  "f13": 124,
  "f14": 125,
  "f15": 126,
  "f16": 127,
  "f17": 128,
  "f18": 129,
  "f19": 130,
  "f20": 131,
  "f21": 132,
  "f22": 133,
  "f23": 134,
  "f24": 135,
  "numlock": 144,
  "scrolllock": 145,
  "shiftleft": 160,
  "shiftright": 161,
  "ctrlleft": 162,
  "ctrlright": 163,
  "altleft": 164,
  "altright": 165,
  "browserback": 166,
  "browserforward": 167,
  "browserrefresh": 168,
  "browserstop": 169,
  "browsersearch": 170,
  "browserfavorites": 171,
  "browserhome": 172,
  "volumemute": 173,
  "volumedown": 174,
  "volumeup": 175,
  "nexttrack": 176,
  "prevtrack": 177,
  "stop": 178,
  "playpause": 179,
  "launchmail": 180,
  "launchmediaselect": 181,
  "launchapp1": 182,
  "launchapp2": 183,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "\`": 192,
  "[": 219,
  "\\\\": 220,
  "]": 221,
  "'": 222,
  "altgr": 226,
  "imeprocess": 229,
  "unicode": 231,
  "attention": 246,
  "crsel": 247,
  "exsel": 248,
  "eraseeof": 249,
  "play": 250,
  "zoom": 251,
  "noname": 252,
  "pa1": 253
}
`)

// TODO
export const keyToCode = JSON.parse(`{
  "0": "Digit0",
  "1": "Digit1",
  "2": "Digit2",
  "3": "Digit3",
  "4": "Digit4",
  "5": "Digit5",
  "6": "Digit6",
  "7": "Digit7",
  "8": "Digit8",
  "9": "Digit9",
  "unk": "Unidentified",
  "mouse1": "Unidentified",
  "mouse2": "Unidentified",
  "break": "Unidentified",
  "mouse3": "Unidentified",
  "mouse4": "Unidentified",
  "mouse5": "Unidentified",
  "Backspace": "Backspace",
  "tab": "Tab",
  "clear": "Clear",
  "Enter": "Enter",
  "Shift": "Shift",
  "Ctrl": "Control",
  "Alt": "Alt",
  "Pause": "Pause",
  "capslock": "CapsLock",
  "imehangul": "HangulMode",
  "imejunja": "JunjaMode",
  "imefinal": "FinalMode",
  "imekanji": "KanjiMode",
  "Escape": "Escape",
  "imeconvert": "Convert",
  "imenonconvert": "Convert",
  "imeaccept": "Accept",
  "imemodechange": "ModeChange",
  "Space": "Space",
  "pageup": "PageUp",
  "pagedown": "PageDown",
  "end": "End",
  "home": "Home",
  "ArrowLeft": "ArrowLeft",
  "ArrowUp": "ArrowUp",
  "ArrowRight": "ArrowRight",
  "ArrowDown": "ArrowDown",
  "Select": "Select",
  "Print": "Print",
  "execute": "Execute",
  "snapshot": "PrintScreen",
  "insert": "Insert",
  "Delete": "Delete",
  "help": "Help",
  ":": "Semicolon",
  ";": "Semicolon",
  "<": "Comma",
  "=": "Equal",
  ">": "Period",
  "?": "Slash",
  "@": "Digit0",
  "a": "KeyA",
  "b": "KeyB",
  "c": "KeyC",
  "d": "KeyD",
  "e": "KeyE",
  "f": "KeyF",
  "g": "KeyG",
  "h": "KeyH",
  "i": "KeyI",
  "j": "KeyJ",
  "k": "KeyK",
  "l": "KeyL",
  "m": "KeyM",
  "n": "KeyN",
  "o": "KeyO",
  "p": "KeyP",
  "q": "KeyQ",
  "r": "KeyR",
  "s": "KeyS",
  "t": "KeyT",
  "u": "KeyU",
  "v": "KeyV",
  "w": "KeyW",
  "x": "KeyX",
  "y": "KeyY",
  "z": "KeyZ",
  "meta": "Meta",
  "menu": "ContextMenu",
  "sleep": "Standby",
  "num0": "Unidentified",
  "num1": "Unidentified",
  "num2": "Unidentified",
  "num3": "Unidentified",
  "num4": "Unidentified",
  "num5": "Unidentified",
  "num6": "Unidentified",
  "num7": "Unidentified",
  "num8": "Unidentified",
  "num9": "Unidentified",
  "num*": "Unidentified",
  "num+": "Unidentified",
  "numenter": "Unidentified",
  "num-": "Unidentified",
  "num.": "Unidentified",
  "num/": "Unidentified",
  "f1": "F1",
  "f2": "F2",
  "f3": "F3",
  "f4": "F4",
  "f5": "F5",
  "f6": "F6",
  "f7": "F7",
  "f8": "F8",
  "f9": "F9",
  "f10": "F10",
  "f11": "F11",
  "f12": "F12",
  "f13": "F13",
  "f14": "F14",
  "f15": "F15",
  "f16": "F16",
  "f17": "F17",
  "f18": "F18",
  "f19": "F19",
  "f20": "F20",
  "f21": "F21",
  "f22": "F22",
  "f23": "F23",
  "f24": "F24",
  "numlock": "NumLock",
  "scrolllock": "ScrollLock",
  "shiftleft": "ShiftLeft",
  "shiftright": "ShiftRight",
  "ctrlleft": "ControlLeft",
  "ctrlright": "ControlRight",
  "AltLeft": "AltLeft",
  "altright": "AltRight",
  "metaleft": "MetaLeft",
  "metaright": "MetaRight",
  "browserback": "Unidentified",
  "browserforward": "Unidentified",
  "browserrefresh": "Unidentified",
  "browserstop": "Unidentified",
  "browsersearch": "Unidentified",
  "browserfavorites": "Unidentified",
  "browserhome": "Unidentified",
  "volumemute": "Unidentified",
  "volumedown": "Unidentified",
  "volumeup": "Unidentified",
  "nexttrack": "Unidentified",
  "prevtrack": "Unidentified",
  "stop": "Unidentified",
  "playpause": "Unidentified",
  "launchmail": "Unidentified",
  "launchmediaselect": "Unidentified",
  "launchapp1": "Unidentified",
  "launchapp2": "Unidentified",
  ",": "Comma",
  "-": "Minus",
  ".": "Period",
  "/": "Slash",
  "\`": "Backquote",
  "[": "BracketLeft",
  "\\\\": "Backslash",
  "]": "BracketRight",
  "\'": "Quote",
  "altgr": 226,
  "imeprocess": "Process",
  "unicode": "CodeInput",
  "attention": "Attn",
  "crsel": 247,
  "exsel": "ExSel",
  "eraseeof": "EraseEof",
  "play": 250,
  "zoomin": "ZoomIn",
  "zoomout": "ZoomOut",
  "noname": 252,
  "pa1": 253
}`)

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
export const DIGIT = '0123456789'
export const SYMBOL = `\`~|\\^{}+×÷=/_<>[]!@#$%&*()-'":;,.?`

export const CHARACTER = DIGIT + ALPHABET + SYMBOL

export function isAlphabetChar(key: string): boolean {
  return ALPHABET.includes(key.toLowerCase())
}

export function isChar(key: string): boolean {
  return CHARACTER.includes(key.toLowerCase())
}

export const keyCodeToKey = JSON.parse(
  `{
    "0": "unk",
    "1": "mouse1",
    "2": "mouse2",
    "3": "break",
    "4": "mouse3",
    "5": "mouse4",
    "6": "mouse5",
    "8": "Backspace",
    "9": "Tab",
    "12": "Clear",
    "13": "Enter",
    "16": "Shift",
    "17": "Ctrl",
    "18": "Alt",
    "19": "Pause",
    "20": "CapsLock",
    "21": "imehangul",
    "23": "imejunja",
    "24": "imefinal",
    "25": "imekanji",
    "27": "Escape",
    "28": "imeconvert",
    "29": "imenonconvert",
    "30": "imeaccept",
    "31": "imemodechange",
    "32": "Space",
    "33": "pageup",
    "34": "pagedown",
    "35": "end",
    "36": "home",
    "37": "ArrowLeft",
    "38": "ArrowUp",
    "39": "ArrowRight",
    "40": "ArrowDown",
    "41": "Select",
    "42": "Print",
    "43": "execute",
    "44": "snapshot",
    "45": "insert",
    "46": "Delete",
    "47": "help",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "58": ":",
    "59": ";",
    "60": "<",
    "61": "=",
    "62": ">",
    "63": "?",
    "64": "@",
    "65": "a",
    "66": "b",
    "67": "c",
    "68": "d",
    "69": "e",
    "70": "f",
    "71": "g",
    "72": "h",
    "73": "i",
    "74": "j",
    "75": "k",
    "76": "l",
    "77": "m",
    "78": "n",
    "79": "o",
    "80": "p",
    "81": "q",
    "82": "r",
    "83": "s",
    "84": "t",
    "85": "u",
    "86": "v",
    "87": "w",
    "88": "x",
    "89": "y",
    "90": "z",
    "91": "meta",
    "92": "meta",
    "93": "menu",
    "95": "sleep",
    "96": "num0",
    "97": "num1",
    "98": "num2",
    "99": "num3",
    "100": "num4",
    "101": "num5",
    "102": "num6",
    "103": "num7",
    "104": "num8",
    "105": "num9",
    "106": "num*",
    "107": "num+",
    "108": "numenter",
    "109": "num-",
    "110": "num.",
    "111": "num/",
    "112": "f1",
    "113": "f2",
    "114": "f3",
    "115": "f4",
    "116": "f5",
    "117": "f6",
    "118": "f7",
    "119": "f8",
    "120": "f9",
    "121": "f10",
    "122": "f11",
    "123": "f12",
    "124": "f13",
    "125": "f14",
    "126": "f15",
    "127": "f16",
    "128": "f17",
    "129": "f18",
    "130": "f19",
    "131": "f20",
    "132": "f21",
    "133": "f22",
    "134": "f23",
    "135": "f24",
    "144": "numlock",
    "145": "scrolllock",
    "160": "shiftleft",
    "161": "shiftright",
    "162": "ctrlleft",
    "163": "ctrlright",
    "164": "altleft",
    "165": "altright",
    "166": "browserback",
    "167": "browserforward",
    "168": "browserrefresh",
    "169": "browserstop",
    "170": "browsersearch",
    "171": "browserfavorites",
    "172": "browserhome",
    "173": "volumemute",
    "174": "volumedown",
    "175": "volumeup",
    "176": "nexttrack",
    "177": "prevtrack",
    "178": "stop",
    "179": "playpause",
    "180": "launchmail",
    "181": "launchmediaselect",
    "182": "launchapp1",
    "183": "launchapp2",
    "186": ";",
    "187": "=",
    "188": ",",
    "189": "-",
    "190": ".",
    "191": "/",
    "192": "\`",
    "219": "[",
    "220": "\\\\",
    "221": "]",
    "222": "'",
    "223": "meta",
    "224": "meta",
    "226": "altgr",
    "229": "imeprocess",
    "231": "unicode",
    "246": "attention",
    "247": "crsel",
    "248": "exsel",
    "249": "eraseeof",
    "250": "play",
    "251": "zoom",
    "252": "noname",
    "253": "pa1",
    "254": "clear"
  }`
)
