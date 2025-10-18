"""
FIFA World Cup 2026 AI Concierge - Lambda Handler
Deploy this function manually via AWS Lambda Console
"""

import json
import os
import boto3
from datetime import datetime

# Initialize AWS clients
bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
dynamodb = boto3.client('dynamodb', region_name='us-east-1')

def lambda_handler(event, context):
    """
    Main Lambda handler for chat requests
    """
    try:
        # Parse the request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        message = body.get('message', '')
        conversation_history = body.get('conversationHistory', [])
        user_id = body.get('userId', 'anonymous')
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
                'body': json.dumps({'error': 'Message is required'})
            }
        
        # System prompt for FIFA World Cup context
        system_prompt = """You are an AI concierge for FIFA World Cup 2026 in Los Angeles, California.

Your role is to assist international visitors with:
- Match schedules and venue information
- Transportation options (metro, rideshare, parking)
- Restaurant and dining recommendations near stadiums
- Hotel and accommodation suggestions
- Real-time language translation
- Local attractions and fan zones
- Weather updates and forecasts
- Booking assistance

Current context:
- Event: FIFA World Cup 2026
- Primary Location: Los Angeles area (SoFi Stadium, Rose Bowl, LA Memorial Coliseum)
- Current date: """ + datetime.now().isoformat() + """

Be helpful, friendly, and provide specific actionable advice.
Use emojis to make responses engaging and easy to read.
Provide real venue names, transportation options, and local recommendations.
"""

        # Build the messages array for Claude
        messages = []
        for msg in conversation_history:
            messages.append({
                'role': msg.get('role'),
                'content': msg.get('content')
            })
        
        messages.append({
            'role': 'user',
            'content': message
        })
        
        # Call AWS Bedrock with Claude 3.5 Sonnet
        bedrock_request = {
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': 2048,
            'system': system_prompt,
            'messages': messages,
            'temperature': 0.7,
            'top_p': 0.9
        }
        
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-5-sonnet-20241022-v2:0',
            contentType='application/json',
            accept='application/json',
            body=json.dumps(bedrock_request)
        )
        
        # Parse Bedrock response
        response_body = json.loads(response['body'].read())
        assistant_message = response_body['content'][0]['text']
        
        # Store conversation in DynamoDB (optional - create table first)
        try:
            conversation_table = os.environ.get('CONVERSATION_TABLE', 'fifa-conversations')
            dynamodb.put_item(
                TableName=conversation_table,
                Item={
                    'userId': {'S': user_id},
                    'timestamp': {'N': str(int(datetime.now().timestamp() * 1000))},
                    'message': {'S': message},
                    'response': {'S': assistant_message},
                    'date': {'S': datetime.now().isoformat()}
                }
            )
        except Exception as db_error:
            print(f"DynamoDB error (non-critical): {db_error}")
            # Continue even if DynamoDB fails
        
        # Return successful response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps({
                'response': assistant_message,
                'timestamp': datetime.now().isoformat()
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }
