export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          console.log(allText);
          resolve(allText);
        }
      }
    }
    rawFile.send(null);
  });
}