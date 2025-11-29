echo "Clearing node modules"
rm -r ../node_modules/
sleep 1

echo "Installing application"
npm ci
sleep 1

echo "Stopping current running application"
pm2 stop main
sleep 1

echo "Building artifacts"
npm run build:app
sleep 1

echo "Starting application"
pm2 start main
