export enum ConfigKey {
  MODE = 'mode',

  INCLUDE_HEAT_PUMP_MODULE = 'includeHeatPumpModule',
  PANASONIC_CLOUD_LOGIN = 'panasonicCloudLogin',
  PANASONIC_CLOUD_PASSWORD = 'panasonicCloudPassword',
  PANASONIC_DEVICE_ID = 'panasonicDeviceId',

  WEATHER_API_URL = 'weatherApiUrl',
  LAT = 'lat',
  LNG = 'lng',

  DB_HOST = 'dbHost',
  DB_PORT = 'dbPort',
  DB_NAME = 'dbName',
  DB_USER_NAME = 'dbUserName',
  DB_PASSWORD = 'dbPassword',
  DB_SCHEMA = 'dbSchema',

  JWT_SECRET = 'jwtSecret',
  JWT_EXPIRATION = 'jwtExpiry',

  MQTT_URL = 'mqttUrl',

  PUSH_PUBLIC_KEY = 'pushPublicKey',
  PUSH_PRIVATE_KEY = 'pushPrivateKey',
  PUSH_ADMIN_EMAIL = 'pushAdminEmail',
}
