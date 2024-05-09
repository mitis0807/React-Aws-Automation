"use strict";
// const s3 = require('@aws-cdk/aws-s3');
// // const s3deploy = require('@aws-cdk/aws-s3-deployment');
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkUploadFileToS3Stack = void 0;
// const myBucket = new s3.Bucket(this, 'fovusassignmentbucket');
// // new s3deploy.BucketDeployment(this, 'DeployFiles', {
// //   sources: [s3deploy.Source.asset('./folder')], 
// // });
// myBucket.upload('script.js')
// const { Construct, Stack, StackProps } = require('@aws-cdk/core');
var CDK = require("@aws-cdk/core");
var s3 = require("@aws-cdk/aws-s3");
var CdkUploadFileToS3Stack = /** @class */ (function (_super) {
    __extends(CdkUploadFileToS3Stack, _super);
    function CdkUploadFileToS3Stack(scope, id, props) {
        var _this = _super.call(this, scope, id, props) || this;
        // Create an S3 bucket
        var bucket = new s3.Bucket(_this, "MyBucket");
        return _this;
        // Upload a file to the bucket
        // bucket.upload('/Users/mshah/Desktop/fovusassignment/script.js');
    }
    return CdkUploadFileToS3Stack;
}(CDK.Stack));
exports.CdkUploadFileToS3Stack = CdkUploadFileToS3Stack;
