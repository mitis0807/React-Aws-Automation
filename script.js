
const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3();
var outputFile
var dataFromDynamodb
const bucketName = 'fovusassignmentbucket';
const tableName = 'filetablefovus';

const dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });

const params = {
  TableName: 'filetablefovus',
};

const folderPath = 'Users/mshah/Desktop/fovusassignmentbucket'
const folderPathOutputFile = 'Users/mshah/Desktop/outputContentFolder'
fs.mkdir(folderPath, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating folder:', err);
  } else {
    console.log('Folder created successfully');
  }
});
fs.mkdir(folderPathOutputFile, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating folder:', err);
  } else {
    console.log('Folder created successfully');
  }
});
dynamodb.scan(params, function(err, data) {
  if (err) {
    console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Scan succeeded.');
    dataFromDynamodb= data.Items;
    console.log('data from dynamodb',dataFromDynamodb)
    if(dataFromDynamodb){
      for(let i=0;i<dataFromDynamodb.length;i++){
        const trimmedStr = dataFromDynamodb[i].input_file_path.S.substring('fovusassignmentbucket/'.length);
        let downloadParams = {
          Bucket: 'fovusassignmentbucket',
          Key: trimmedStr,
        };
        console.log('download' ,downloadParams)
        console.log('sdjfhghfbkdvfe',downloadParams.Key)
        
        let localFilePath = `Users/mshah/Desktop/${dataFromDynamodb[i].input_file_path.S}`;
        console.log('local file path',localFilePath)
        const file = fs.createWriteStream(localFilePath);
        s3.getObject(downloadParams)
          .createReadStream()
          .on('error', (err) => {
            console.error('Error downloading file:', err);
          })
          .pipe(file)
          .on('close', () => {
            console.log('File downloaded successfully');
            
            const inputText = dataFromDynamodb[i].input_text.S;
            console.log('input text',inputText);
            const inputFile = localFilePath;
            console.log('input file',inputFile)
            
            fs.readFile(inputFile, 'utf8', (err, data) => {
              if (err) {
                console.error('Error reading input file:', err);
                return;
              }
             const  outputContent = `${data}:${inputText}`;
              console.log('output content',outputContent)
            const outputFile = `${folderPathOutputFile}/output_${trimmedStr}`;
              console
         
              fs.writeFile(outputFile, outputContent, (err) => {
                if (err) {
                  console.error('Error writing output file:', err);
                  return;
                }
                console.log(`Output file saved as ${outputFile}`);
                const uploadParams = {
                  Bucket: bucketName,
                  Key: outputFile.substring('Users/mshah/Desktop/outputContentFolder/'.length),
                  Body: outputContent,
                };
              
                s3.upload(uploadParams, (err, uploadData) => {
                  if (err) {
                    console.error('Error uploading file:', err);
                    return;
                  }
              
                  console.log('File uploaded successfully. S3 path:', uploadData.Location);
                  console.log('dhasdsd..........',`${bucketName}/${outputFile.substring('Users/mshah/Desktop/outputContentFolder/'.length)}`)
                  var outputPathFinal = `${bucketName}/${outputFile.substring('Users/mshah/Desktop/outputContentFolder/'.length)}`;
                  var inputPathFinal = `${inputFile.substring('Users/mshah/Desktop/'.length)}`;
                  const itemParams = {
                    TableName: tableName,
                    Item: {
                      id: { S: dataFromDynamodb[i].id.S }, 
                      input_text :{ S:inputText  },
                      input_file_path: { S:inputPathFinal  },
                      output_file_path: { S:outputPathFinal  }, 
                    },
                  };
                  
                 
                  dynamodb.putItem(itemParams, (err, data) => {
                    if (err) {
                      console.error('Error saving item in DynamoDB:', err);
                    } else {
                      console.log('Item saved successfully in DynamoDB');
                    }
                  });
                  
                });
              
              });
            });

          });

        


          }
          
        }
    // data.Items.forEach(function(item) {
    //   console.log('Item:', JSON.stringify(item, null, 2));
    // });
  }
});
console.log(dataFromDynamodb,'data.........')


// const file = fs.createWriteStream(localFilePath);
// s3.getObject(downloadParams)
//   .createReadStream()
//   .on('error', (err) => {
//     console.error('Error downloading file:', err);
//   })
//   .pipe(file)
//   .on('close', () => {
//     console.log('File downloaded successfully');
//   });

