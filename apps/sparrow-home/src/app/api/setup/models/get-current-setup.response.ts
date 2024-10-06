export interface GetCurrentSetupResponse {
  currentMode: number;
  dictionaries: {
    modeDictionary: { value: number; label: string }[];
  };
}
