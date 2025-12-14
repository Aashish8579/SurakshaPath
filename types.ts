export type TransportMode = 'walking' | 'bike' | 'car';
export type MapView = 'safety' | 'roadCondition';

export interface Point {
  lat: number;
  lng: number;
}

export interface RouteStep {
  instruction: string;
  distance: string;
}

export interface SafetyPoint {
  location: Point;
  type: 'police_presence' | 'well_lit' | 'low_crime_zone';
  description: string;
  historicalTrend?: 'Improving' | 'Stable' | 'Declining';
  userReports?: number;
}

export interface RoadIssue {
  location: Point;
  type: 'pothole' | 'damaged_road';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RouteData {
  overview: string;
  path: Point[];
  steps: RouteStep[];
  safetyPoints: SafetyPoint[];
  roadIssues: RoadIssue[];
  bounds: {
    southWest: Point;
    northEast: Point;
  };
}

export interface UserReport {
    step: number;
    instruction: string;
    type: 'safety' | 'road';
    description: string;
    timestamp: string;
}

export type FakeCallVoice = 'male' | 'female';
export type FakeCallTone = 'calm' | 'urgent';

export interface FakeCallOptions {
  voice: FakeCallVoice;
  tone: FakeCallTone;
  message: string;
}
