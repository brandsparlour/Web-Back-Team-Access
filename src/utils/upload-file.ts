import { BlobServiceClient, ContainerClient, logger } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { Result } from "../interfaces/result";

const containerName: any = process.env.AZURE_CONTAINER_NAME;
const sasToken: any = process.env.AZURE_SAS_TOKEN;
const storageAccountName: any = process.env.AZURE_STORAGE_ACCOUNT;

interface UploadedFile {
  originalname: string;
  path: string;
}

export const uploadFilesToBlob = async (files: UploadedFile[]): Promise<Result<Array<{ url: string }>>> => {
  try {
    if (!files || files.length === 0) return Result.error("File Not found");

    const imageUrls = [];

    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net/?${sasToken}`);

    // get Container - full public read access
    const containerClient: ContainerClient = blobService.getContainerClient(containerName);

    // Upload each file
    for (const file of files) {
      let lastIndex = file.originalname.lastIndexOf(".");
      let mediaType = file.originalname.slice(lastIndex, file.originalname.length);
      let image: any = file.originalname.slice(0, lastIndex);
      let imageName = uuidv4(image);
      let imageType = mediaType;

      // create blobClient for container
      const blobClient = containerClient.getBlockBlobClient(imageName + imageType);

      // upload file
      await blobClient.uploadFile(file.path);

      logger.error("containerName", containerName, "sasToken", sasToken, "storageAccountName", storageAccountName);

      const imageURL: string = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${
        imageName + imageType
      }`;
      imageUrls.push({ url: imageURL });
    }

    return Result.ok(imageUrls);
  } catch (error) {
    logger.error(`Error uploading files to azure blob storage: => ${JSON.stringify(error)} \n ${error}`);

    return Result.error({
      customMessage: `Something went wrong while uploading assets to azure blob storage. ${error}`,
    });
  }
};

export const deleteFileToBlob = async (fileUrl: string) => {
  try {
    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net/?${sasToken}`);

    // get Container - full public read access
    const containerClient: ContainerClient = blobService.getContainerClient(containerName);

    const blobName = fileUrl.split("/")[4];

    const blobClient = containerClient.getBlobClient(blobName);

    // Check if the file exists
    const exists = await blobClient.exists();
    if (exists) {
      // Delete the file
      const response: any = await blobClient.delete();

      return response;
    } else {
      console.log(`File ${fileUrl} does not exist.`);
    }
  } catch (error) {
    logger.error(`Error deleting assets from azure blob storage: => ${JSON.stringify(error)}`);

    return Result.error({
      customMessage: "Something went wrong while deleting assets from azure blob storage.",
    });
  }
};
