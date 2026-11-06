
const ImageKit = require('@imagekit/nodejs').default
const {toFile} = require('@imagekit/nodejs')

const client = new ImageKit({

    privateKey:process.env.IMAGE_KIT_PRIVATE_KEY
})

 async function storageService({buffer,filename,folder=""}){

 const file =  await client.files.upload({
  file: await toFile(Buffer.from(buffer)),
  fileName: filename,
  folder
});

return file 

}

module.exports = {
    storageService
}