# eventy (nie-retained):
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_announce","data":{"friendly_name":"pet_feeder_c1","ieee_address":"0x00124b002a575fd4"}}'
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_interview","data":{"friendly_name":"pet_feeder_c1","ieee_address":"0x00124b002a575fd4","status":"started"}}'
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/event' -m '{"type":"device_interview","data":{"friendly_name":"pet_feeder_c1","ieee_address":"0x00124b002a575fd4","status":"successful","supported":true,"definition":{"model":"ZNCWWSQ01LM","vendor":"Aqara","description":"Smart Pet Feeder C1"}}}'

# snapshot bridge/devices (RETained!):
mosquitto_pub -h localhost -p 1883 -t 'zigbee2mqtt/bridge/devices' -r -m '[
  {
    "friendly_name":"pet_feeder_c1",
    "ieee_address":"0x00124b002a575fd4",
    "definition":{
      "model":"ZNCWWSQ01LM",
      "vendor":"Aqara",
      "description":"Smart Pet Feeder C1",
      "exposes":[
        {"type":"enum","property":"feed","access":3,"values":["","START"]},
        {"type":"enum","property":"feeding_source","access":1,"values":["schedule","manual","remote"]},
        {"type":"numeric","property":"feeding_size","access":1,"unit":"portion"},
        {"type":"numeric","property":"portions_per_day","access":1},
        {"type":"numeric","property":"weight_per_day","access":1,"unit":"g"},
        {"type":"binary","property":"error","access":1},
        {"type":"list","property":"schedule","access":3,"item_type":{"type":"composite","features":[
             {"type":"enum","property":"days","values":["everyday","workdays","weekend","mon","tue","wed","thu","fri","sat","sun","mon-wed-fri-sun","tue-thu-sat"]},
             {"type":"numeric","property":"hour"},
             {"type":"numeric","property":"minute"},
             {"type":"numeric","property":"size"}
          ]}},
        {"type":"binary","property":"led_indicator","access":3,"values":["ON","OFF"]},
        {"type":"binary","property":"child_lock","access":3,"values":["LOCK","UNLOCK"]},
        {"type":"enum","property":"mode","access":3,"values":["schedule","manual"]},
        {"type":"numeric","property":"serving_size","access":3,"unit":"portion","value_min":1,"value_max":10},
        {"type":"numeric","property":"portion_weight","access":3,"unit":"g","value_min":1,"value_max":20}
      ]
    }
  }
]'
