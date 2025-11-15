# (opcjonalnie) przykładowy stan urządzenia (na głównym topiku):
# Uwaga: w tym modelu "contact": false oznacza OTWARTE, true = zamknięte.
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/hall_door_d0007' -m '{"battery":100,"contact":false,"linkquality":144,"update":{"installed_version":16777241,"latest_version":16777241,"state":"idle"}}'
