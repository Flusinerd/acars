export interface LocalLogging {
  type: string;
  flightNumber: string;
  startDate: Date;
  origin: string;
  destination: string;
  positions: Position[];
}

interface Position {
  lat: number;
  long: number;
  altitude: number;
}

/** File
 * type
 * flightNo
 * startDate
 * origin
 * destination
 * status changes
 */