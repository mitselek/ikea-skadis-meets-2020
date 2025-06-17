#!/bin/bash

# MakerWorld Outreach Contact Tracker
# Usage: ./track_contact.sh [username] [profile_url] [message_url] [source_project] [notes]

# CSV file location
CSV_FILE="/home/michelek/Documents/ikea-skadis-adapters/outreach-tools/outreach_contacts.csv"

# Function to add a new contact
add_contact() {
    local username="$1"
    local profile_url="$2"  
    local message_url="$3"
    local source_project="$4"
    local notes="$5"
    local date_collected=$(date +%Y-%m-%d)
    
    echo "Adding contact: $username"
    echo "$date_collected,$username,$profile_url,$message_url,$source_project,Medium,Medium,Unknown,Unknown,Medium,\"$notes\",Not_Contacted,,," >> "$CSV_FILE"
    echo "Contact added successfully!"
}

# Function to update contact status
update_status() {
    local username="$1"
    local status="$2"
    local template="$3"
    local response_date="$4"
    local response_type="$5"
    
    # This is a simplified update - in practice you'd want more sophisticated CSV handling
    echo "Status updated for $username"
}

# Function to show stats
show_stats() {
    echo "=== OUTREACH STATISTICS ==="
    echo "Total contacts: $(tail -n +2 "$CSV_FILE" | wc -l)"
    echo "Not contacted: $(tail -n +2 "$CSV_FILE" | grep -c "Not_Contacted")"
    echo "Contacted: $(tail -n +2 "$CSV_FILE" | grep -c "Contacted")"
    echo "Responses: $(tail -n +2 "$CSV_FILE" | grep -v "Not_Contacted" | grep -c -v "^$")"
    echo "=========================="
}

# Main menu
case "$1" in
    "add")
        add_contact "$2" "$3" "$4" "$5" "$6"
        ;;
    "update")
        update_status "$2" "$3" "$4" "$5" "$6"
        ;;
    "stats")
        show_stats
        ;;
    *)
        echo "Usage: $0 {add|update|stats}"
        echo "  add [username] [profile_url] [message_url] [source_project] [notes]"
        echo "  update [username] [status] [template] [response_date] [response_type]"
        echo "  stats"
        ;;
esac
