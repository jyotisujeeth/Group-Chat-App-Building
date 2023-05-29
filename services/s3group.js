const AWS = require('aws-sdk');

// Initialize the S3 service
const s3 = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_SECRET_KEY
});

const uploadS3 = (data, filename) => {
    console.log("services s3 data",data)
    const BUCKET_KEY = process.env.BUCKET_NAME;

    return new Promise((resolve, reject) => {
        const params = {
            Bucket: BUCKET_KEY,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        };

        s3.upload(params, (err, s3Result) => {
            if (err) {
                reject(err);
            } else {
                resolve(s3Result.Location);
            }
        });
    });
}

module.exports = {
    uploadS3
}