declare global {
  interface Window {
    google: typeof google;
  }
}

export interface GoogleMaps {
  maps: {
    Map: new (element: HTMLElement, options?: any) => any;
    Marker: new (options?: any) => any;
    places: {
      AutocompleteService: new () => {
        getPlacePredictions: (
          request: { input: string; types?: string[] },
          callback: (predictions: any[] | null, status: any) => void
        ) => void;
      };
      PlacesService: new (map: any) => {
        getDetails: (
          request: { placeId: string; fields?: string[] },
          callback: (place: any | null, status: any) => void
        ) => void;
      };
      PlacesServiceStatus: {
        OK: string;
      };
    };
    event: {
      addListener: (instance: any, eventName: string, handler: Function) => void;
    };
    LatLng: new (lat: number, lng: number) => any;
  };
}

declare const google: GoogleMaps;

export {};
