#!/bin/bash

# Setup global variables
echo "What node type do you want? Enter '0' for compute_haswell."

read NODE_TYPE

if [ "$NODE_TYPE" -eq 0 ]
then
  NODE_TYPE=compute_haswell
fi

echo "What do you want to call your lease? Enter '0' for $USER-$(date +%b%d)."
read LEASE_NAME

if [ "$LEASE_NAME" -eq 0 ]
then
  LEASE_NAME="$USER-$(date +%b%d)"
fi

KEYPAIR_NAME="$USER-$(hostname)"
SERVER_NAME="$LEASE_NAME"


# Test that you can authenticate
if [[ "${OS_PROJECT_NAME:+x}" != "x" ]]; then
  echo "No project could automatically be detected."
  exit
fi
openstack token issue >/dev/null && echo "Successfully authenticated to project $OS_PROJECT_NAME"


# Create a reservation
echo "How many instances do you want?"
read num

PUBLIC_NETWORK_ID=$(openstack network show public -f value -c id)

blazar lease-create \
  --physical-reservation min="$num",max="$num",resource_properties="[\"=\", \"\$node_type\", \"$NODE_TYPE\"]" \
  --reservation "resource_type=virtual:floatingip,network_id=$PUBLIC_NETWORK_ID,amount=1" \
  --start-date "$(date +'%Y-%m-%d %H:%M')" \
  --end-date "$(date +'%Y-%m-%d %H:%M' -d'+1 day')" \
  "$LEASE_NAME"


# Create SSH keypair
openstack keypair create --public-key ~/.ssh/id_rsa.pub "$KEYPAIR_NAME"


#Launch Instance
SERVER_NAME="$LEASE_NAME"

openstack server create --key-name "$KEYPAIR_NAME" \
  $(lease_server_create_default_args "$LEASE_NAME") \
  $SERVER_NAME


# Assign a public IP address
FLOATING_IP=$(lease_list_floating_ips "$LEASE_NAME" | head -n1)

openstack server add floating ip "$SERVER_NAME" "$FLOATING_IP" \
  && echo "Attached floating ip $FLOATING_IP!"


# Install everything 
echo "Github Username:"
read user

echo "Github Password:"
read pass

# ssh -L 8080:localhost:8080 cc@"$FLOATING_IP" echo 'User $(whoami) connected on $(hostname)!' << EOF
ssh cc@"$FLOATING_IP" << EOF
  sudo yum install git
  git clone https://$user:$pass@github.com/dbalouek/ChoreoMicroservices.git
  cd ChoreoMicroservices/ 
  git checkout express
  chmod +x install.sh
  ./install.sh
EOF


# Clean up
# blazar lease-delete "$LEASE_NAME"