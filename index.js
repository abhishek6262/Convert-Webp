const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const skipFiles = new Set();
const extensions = [".png", ".jpg", ".jpeg"];

function convertToWebP(imagePath) {
  const stat = fs.statSync(imagePath);

  if (stat.isDirectory()) {
    fs.readdirSync(imagePath).forEach((item) =>
      convertToWebP(path.join(imagePath, item))
    );
    return;
  }

  if (skipFiles.has(imagePath)) return;
  else if (extensions.indexOf(path.extname(imagePath)) === -1) return;

  const basePath = imagePath.substring(0, imagePath.lastIndexOf("."));
  let image = imagePath,
    imageSize = stat.size;

  extensions.forEach((extension) => {
    const tempImage = basePath + extension;

    if (tempImage === image) return;

    if (fs.existsSync(tempImage)) {
      const tempStat = fs.statSync(tempImage);

      if (imageSize < tempStat.size) {
        skipFiles.add(image);

        image = tempImage;
        imageSize = tempStat.size;
      } else {
        skipFiles.add(tempImage);
      }
    }
  });

  console.log("Converting: ", image);

  sharp(image)
    .webp()
    .toFile(basePath + ".webp")
    .then(() => {
      console.log("Converted: ", basePath + ".webp");
    });
}

convertToWebP("../wp-cms");
