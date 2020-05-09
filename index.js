const fs = require('fs');
const superagent = require('superagent');

// ES6 bu özelliği destekliyor. Önceki sürümlerde yok !!!
// readFileProm fonksiyonu parametre olarak sadece "file"ı alıyor.
const readFileProm = (file) => {
  // resolve, reject yerine aslında istenilen şey yazılabilir ama bu isimler standard gibi
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      //burası parametre olarak alınan dog.txt dosyası bulunamazsa çalışacak. readFile'dan gelir.
      //konsolda (node:15628) UnhandledPromiseRejectionWarning: I could not find that file! gibi bir mesaj verir
      if (err) reject('I could not find that file!');
      //bu işlwv readFileProm'un çıktısı olarak düşünülebilir. then() işlevi için kullanılacak
      resolve(data);
    });
  });
};

const writeFileProm = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file!');
      resolve('success'); //writeFile'dan geri dönen bir data yok o nednele text yazdıldı
    });
  });
};

// readFileProm bir promise döndüğü için .then() işlevi kullanılabilir.
readFileProm(`${__dirname}/dog.txt`)
  // bu kısım readFileProm'un .then() işlevi
  .then((data) => {
    console.log(`Breed: ${data}`);

    // superagent get işlevi aslında promise döner. başına return koyarak bunu sağladık.
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  // bu kısım superagent'ın .then() işlevi
  .then((res) => {
    console.log(res.body.message);
    return writeFileProm('dog-img.txt', res.body.message);
  })
  // bu kısım writeFileProm'un .then() işlevi
  .then(() => {
	console.log('Random dog image path saved to file!'); 
  })
  // herhangi bir promise'den hata gelirse konsola yazacak. ilk hatada duracak.
  .catch((err) => {
    console.log('Error Massage: ' + err);
  });

//---- bu kısım yukarıdaki hale çevrildi !!! -------------------------
// readFileProm(`${__dirname}/dog.txt`).then((data) => {
//   console.log(`Breed: ${data}`);

//   // superagent get işlevi aslında promise döner.
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         console.log('Random dog image path saved to file!');
//       });
//     })
//     .catch((err) => {
//       console.log('Error Massage: ' + err.message);
//     });
// });

//--------------------------------------------------------------------
// fs.readFile(`${__dirname}/dog.txt`, 'utf-8', (err, data) => {
//   console.log(`Breed: ${data}`);

//   // superagent get işlevi aslında promise döner.
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         console.log('Random dog image path saved to file!');
//       });
//     })
//     .catch((err) => {
//       console.log('Error Massage: ' + err.message);
//     });
// });
