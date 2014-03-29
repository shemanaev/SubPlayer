/* global escape */

/**
 * Build URL query from arguments object
 */
function buildUrl(base, args) {
  'use strict';
  var s = base + '?'
  for (var arg in args) {
    s += encodeURIComponent(arg) + '=' + encodeURIComponent(args[arg]) + '&'
  }
  return s.slice(0, s.length - 1)
}

/**
 * Stupid URL parser
 */
function parseUrl(url) {
  'use strict';
  var a = document.createElement('a')
  a.href = url
  return a
}


function getBinary(url, callback, error) {
  'use strict';
  function onLoadHandler(event) {
    if (this.status === 200) {
      var array = new Uint8Array(this.response)
      callback(array)
    } else {
      error(this.status)
    }
  }

  function onErrorHandler(event) {
    error(event)
  }

  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  xhr.addEventListener('load', onLoadHandler, false)
  xhr.addEventListener('error', onErrorHandler, false)

  xhr.send()
}

// Map between cp1251 and utf8
var cp1251ToUTF8Map = {0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,12:12,13:13,14:14,15:15,16:16,17:17,18:18,19:19,20:20,21:21,22:22,23:23,24:24,25:25,26:26,27:27,28:28,29:29,30:30,31:31,32:32,33:33,34:34,35:35,36:36,37:37,38:38,39:39,40:40,41:41,42:42,43:43,44:44,45:45,46:46,47:47,48:48,49:49,50:50,51:51,52:52,53:53,54:54,55:55,56:56,57:57,58:58,59:59,60:60,61:61,62:62,63:63,64:64,65:65,66:66,67:67,68:68,69:69,70:70,71:71,72:72,73:73,74:74,75:75,76:76,77:77,78:78,79:79,80:80,81:81,82:82,83:83,84:84,85:85,86:86,87:87,88:88,89:89,90:90,91:91,92:92,93:93,94:94,95:95,96:96,97:97,98:98,99:99,100:100,101:101,102:102,103:103,104:104,105:105,106:106,107:107,108:108,109:109,110:110,111:111,112:112,113:113,114:114,115:115,116:116,117:117,118:118,119:119,120:120,121:121,122:122,123:123,124:124,125:125,126:126,127:127,128:1026,129:1027,130:8218,131:1107,132:8222,133:8230,134:8224,135:8225,136:8364,137:8240,138:1033,139:8249,140:1034,141:1036,142:1035,143:1039,144:1106,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,153:8482,154:1113,155:8250,156:1114,157:1116,158:1115,159:1119,160:160,161:1038,162:1118,163:1032,164:164,165:1168,166:166,167:167,168:1025,169:169,170:1028,171:171,172:172,173:173,174:174,175:1031,176:176,177:177,178:1030,179:1110,180:1169,181:181,182:182,183:183,184:1105,185:8470,186:1108,187:187,188:1112,189:1029,190:1109,191:1111,192:1040,193:1041,194:1042,195:1043,196:1044,197:1045,198:1046,199:1047,200:1048,201:1049,202:1050,203:1051,204:1052,205:1053,206:1054,207:1055,208:1056,209:1057,210:1058,211:1059,212:1060,213:1061,214:1062,215:1063,216:1064,217:1065,218:1066,219:1067,220:1068,221:1069,222:1070,223:1071,224:1072,225:1073,226:1074,227:1075,228:1076,229:1077,230:1078,231:1079,232:1080,233:1081,234:1082,235:1083,236:1084,237:1085,238:1086,239:1087,240:1088,241:1089,242:1090,243:1091,244:1092,245:1093,246:1094,247:1095,248:1096,249:1097,250:1098,251:1099,252:1100,253:1101,254:1102,255:1103}

function cp1251ToUTF8(s) {
  'use strict';

  var L = []
  var map = cp1251ToUTF8Map

  for (var i = 0; i < s.length; i++) {
    var ord = s[i]
    if (!(ord in map))
      throw new Error('Character "' + s.charAt(i) + '" is not supported by encoding converter!')
    L.push(String.fromCharCode(map[ord]))
  }

  return L.join('')
}

function uintToString(uintArray) {
  'use strict';

  var encodedString = String.fromCharCode.apply(null, uintArray)
  var decodedString = decodeURIComponent(escape(encodedString))

  return decodedString
}

/**
 * Try to use UTF8 first and fallback to CP1251 on fail
 */
function fixEncoding(s) {
  'use strict';

  var result
  try {
    result = uintToString(s)
  } catch (e) {
    result = cp1251ToUTF8(s)
  }

  return result
}
