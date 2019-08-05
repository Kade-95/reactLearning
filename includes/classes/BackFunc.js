class BackFunc {

  constructor() {
    this.capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.smalls = "abcdefghijklmnopqrstuvwxyz";
    this.digits = "1234567890";
    this.symbols = ",./?'!@#$%^&*()-_+=`~\\| ";
    this.months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var hash = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";
  }

  removeDuplicate(haystack) {
    var single = [];
    for (var x in haystack) {
      if (!this.hasString(single, haystack[x])) {
        single.push(haystack[x]);
      }
    }
    return single;
  }

  async runParallel(functions, callBack) {
    var results = {};
    for (var f in functions) {
      results[f] = await functions[f];
    }
    callBack(results);
  }

  addCommaToMoney(money) {
    var inverse = '';
    for (var i = money.length - 1; i >= 0; i--) {
      inverse += money[i];
    }

    money = "";

    for (var i = 0; i < inverse.length; i++) {
      position = (i + 1) % 3;
      money += inverse[i];
      if (position == 0) {
        if (i != inverse.length - 1) {
          money += ',';
        }
      }
    }
    inverse = '';

    for (var i = money.length - 1; i >= 0; i--) {
      inverse += money[i];
    }
    return inverse;
  }

  isCapital(value) {
    if (value.length == 1) {
      return this.isSubString(this.capitals, value);
    }
  }

  isSmall(value) {
    if (value.length == 1) {
      return this.isSubString(this.smalls, value);
    }
  }

  isSymbol(value) {
    if (value.length == 1) {
      return this.isSubString(this.symbols, value);
    }
  }

  isName(value) {
    for (var x in value) {
      if (this.isDigit(value[x])) {
        return false;
      }
    }
    return true;
  }

  isNumber(value) {
    for (var x in value) {
      if (!this.isDigit(value[x])) {
        return false;
      }
    }
    return value;
  }

  isPasswordValid(value) {
    var len = value.length;
    if (len > 7) {
      for (var a in value) {
        if (this.isCapital(value[a])) {
          for (var b in value) {
            if (this.isSmall(value[b])) {
              for (var c in value) {
                if (this.isDigit(value[c])) {
                  for (var d in value) {
                    if (this.isSymbol(value[d])) {
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  isTimeValid(time) {
    time = time.split(':');
    if (time.length == 2 || time.length == 3) {
      var hour = new Number(time[0]);
      var minutes = new Number(time[1]);
      var seconds = 0;
      var total = 0;

      if (time.length == 3) {
        seconds = new Number(time[2]);
        if (hour > 23 || hour < 0 || minutes > 59 || minutes < 0 || seconds > 59 || seconds < 0) {
          return false;
        }
      } else {
        if (hour > 23 || hour < 0 || minutes > 59 || minutes < 0) {
          return false;
        }
      }

      var total = (hour * 60 * 60) + (minutes * 60) + seconds;
      return total;
    }
    return false;
  }

  isDigit(value) {
    value = new String(value)
    if (value.length == 1) {
      return this.isSubString(this.digits, value);
    }
    return false;
  }

  isEmail(value) {
    var email_parts = value.split('@');
    if (email_parts.length != 2) {
      return false;
    } else {
      if (this.isSpaceString(email_parts[0])) {
        return false;
      }
      var dot_parts = email_parts[1].split('.');
      if (dot_parts.length != 2) {
        return false;
      } else {
        if (this.isSpaceString(dot_parts[0])) {
          return false;
        }
        if (this.isSpaceString(dot_parts[1])) {
          return false;
        }
      }
    }
    return true;
  }

  isDateValid(value) {
    if (this.isDate(value)) {
      if (this.isYearValid(value)) {
        if (this.isMonthValid(value)) {
          if (this.isDayValid(value)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isDayValid(value) {
    var v_day = "";
    for (var i = 0; i < 2; i++) {
      v_day += value[i + 8];
    }
    var limit = 0;
    var month = this.isMonthValid(value);

    if (month == '01') {
      limit = 31;
    } else if (month == '02') {
      if (this.isLeapYear(this.isYearValid(value))) {
        limit = 29;
      } else {
        limit = 28;
      }
    } else if (month == '03') {
      limit = 31;
    } else if (month == '04') {
      limit = 30;
    } else if (month == '05') {
      limit = 31;
    } else if (month == '06') {
      limit = 30;
    } else if (month == '07') {
      limit = 31;
    } else if (month == '08') {
      limit = 31;
    } else if (month == '09') {
      limit = 30;
    } else if (month == '10') {
      limit = 31;
    } else if (month == '11') {
      limit = 30;
    } else if (month == '12') {
      limit = 31;
    }

    if (limit < v_day) {
      return 0;
    }
    return v_day;
  }

  isDate(value) {
    var len = value.length;
    if (len == 10) {
      for (var x in value) {
        if (this.isDigit(value[x])) {
          continue;
        } else {
          if (x == 4 || x == 7) {
            if (value[x] == '-') {
              continue;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
      }
    } else {
      return false;
    }
    return true;
  }

  isMonthValid(value) {
    var v_month = "";
    for (var i = 0; i < 2; i++) {
      v_month += value[i + 5];
    }
    if (v_month > 12 || v_month < 1) {
      return 0;
    }
    return v_month;
  }

  isYearValid(value) {
    var year = this.date.getFullYear('Y');
    var v_year = "";
    for (var i = 0; i < 4; i++) {
      v_year += value[i + 0];
    }
    if (v_year > year) {
      return 0;
    }
    return v_year;
  }

  getYear(value) {
    var year = this.date.getFullYear('Y');
    var v_year = "";
    for (var i = 0; i < 4; i++) {
      v_year += value[i + 0];
    }
    return v_year;
  }

  isLeapYear(value) {
    if (value % 4 == 0) {
      if ((value % 100 == 0) && (value % 400 != 0)) {
        return false;
      }
      return true;
    }
    return false;
  }

  daysInMonth(month, year) {
    var days = 0;
    if (month == '01') {
      days = 31;
    } else if (month == '02') {
      if (this.isLeapYear(year)) {
        days = 29;
      } else {
        days = 28;
      }
    } else if (month == '03') {
      days = 31;
    } else if (month == '04') {
      days = 30;
    } else if (month == '05') {
      days = 31;
    } else if (month == '06') {
      days = 30;
    } else if (month == '07') {
      days = 31;
    } else if (month == '08') {
      days = 31;
    } else if (month == '09') {
      days = 30;
    } else if (month == '10') {
      days = 31;
    } else if (month == '11') {
      days = 30;
    } else if (month == '12') {
      days = 31;
    }
    return days;
  }

  dateValue(date) {
    var value = 0;
    var year = this.getYear(date) * 365;
    var month = 0;
    for (var i = 1; i < this.isMonthValid(date); i++) {
      month = this.daysInMonths(i, this.getYear(date)) / 1 + month / 1;
    }
    var day = this.isDayValid(date);
    value = (year / 1) + (month / 1) + (day / 1);

    return value;
  }

  today() {
    var today = new Date;
    var month = today.getMonth() / 1 + 1;
    if (month.length != 2) {
      month = '0' + month;
    }
    today = (today.getFullYear()) + '-' + month + '-' + today.getDate();
    return today;
  }

  objectLength(object) {
    return Object.keys(object).length;
  }

  dateWithToday(date) {
    var today = this.DateValue(this.Today());
    date = this.DateValue(date);

    if (date > today) {
      return 'future';
    } else if (date == today) {
      return 'today';
    } else {
      return 'past';
    }
  }

  dateString(date) {
    var year = new Number(this.getYear(date));
    var month = new Number(this.isMonthValid(date));
    var day = new Number(this.isDayValid(date));

    return day + ' ' + this.months[month - 1] + ', ' + year;
  }

  isSpaceString(value) {
    if (value == '') {
      return true;
    } else {
      for (var x in value) {
        if (value[x] != ' ') {
          return false;
        }
      }
    }
    return true;
  }

  deleteOccuranceOf(haystack, needle) {
    for (var i in haystack) {
      if (haystack[i] == needle) haystack.pop(i)
    }
    return haystack;
  }

  deleteArrayInPosition(haystack, position) {
    var tmp = [];
    for (var i = 0; i < haystack.length; i++) {
      if (i == position) {
        continue;
      }
      tmp.push(haystack[i]);
    }
    return tmp;
  }

  insertArrayInPosition(haystack, needle, insert) {
    var position = this.getPositionOfArray(haystack, needle);
    var tmp = [];
    for (var i = 0; i < haystack.length; i++) {
      tmp.push(haystack[i]);
      if (i == position) {
        tmp.push(insert);
      }
    }
    return tmp;
  }

  getPositionOfArray(haystack, needle) {
    for (var x in haystack) {
      if (JSON.stringify(haystack[x]) == JSON.stringify(needle)) {
        return x;
      }
    }
    return false;
  }

  hasArray(haystack, needle) {
    haystack = JSON.stringify(haystack);
    needle = JSON.stringify(needle);

    return (haystack.indexOf(needle) >= 0) ? true : false;
  }

  hasString(haystack, needle) {
    for (var x in haystack) {
      if (needle == haystack[x]) {
        return true;
      }
    }
    return false;
  }

  trem(needle) {
    //remove the prepended spaces
    if (needle[0] == ' ') {
      var new_needle = '';
      for (var i = 0; i < needle.length; i++) {
        if (i != 0) {
          new_needle += needle[i];
        }
      }
      needle = this.trem(new_needle);
    }

    //remove the appended spaces
    if (needle[needle.length - 1] == ' ') {
      var new_needle = '';
      for (var i = 0; i < needle.length; i++) {
        if (i != needle.length - 1) {
          new_needle += needle[i];
        }
      }
      needle = this.trem(new_needle);
    }
    return needle;
  }

  stringReplace(word, from, to) {
    var returnvalue = '';
    for (var x in word) {
      if (word[x] == from) {
        returnvalue += to;
        continue;
      }
      returnvalue += word[x];
    }
    return returnvalue;
  }

  implode(needle, haystack) {
    var word = '';
    for (var x in haystack) {
      if (x < haystack.length + new Number(1)) {
        word += haystack[x] + needle;
      } else {
        word += haystack[x];
      }
    }
    return word;
  }

  extract(arr, start, end) {
    var userIndex = typeof start === 'number',
      i,
      j;
    if (userIndex) {
      i = start;
      if (end) {
        j = arr.indexOf(end, i)
        return (j === -1) ? ['', -1] : [(i === j) ? '' : arr.slice(i, j), j + end.length];
      } else return arr.slice(i)
    } else {
      i = arr.indexOf(start)
      if (i !== -1) {
        i += start.length;
        if (end) {
          j = arr.indexOf(end, i);
          return (j !== -1) ? arr.slice(i, j) : ['', -1];
        } else return arr.slice(i)
      }
      return [];
    }
  }

  parseForm(boundary, data) {
    var form = {},
      delimeter = Buffer.from('\r\n--' + boundary),
      body = this.extract(data, '--' + boundary + '\r\n'),
      CR = Buffer.from('\r\n\r\n'),
      i = 0,
      head,
      name,
      filename,
      value,
      obj,
      type;
    if (body) {
      while (i !== -1) {
        [head, i] = this.extract(body, i, CR);
        name = this.extract(head, '; name="', '"').toString();
        filename = this.extract(head, '; filename="', '"').toString();
        type = this.extract(head.toString(), 'Content-Type: ');
        [value, i] = this.extract(body, i, delimeter);
        if (name) {
          obj = { filename: filename, type: type, value: value };
          if (form.hasOwnProperty(name)) {//avoid duplicates
            if (Array.isArray(form[name])) {
              form[name].push(obj);
            } else {
              form[name] = [form[name], obj];
            }
          } else {
            form[name] = obj;
          }
        }
        if (body[i] === 45 && body[i + 1] === 45) break;// '--'
        if (body[i] === 13 && body[i + 1] === 10) {
          i += 2; // \r\n
        } else {
          //error
        }
      }
    }
    return form;
  }

  readFileAsync(filename) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filename, function (err, data) {
        if (err)
          reject(err);
        else
          resolve(data);
      });
    });
  }

  objectToArray(obj) {
    var arr = [];
    Object.keys(obj).map((key) => {
      arr[key] = obj[key];
    });
    return arr;
  }

  getIp(req) {
    var ip = req.headers['x-forworded-for'];
    if (ip) {
      ip = ip.split(',')[0];
    } else {
      ip = req.connection.remoteAddress;
    }
    return ip;
  }

  converToRealPath(path) {
    if (path[path.length - 1] != '/') {
      path += '/';
    }
    return path;
  }

  isSpacialCharacter(char) {
    var specialcharacters = "'\\/:?*<>|!.";
    for (var i = 0; i < specialcharacters.length; i++) {
      if (specialcharacters[i] == char) {
        return true;
      }
    }
    return false;
  }

  countChar(haystack, needle) {
    var j = 0;
    for (var i = 0; i < haystack.length; i++) {
      if (haystack[i] == needle) {
        j++;
      }
    }
    return j;
  }

  isset(variable) {
    return (typeof variable !== 'undefined');
  }

  isnull(variable) {
    return variable === null;
  }

  urlSplitter(location) {
    if (this.isset(location)) {
      location = location.toString();
      var httpType = (location.indexOf('://') === -1) ? null : location.split('://')[0];
      var fullPath = location.split('://').pop(0);
      var host = fullPath.split('/')[0];
      var hostName = host.split(':')[0];
      var port = host.split(':').pop(0);
      var path = '/' + fullPath.split('/').pop(0);
      var pathName = path.split('?')[0];
      var queries = (path.indexOf('?') === -1) ? null : path.split('?').pop(0);


      var vars = {};

      if (queries != null) {
        var query = queries.split('&');
        for (var x in query) {
          var parts = query[x].split('=');
          if (parts[1]) {
            vars[this.stringReplace(parts[0], '-', ' ')] = this.stringReplace(parts[1], '-', ' ');
          } else {
            vars[this.stringReplace(parts[0], '-', ' ')] = '';
          }
        }
      }
      return { location: location, httpType: httpType, fullPath: fullPath, host: host, hostName: hostName, port: port, path: path, pathName: pathName, queries: queries, vars: vars };
    }
  }

  getUrlVars(location) {
    var queries = (location.indexOf('?') === -1) ? null : location.split('?').pop(0);
    var vars = {};

    if (queries != null) {
      var query = queries.split('&');
      for (var x in query) {
        var parts = query[x].split('=');
        if (parts[1]) {
          vars[this.stringReplace(parts[0], '-', ' ')] = this.stringReplace(parts[1], '-', ' ');
        } else {
          vars[this.stringReplace(parts[0], '-', ' ')] = '';
        }
      }
    }
    return vars;
  }

  generateRandom(length) {
    var string = this.capitals + this.smalls + this.digits;
    var alphanumeric = '';
    for (var i = 0; i < length; i++) {
      alphanumeric += string[Math.floor(Math.random() * string.length)];
    }
    return alphanumeric;
  }

  flip(haystack){
    var flipped = (Array.isArray(haystack))?[]:'';
    for(var i = haystack.length-1; i>=0; i--)       (Array.isArray(haystack))?flipped.push(haystack[i]):flipped+=haystack[i];

    return flipped;
  }

  userTypes(){
    return ['Select User Type', 'student', 'staff', 'admin'];
  }
}
module.exports = BackFunc;