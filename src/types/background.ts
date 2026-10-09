export type BackgroundTheme =
  | 'biosphere'      // Living organic compost soil, mycelium & natural sunlight
  | 'circular-lab'   // Architectural circular recovery facility & vertical green wall
  | 'topographic'    // GIS contour lines & environmental elevation grid
  | 'clean-studio'   // Tactile studio paper & fiber grain with subtle radial daylight
  | 'twilight-slate'; // Nocturnal eco-monitoring slate with bioluminescent organic nodes

export interface BackgroundSettings {
  theme: BackgroundTheme;
  intensity: number;      // 0.10 to 0.70, default 0.32
  blurAmount: number;     // 0 to 12 px, default 2px
  showParticles: boolean; // Gentle environmental floating spores/air motes
  showContours: boolean;  // Vector GIS topography curves
  showSunlight: boolean;  // Ambient natural daylight caustics
  showFiberTexture: boolean; // Tactile recycled fiber/kraft paper micro-grain
}

export const DEFAULT_BACKGROUND_SETTINGS: BackgroundSettings = {
  theme: 'biosphere',
  intensity: 0.32,
  blurAmount: 2,
  showParticles: true,
  showContours: true,
  showSunlight: true,
  showFiberTexture: true,
};
