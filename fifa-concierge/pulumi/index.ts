import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// DynamoDB Tables
const conversationTable = new aws.dynamodb.Table("fifa-conversations", {
    attributes: [
        { name: "userId", type: "S" },
        { name: "timestamp", type: "N" }
    ],
    hashKey: "userId",
    rangeKey: "timestamp",
    billingMode: "PAY_PER_REQUEST",
    tags: {
        Project: "FIFA-2026-Concierge",
        Environment: "Production"
    }
});

const userProfileTable = new aws.dynamodb.Table("fifa-user-profiles", {
    attributes: [
        { name: "userId", type: "S" }
    ],
    hashKey: "userId",
    billingMode: "PAY_PER_REQUEST",
    tags: {
        Project: "FIFA-2026-Concierge",
        Environment: "Production"
    }
});

const matchDataTable = new aws.dynamodb.Table("fifa-match-data", {
    attributes: [
        { name: "matchId", type: "S" },
        { name: "dateTime", type: "S" }
    ],
    hashKey: "matchId",
    rangeKey: "dateTime",
    billingMode: "PAY_PER_REQUEST",
    tags: {
        Project: "FIFA-2026-Concierge",
        Environment: "Production"
    }
});

// IAM Role for Lambda
const lambdaRole = new aws.iam.Role("fifa-lambda-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "lambda.amazonaws.com"
            }
        }]
    }),
    tags: {
        Project: "FIFA-2026-Concierge"
    }
});

// Attach policies to Lambda role
const lambdaPolicy = new aws.iam.RolePolicyAttachment("fifa-lambda-policy", {
    role: lambdaRole.name,
    policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
});

const dynamoPolicy = new aws.iam.RolePolicy("fifa-lambda-dynamodb-policy", {
    role: lambdaRole.id,
    policy: pulumi.all([conversationTable.arn, userProfileTable.arn, matchDataTable.arn])
        .apply(([convArn, profileArn, matchArn]) => JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Effect: "Allow",
                Action: [
                    "dynamodb:PutItem",
                    "dynamodb:GetItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem"
                ],
                Resource: [convArn, profileArn, matchArn]
            }]
        }))
});

const bedrockPolicy = new aws.iam.RolePolicy("fifa-lambda-bedrock-policy", {
    role: lambdaRole.id,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            Resource: "*"
        }]
    })
});

// Lambda Function for Chat Handler
const chatLambda = new aws.lambda.Function("fifa-chat-handler", {
    runtime: aws.lambda.Runtime.NodeJS18dX,
    handler: "index.handler",
    role: lambdaRole.arn,
    code: new pulumi.asset.AssetArchive({
        "index.js": new pulumi.asset.StringAsset(`
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const bedrock = new BedrockRuntimeClient({ region: "us-east-1" });
const dynamodb = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { message, conversationHistory, userId } = body;

        const systemPrompt = \`You are an AI concierge for FIFA World Cup 2026 in Los Angeles. 
You help international visitors with:
- Match schedules and venue information
- Transportation and navigation
- Restaurant and hotel recommendations
- Real-time translations
- Local attractions and fan zones
- Booking assistance

Current context:
- Event: FIFA World Cup 2026
- Location: Los Angeles, California
- Current date: \${new Date().toISOString()}

Be helpful, friendly, and proactive. Provide specific, actionable advice.\`;

        const response = await bedrock.send(new InvokeModelCommand({
            modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1024,
                system: systemPrompt,
                messages: [
                    ...conversationHistory.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        }));

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const assistantMessage = responseBody.content[0].text;

        await dynamodb.send(new PutItemCommand({
            TableName: process.env.CONVERSATION_TABLE,
            Item: {
                userId: { S: userId || "anonymous" },
                timestamp: { N: Date.now().toString() },
                message: { S: message },
                response: { S: assistantMessage }
            }
        }));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                response: assistantMessage,
                timestamp: new Date().toISOString()
            })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: "Internal server error" })
        };
    }
};
        `)
    }),
    environment: {
        variables: {
            CONVERSATION_TABLE: conversationTable.name,
            BEDROCK_MODEL: "anthropic.claude-3-5-sonnet-20241022-v2:0"
        }
    },
    timeout: 30,
    memorySize: 512,
    tags: {
        Project: "FIFA-2026-Concierge"
    }
});

