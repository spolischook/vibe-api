#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API base URL
API_URL="http://localhost:3000"
CONTENT_TYPE="application/io.goswagger.examples.todo-list.v1+json"

# Function to print colored text
print_colored() {
  local color=$1
  local text=$2
  echo -e "${color}${text}${NC}"
}

# Function to test an endpoint
test_endpoint() {
  local test_name=$1
  local command=$2
  
  print_colored $BLUE "\n=== Testing: $test_name ==="
  print_colored $YELLOW "Command: $command"
  echo "Response:"
  eval $command
  
  if [ $? -eq 0 ]; then
    print_colored $GREEN "✓ Test passed"
  else
    print_colored $RED "✗ Test failed"
  fi
}

# Check if server is running
server_status=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)
if [ "$server_status" = "000" ]; then
  print_colored $RED "Error: API server is not running at $API_URL"
  print_colored $YELLOW "Please start the server with: npm run dev"
  exit 1
fi

# Create a todo item
print_colored $BLUE "\n=== TESTING CREATE TODO ==="
print_colored $YELLOW "Creating a new todo item..."
CREATE_RESPONSE=$(curl -s -X POST -H "Content-Type: $CONTENT_TYPE" -d '{"description": "Test todo item", "completed": false}' $API_URL)
echo $CREATE_RESPONSE
TODO_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ -z "$TODO_ID" ]; then
  print_colored $RED "Failed to extract todo ID from response. API might not be working correctly."
  exit 1
fi

print_colored $GREEN "Created todo item with ID: $TODO_ID"

# Get all todos
test_endpoint "GET ALL TODOS" "curl -s -X GET -H 'Accept: $CONTENT_TYPE' $API_URL"

# Get todos with pagination
test_endpoint "GET TODOS WITH PAGINATION" "curl -s -X GET -H 'Accept: $CONTENT_TYPE' '$API_URL?since=0&limit=5'"

# Update the created todo
test_endpoint "UPDATE TODO" "curl -s -X PUT -H 'Content-Type: $CONTENT_TYPE' -d '{\"description\": \"Updated todo item\", \"completed\": true}' $API_URL/$TODO_ID"

# Get all todos after update
test_endpoint "GET ALL TODOS AFTER UPDATE" "curl -s -X GET -H 'Accept: $CONTENT_TYPE' $API_URL"

# Delete the created todo
test_endpoint "DELETE TODO" "curl -s -X DELETE -H 'Accept: $CONTENT_TYPE' -w '\nStatus code: %{http_code}' $API_URL/$TODO_ID"

# Get all todos after delete to confirm deletion
test_endpoint "GET ALL TODOS AFTER DELETE" "curl -s -X GET -H 'Accept: $CONTENT_TYPE' $API_URL"

print_colored $GREEN "\nAll tests completed!"
