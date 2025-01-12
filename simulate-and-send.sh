#!/bin/bash

SERVER_URL="http://192.168.1.9:5001/api/logs"
LOG_FILE="/var/log/auth.log"

echo "Simulating attacks and sending logs..."

# Simulate failed SSH login
echo "Simulating failed SSH login..."
ssh invalid_user@localhost &>/dev/null

# Simulate privilege escalation
echo "Simulating privilege escalation..."
sudo -k -n ls &>/dev/null

# Extract logs
echo "Extracting recent log entries..."
LOG_LINES=$(sudo tail -n 5 $LOG_FILE)

# Process logs and send to server
while read -r line; do
    if [[ $line == *"Failed password"* ]]; then
        echo "Sending Failed Login Attempt: $line"
        curl -X POST $SERVER_URL -H "Content-Type: application/json" -d '{
            "eventType": "Failed Login Attempt",
            "severity": "High",
            "details": "'"${line}"'",
            "timestamp": "'"$(date --iso-8601=seconds)"'"
        }'
    elif [[ $line == *"sudo"* ]]; then
        echo "Sending Privilege Escalation Attempt: $line"
        curl -X POST $SERVER_URL -H "Content-Type: application/json" -d '{
            "eventType": "Privilege Escalation Attempt",
            "severity": "Critical",
            "details": "'"${line}"'",
            "timestamp": "'"$(date --iso-8601=seconds)"'"
        }'
    fi
done <<< "$LOG_LINES"

echo "Logs sent to $SERVER_URL."