// Lambda Function for Data Aggregator
const dataAggregatorLambda = new aws.lambda.Function("fifa-data-aggregator", {
    runtime: aws.lambda.Runtime.NodeJS18dX,
    handler: "index.handler",
    role: lambdaRole.arn,
    code: new pulumi.asset.AssetArchive({
        "index.js": new pulumi.asset.StringAsset(`
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const eventBridge = new EventBridgeClient({ region: "us-east-1" });
const dynamodb = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async () => {
    try {
        // Mock match data
        const matches = [
            {
                id: "match-1",
                homeTeam: "USA",
                awayTeam: "Mexico",
                venue: "SoFi Stadium",
                dateTime: "2026-06-15T19:00:00Z",
                status: "scheduled"
            },
            {
                id: "match-2",
                homeTeam: "Brazil",
                awayTeam: "Argentina",
                venue: "Rose Bowl",
                dateTime: "2026-06-18T16:00:00Z",
                status: "scheduled"
            }
        ];

        // Store in DynamoDB
        for (const match of matches) {
            await dynamodb.send(new PutItemCommand({
                TableName: process.env.MATCH_DATA_TABLE,
                Item: {
                    matchId: { S: match.id },
                    dateTime: { S: match.dateTime },
                    homeTeam: { S: match.homeTeam },
                    awayTeam: { S: match.awayTeam },
                    venue: { S: match.venue },
                    status: { S: match.status }
                }
            }));
        }

        // Send event to EventBridge
        await eventBridge.send(new PutEventsCommand({
            Entries: [{
                Source: "fifa.concierge",
                DetailType: "dataUpdate",
                Detail: JSON.stringify({ matches, timestamp: new Date().toISOString() })
            }]
        }));

        return { statusCode: 200, body: "Data updated successfully" };
    } catch (error) {
        console.error("Error:", error);
        return { statusCode: 500, body: "Error updating data" };
    }
};
        `)
    }),
    environment: {
        variables: {
            MATCH_DATA_TABLE: matchDataTable.name
        }
    },
    timeout: 60,
    memorySize: 256,
    tags: {
        Project: "FIFA-2026-Concierge"
    }
});

// EventBridge Rule for scheduled data updates
const dataUpdateRule = new aws.cloudwatch.EventRule("fifa-data-update-rule", {
    description: "Trigger data aggregation every 15 minutes",
    scheduleExpression: "rate(15 minutes)",
    tags: {
        Project: "FIFA-2026-Concierge"
    }
});

const dataUpdateTarget = new aws.cloudwatch.EventTarget("fifa-data-update-target", {
    rule: dataUpdateRule.name,
    arn: dataAggregatorLambda.arn
});

const dataUpdatePermission = new aws.lambda.Permission("fifa-data-update-permission", {
    action: "lambda:InvokeFunction",
    function: dataAggregatorLambda.name,
    principal: "events.amazonaws.com",
    sourceArn: dataUpdateRule.arn
});

// API Gateway
const api = new aws.apigatewayv2.Api("fifa-api", {
    protocolType: "HTTP",
    corsConfiguration: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"]
    },
    tags: {
        Project: "FIFA-2026-Concierge"
    }
});

const chatIntegration = new aws.apigatewayv2.Integration("fifa-chat-integration", {
    apiId: api.id,
    integrationType: "AWS_PROXY",
    integrationUri: chatLambda.arn,
    payloadFormatVersion: "2.0"
});

const chatRoute = new aws.apigatewayv2.Route("fifa-chat-route", {
    apiId: api.id,
    routeKey: "POST /chat",
    target: pulumi.interpolate`integrations/${chatIntegration.id}`
});

const apiStage = new aws.apigatewayv2.Stage("fifa-api-stage", {
    apiId: api.id,
    name: "$default",
    autoDeploy: true
});

const chatPermission = new aws.lambda.Permission("fifa-chat-permission", {
    action: "lambda:InvokeFunction",
    function: chatLambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`
});

// SNS Topic for Notifications
const notificationTopic = new aws.sns.Topic("fifa-notifications", {
    displayName: "FIFA 2026 Concierge Notifications",
    tags: {
        Project: "FIFA-2026-Concierge"
    }
});

// Export important values
export const apiEndpoint = api.apiEndpoint;
export const conversationTableName = conversationTable.name;
export const userProfileTableName = userProfileTable.name;
export const matchDataTableName = matchDataTable.name;
export const notificationTopicArn = notificationTopic.arn;
export const chatLambdaArn = chatLambda.arn;
