export interface saveStep1Info {
    selectedModel: ModelInformation,
    currentModel: string,
    selectedColor?: Color,
    currentColor?: string
  }
  export interface ModelInformation {
    code: ModelCodeAvailable;
    description: ModelDescriptionAvailable;
    colors: Color[];
  }

  export interface Color {
    code: ColorAvailable;
    description: string;
    price: number;
  }

  export interface saveStep2Info {
    currentConfig: string;
    configs: Config;
    towHitch: boolean;
    yoke: boolean;
  }

  export interface ConfigInformation {
    configs: Config[];
    towHitch: boolean;
    yoke: boolean;
  }

  export interface Config {
    id: number;
    description: string;
    range: number;
    speed: number;
    price: number;
  }

export type ModelCodeAvailable = 'S' | 'X' | 'C' | '3' | 'Y';
export type ModelDescriptionAvailable = 'Model S' | 'Model X' | 'Cybertruck' | 'Model 3' | 'Model Y';
export type ColorAvailable = 'white' | 'black'| 'blue' | 'grey'| 'red';
