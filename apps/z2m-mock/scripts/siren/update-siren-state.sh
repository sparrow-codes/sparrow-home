# (opcjonalnie) przykładowy bieżący stan urządzenia:
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/garden_siren_ldsenk07' -m '{"ac_status":true,"alarm":false,"battery_low":false,"linkquality":152,"restore_reports":true,"supervision_reports":true,"tamper":true,"test":false}'
