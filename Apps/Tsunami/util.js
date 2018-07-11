export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          resolve(allText);
        }
      }
    }
    rawFile.send(null);
  });
}

export function formatDate(year) {
  const isNegative = year < 0;
  return `${isNegative ? '-' : ''}${Math.abs(year).toString().padStart(4, '0')}-01-01T00:00:00Z`;
}