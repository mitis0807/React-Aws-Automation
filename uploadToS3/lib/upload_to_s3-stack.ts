import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs';

export class UploadToS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   

    const existingBucketName = 'fovusassignmentbucket';
    const existingBucket = s3.Bucket.fromBucketName(this, 'fovusassignmentbucket', existingBucketName);

 

    new s3deploy.BucketDeployment(this, 'DeployMyAsset', {
      sources: [s3deploy.Source.asset('/Users/mshah/Desktop/fovusassignment/script.js.zip')],
      destinationBucket: existingBucket,
    });
   
  }
}
