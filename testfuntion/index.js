 
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });
const { nanoid } = require('nanoid');
exports.handler = async (event) => {
    // Extract data from the POST request
    console.log(event.input_text)
    // Define parameters for DynamoDB PutItem operation
    const params = {
        TableName: 'filetablefovus',
        Item: marshall({
            'id':nanoid(),
          //  'id': (Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000).toString(),
            'input_text' : event.input_text,
            'input_file_path':event.input_file_path
            // Add other attributes as needed
        })
    };

    try {
        // Put data into DynamoDB table
        await dynamoDbClient.send(new PutItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data inserted successfully' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error inserting data' })
        };
    }
};
