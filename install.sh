echo "Installing application"
npm install
sleep 1

echo "Stopping current running application"
pm2 stop all
sleep 1

echo "Building artifacts"
npm run build:app
sleep 1

echo "Starting application"
pm2 start all
