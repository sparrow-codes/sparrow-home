set -euo pipefail

[[ "${EUID:-$(id -u)}" -eq 0 ]] || { echo "ERROR: Run as root (sudo)."; exit 1; }

echo "Sparrow Home - Server Preparation Script"
echo "--------------------------------------"

echo "This script will install:"
echo "- Node.js"
echo "- PM2"
echo "- nginx"
echo "- Mosquitto"
echo "- Docker"
echo "- and setup system firewall rules"

read -p "Continue? [y/N]: " answer

if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
  echo "Starting installation..."
else
  echo "Canceled."
  exit 0
fi

bash ./system/node.sh --node-major 22
echo "--------------------------------------"
echo "Node.js installation completed."

bash ./system/nginx.sh
echo "--------------------------------------"
echo "nginx installation completed."

bash ./system/docker.sh
echo "--------------------------------------"
echo "Server preparation completed successfully!"
