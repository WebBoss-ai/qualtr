import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Import the presigner

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID, // Replace with actual access key
    secretAccessKey: process.env.SECRET_ACCESS_KEY, // Replace with actual secret key
  },
});

// Function to upload a file to S3
export async function uploadFileToS3(file) {
  console.log('Uploading file:', file.originalname);
  console.log('File buffer size:', file.buffer ? file.buffer.length : 'No buffer');

  const uploadParams = {
    Bucket: "qualtr", // Replace with your actual bucket name
    Key: `requirement_docs/${file.originalname}`,
    Body: file.buffer, // File buffer from Multer
    ContentType: file.mimetype || 'application/octet-stream',
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    console.log('S3 upload successful:', response);
    return {
      Location: `https://${uploadParams.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uploadParams.Key}`,
      ...response,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

export async function uploadFileToCompaniesDoc(file) {
  console.log('Uploading file to companies_doc:', file.originalname);
  console.log('File buffer size:', file.buffer ? file.buffer.length : 'No buffer');

  const uploadParams = {
    Bucket: "qualtr", // Replace with your actual bucket name
    Key: `companies_doc/${file.originalname}`, // Updated folder path
    Body: file.buffer, // File buffer from Multer
    ContentType: file.mimetype || 'application/octet-stream',
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    console.log('S3 upload successful:', response);
    return {
      Location: `https://${uploadParams.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uploadParams.Key}`,
      ...response,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

export async function getObjectURL(key) {
  try {
      const command = new GetObjectCommand({
          Bucket: "qualtr", 
          Key: key, 
        });
        console.log(key)
      const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
      console.log(url)
      return url;
  } catch (error) {
      console.error("Error generating presigned URL:", error);
      throw error;
  }
}