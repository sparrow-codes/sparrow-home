export interface GetCurrentSetupResponse {
  currentMode: number;
  lat: number;
  lng: number;
  dictionaries: {
    modeDictionary: { value: number; label: string }[];
  };
}
