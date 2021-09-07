let prototypeFaces = [...document.querySelectorAll(".prototype .face")];
let scenes = [...document.querySelectorAll(".scene")];
let floors = [...document.querySelectorAll(".floor")];

// Pick 6 random images from Unsplash.com
let promisedImgs = [
  fetch("https://source.unsplash.com/576x576/?trees"),
  fetch("https://source.unsplash.com/576x576/?mountain"),
  fetch("https://source.unsplash.com/576x576/?city"),
  fetch("https://source.unsplash.com/576x576/?sea"),
  fetch("https://source.unsplash.com/576x576/?technology"),
  fetch("https://source.unsplash.com/576x576/?mechanics")
];

let imgUrls;
(async function () {
  let imgs = await Promise.all(promisedImgs);
  imgUrls = imgs.map(img => img.url);
  console.log(imgUrls);
  init();
})();

function init() {
  console.log("App is ready!");
  document.querySelector(".prototype")
    .classList.remove("loading");
  
  setPrototypeFaces();
  
  // Pick the correct one
  let rnd = Math.floor(Math.random() * 6);
  scenes.forEach((scene, i) => {
    let name = "cube";
    if (i === rnd) {
      name += "-right"
    }
    let cube = createCube(`${name}-${i}`, i === rnd);
    scene.appendChild(cube);
    setTimeout(() => {
      floors[i].classList.add("visible");
      cube.classList.add("visible");
    }, i * 200);
  });
}

function setPrototypeFaces() {
  imgUrls.forEach((url, i) =>
    prototypeFaces[i].style.backgroundImage = `url(${url})`
  );
}

function createCube(cubeName, isCorrect) {
  let cube = document.createElement("DIV");
  cube.classList.add("cube");
  cube.classList.add(cubeName);
  
  let topFace = document.createElement("DIV");
  topFace.classList.add("face");
  topFace.classList.add("top");
  topFace.style.transform = "translateZ(5em)";
  cube.appendChild(topFace);
  
  let leftFace = document.createElement("DIV");
  leftFace.classList.add("face");
  leftFace.classList.add("left");
  leftFace.style.transform = "translateZ(2.5em) rotateX(-90deg) rotateY(-90deg) translateZ(2.5em)";
  cube.appendChild(leftFace);
  
  let frontFace = document.createElement("DIV");
  frontFace.classList.add("face");
  frontFace.classList.add("front");
  frontFace.style.transform = "translateZ(2.5em) rotateX(-90deg) translateZ(2.5em)";
  cube.appendChild(frontFace);
  
  let rightFace = document.createElement("DIV");
  rightFace.classList.add("face");
  rightFace.classList.add("right");
  rightFace.style.transform = "translateZ(2.5em) rotateX(-90deg) rotateY(90deg) translateZ(2.5em)";
  cube.appendChild(rightFace);
  
  let backFace = document.createElement("DIV");
  backFace.classList.add("face");
  backFace.classList.add("back");
  backFace.style.transform = "translateZ(2.5em) rotateY(180deg) rotateX(90deg) translateZ(2.5em)";
  cube.appendChild(backFace);
  
  let bottomFace = document.createElement("DIV");
  bottomFace.classList.add("face");
  bottomFace.classList.add("bottom");
  bottomFace.style.transform = "rotateX(180deg)";
  cube.appendChild(bottomFace);
  
  let faces = [...cube.querySelectorAll(".face")];
  if (isCorrect) {
    imgUrls.forEach((url, i) =>
      faces[i].style.backgroundImage = `url(${url})`
    );
  } else {
    let _imgUrls = [...imgUrls];
    for (let i = 0; _imgUrls.length; i++) {
      let url = _imgUrls.splice(
        Math.floor(
          Math.random() * _imgUrls.length
        ),
        1
      ).pop();
      faces[i].style.backgroundImage = `url(${url})`
    }
  }
  
  // Randomly rotate by +/-90deg along either X or Y
  let deg;
  if (Math.random() < 0.25) {
    deg = 90;
  } else if (Math.random() < 0.5) {
    deg = 90;
  } else if (Math.random() < 0.75) {
    deg = 180;
  } else {
    deg = -180;
  }
  let rotate;
  if (Math.random() < 0.5) {
    rotate = `translate(-50%, -50%) rotateX(${deg}deg) `;
  } else {
    rotate = `translate(-50%, -50%) rotateY(${deg}deg)`;
  }
  
  cube.style.transform = rotate;
  
  cube.addEventListener("click", () => checkCube(cube));
  
  return cube;
}

function checkCube(cube) {
  let imgUrls = prototypeFaces
    .map(face => face.style.backgroundImage);
  let _imgUrls = [...cube.querySelectorAll(".face")]
    .map(face => face.style.backgroundImage);
  let valid = true;
  for (let index in imgUrls) {
    if (imgUrls[index] !== _imgUrls[index]) {
      valid = false;
      break;
    }
  }
  if (valid) {
    document.body.classList.add("rightAnswer");
    console.log("YAY");
    setTimeout(() => {
      document.body.classList.remove("rightAnswer")
      scenes.forEach((scene, i) => {
        scene.removeChild(scene.lastElementChild)
      });
      init();
    }, 1000);
  }
  document.body.classList.add("wrongAnswer");
  setTimeout(() =>
    document.body.classList.remove("wrongAnswer")
  , 1000);
  console.log("NOPE");
}