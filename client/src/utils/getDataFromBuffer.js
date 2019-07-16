const getDataFromBuffer = (buffer) => {

  if (buffer == undefined) {
    return [];
  }

  let str = "";

  for (let i = 0; i < buffer.length; i += 2) {
    let v = parseInt(buffer.substr(i, 2), 16);

    if (v) {
      str += String.fromCharCode(v);
    }
  }

  let params = [];
  let res = "";

  for (let i = 0; i <= str.length; i++) {
    if (str.charCodeAt(i) > 31) {
      res = res + str[i];
    } else {
      params.push(res);
      res = "";
    }
  }

  params.pop();
  params.reverse();

  return params;
}

export default getDataFromBuffer;
