# eventy (nie-retained):
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_announce","data":{"friendly_name":"garden_siren_ldsenk07","ieee_address":"0x04cd15fffe6390ed"}}'
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_interview","data":{"friendly_name":"garden_siren_ldsenk07","ieee_address":"0x04cd15fffe6390ed","status":"started"}}'
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_interview","data":{"friendly_name":"garden_siren_ldsenk07","ieee_address":"0x04cd15fffe6390ed","status":"successful","supported":true,"definition":{"model":"LDSENK07","vendor":"ADEO","description":"ENKI LEXMAN wireless smart outdoor siren"}}}'

# snapshot bridge/devices (RETained!):
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/devices' -r -m '[
  {
    "friendly_name":"garden_siren_ldsenk07",
    "ieee_address":"0x04cd15fffe6390ed",
    "definition":{
      "model":"LDSENK07",
      "vendor":"ADEO",
      "description":"ENKI LEXMAN wireless smart outdoor siren",
      "exposes":[
        {
          "type":"composite",
          "name":"warning",
          "property":"warning",
          "access":7,
          "features":[
            {"type":"enum","name":"mode","property":"mode","access":7,"values":["stop","burglar","fire","emergency","police_panic","fire_panic","emergency_panic"]},
            {"type":"enum","name":"level","property":"level","access":7,"values":["low","medium","high","very_high"]},
            {"type":"enum","name":"strobe_level","property":"strobe_level","access":7,"values":["low","medium","high","very_high"]},
            {"type":"binary","name":"strobe","property":"strobe","access":7},
            {"type":"numeric","name":"strobe_duty_cycle","property":"strobe_duty_cycle","access":7,"value_max":10},
            {"type":"numeric","name":"duration","property":"duration","access":7,"unit":"s"}
          ]
        },
        {"type":"numeric","name":"battery","property":"battery","access":1,"unit":"%","value_min":0,"value_max":100},
        {"type":"binary","name":"battery_low","property":"battery_low","access":1},
        {"type":"binary","name":"tamper","property":"tamper","access":1}
      ]
    }
  }
]'
