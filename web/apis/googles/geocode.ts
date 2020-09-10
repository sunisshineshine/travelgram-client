import { GOOGLE_API_KEY } from "../../../config.json";
import { RequestOptions, get } from "https";

const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

type GeocodeStatusCodes = "OK" | string;

interface GeocodeResponse {
  status: GeocodeStatusCodes;
  error_message?: string;
  results: GeocodeResult[];
}

interface GeocodeResult {
  types: string[];
  formatted_address: string;
  address_components: AddressComponent[];
  postcode_localities: any[];
  geometry: Geometry[];
  partial_match: string;
}

interface AddressComponent {
  types: string[];
  long_name: string;
  short_name: string;
}

interface Geometry {
  location: .maps.LatLng;
}

export const doGeocode = (query: string[]): Promise<GeocodeResponse> => {
  let addressUrl = "";
  query.map((value, i) => {
    if (i == 0) {
      addressUrl += value;
    } else {
      addressUrl += `+${value}`;
    }
  });
  const url = `${baseUrl}?address=${addressUrl}&key=${GOOGLE_API_KEY}`;

  return new Promise((resolve) => {
    get(url, (res) => {
      return res.on("data", (chunk) => {
        const data = (JSON.parse(chunk) as unknown) as GeocodeResponse;
        console.log("geocode log");
        console.log(data);
        resolve(data);
      });
    });
  });
};
