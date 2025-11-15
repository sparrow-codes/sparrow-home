# eventy (nie-retained):
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_announce","data":{"friendly_name":"hall_door_d0007","ieee_address":"0x54ef441000abcd12"}}'
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_interview","data":{"friendly_name":"hall_door_d0007","ieee_address":"0x54ef441000abcd12","status":"started"}}'
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_interview","data":{"friendly_name":"hall_door_d0007","ieee_address":"0x54ef441000abcd12","status":"successful","supported":true,"definition":{"model":"ZB-DoorSensor-D0007","vendor":"ADEO","description":"ENKI LEXMAN wireless smart door window sensor"}}}'

# snapshot bridge/devices (RETained!):
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/devices' -r -m '[
  {
    "friendly_name":"hall_door_d0007",
    "ieee_address":"0x54ef441000abcd12",
    "definition":{
      "model":"ZB-DoorSensor-D0007",
      "vendor":"ADEO",
      "description":"ENKI LEXMAN wireless smart door window sensor",
      "exposes":[
        { "type":"numeric","name":"battery","property":"battery","access":5,"unit":"%","value_min":0,"value_max":100 },
        { "type":"binary","name":"contact","property":"contact","access":1 },
        { "type":"binary","name":"tamper","property":"tamper","access":1 },
        { "type":"binary","name":"battery_low","property":"battery_low","access":1 }
      ]
    }
  }
]'
