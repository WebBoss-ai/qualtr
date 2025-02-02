import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Import the presigner

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
export async function uploadFileToS3(file) {
  const uploadParams = {
    Bucket: "qualtr", // Replace with your actual bucket name
    Key: `requirement_docs/${file.originalname}`,
    Body: file.buffer, // File buffer from Multer
    ContentType: file.mimetype || 'application/octet-stream',
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    return {
      Location: `https://${uploadParams.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uploadParams.Key}`,
      ...response,
    };
  } catch (error) {
    throw error;
  }
}

export async function uploadVCLogoToS3(file) {
  const uploadParams = {
    Bucket: "qualtr", // Replace with your actual bucket name
    Key: `vc_logo/${file.originalname}`, // Store inside the vc_logo folder
    Body: file.buffer, // File buffer from Multer
    ContentType: file.mimetype || "application/octet-stream",
    ACL: "public-read", // Make the file publicly accessible (optional)
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    return {
      Location: `https://${uploadParams.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uploadParams.Key}`,
      ...response,
    };
  } catch (error) {
    console.error("Error uploading VC logo:", error);
    throw error;
  }
}

export async function uploadFileToCompaniesDoc(file) {
  const uploadParams = {
    Bucket: "qualtr", // Replace with your actual bucket name
    Key: `companies_doc/${file.originalname}`, // Updated folder path
    Body: file.buffer, // File buffer from Multer
    ContentType: file.mimetype || 'application/octet-stream',
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    return {
      Location: `https://${uploadParams.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uploadParams.Key}`,
      ...response,
    };
  } catch (error) {
    throw error;
  }
}

export async function uploadMarketerProfilePhoto(profilePhoto) {
  const uploadParams = {
    Bucket: "qualtr", // Replace with your actual bucket name
    Key: `marketer_profile_photos/${profilePhoto.originalname}`, // Updated folder path
    Body: profilePhoto.buffer, // File buffer from Multer
    ContentType: profilePhoto.mimetype || 'application/octet-stream',
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    return {
      Location: `https://${uploadParams.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uploadParams.Key}`,
      ...response,
    };
  } catch (error) {
    throw error;
  }
}

export async function getObjectURL(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: "qualtr",
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    return url;
  } catch (error) {
    throw error;
  }
}
export async function getObjectURL2(key) {
  try {
    // Validate the key
    if (typeof key !== "string" || !key.trim()) {
      throw new Error(`Invalid S3 key: ${key}`);
    }

    const command = new GetObjectCommand({
      Bucket: "qualtr", // Ensure the bucket name is correct
      Key: key.trim(),  // Trim any unexpected whitespace
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    return url;
  } catch (error) {
    console.error(`Error in getObjectURL for key "${key}":`, error);
    throw error;
  }
}

export async function uploadCampaignImages(file) {
  const uploadParams = {
    Bucket: "qualtr", // Replace with your actual bucket name
    Key: `campaign_images/${file.originalname}`, // Updated folder path for campaign images
    Body: file.buffer, // File buffer from Multer
    ContentType: file.mimetype || 'application/octet-stream',
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    return {
      Location: `https://${uploadParams.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uploadParams.Key}`,
      ...response,
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteCampaignImage(imageUrl) {
  try {
    // Extract the Key from the image URL
    const bucketName = "qualtr"; // Replace with your bucket name
    const region = s3Client.config.region;
    const key = imageUrl.replace(`https://${bucketName}.s3.${region}.amazonaws.com/`, '');

    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function deletePostMedia(mediaUrl) {
  try {
    // Extract the Key from the media URL
    const bucketName = "qualtr"; // Replace with your bucket name
    const region = s3Client.config.region;
    const key = mediaUrl.replace(`https://${bucketName}.s3.${region}.amazonaws.com/`, '');

    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    throw error;
  }
}

async function resolveRegion() {
  const runtimeConfig = s3Client.config;
  if (!runtimeConfig.region) {
    throw new Error("Region is missing from runtimeConfig");
  }
  return typeof runtimeConfig.region === "string"
    ? runtimeConfig.region
    : await runtimeConfig.region();
}


export async function uploadPostMedia(file, mediaType = 'images') {
  const folderPath = mediaType === 'images' ? 'post_images' : 'post_videos';
  const bucketName = "qualtr";
  const region = await resolveRegion();

  const uniqueFileName = `${Date.now()}-${file.originalname}`; // Ensure unique file names
  const uploadParams = {
    Bucket: bucketName,
    Key: `${folderPath}/${uniqueFileName}`, // Save unique file name in Key
    Body: file.buffer,
    ContentType: file.mimetype || 'application/octet-stream',
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    return {
      url: `https://${bucketName}.s3.${region}.amazonaws.com/${uploadParams.Key}`,
      key: uploadParams.Key, // Return Key for database
    };
  } catch (error) {
    throw error;
  }
}

export async function generatePostImageUrl(key) {
  if (!key || typeof key !== "string") {
    console.error(`Invalid key provided: ${key}`);
    throw new Error(`Invalid key: ${key}`);
  }

  try {
    const s3Key = key; // Use the key as is, without adding 'post_images/'

    const command = new GetObjectCommand({
      Bucket: "qualtr",
      Key: s3Key, // Use the correct S3 key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes expiration
    
    return url;
  } catch (error) {
    console.error(`Error generating signed URL for image key: ${key}`, error);
    throw error;
  }
}

export async function generatePostVideoUrl(key) {
  if (!key || typeof key !== "string") {
    console.error(`Invalid key provided: ${key}`);
    throw new Error(`Invalid key: ${key}`);
  }

  try {
    const s3Key = `post_videos/${key}`;

    const command = new GetObjectCommand({
      Bucket: "qualtr",
      Key: s3Key, // Change folder path for videos if needed
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes expiration

    return url;
  } catch (error) {
    console.error(`Error generating signed URL for video key: ${key}`, error);
    throw error;
  }
}