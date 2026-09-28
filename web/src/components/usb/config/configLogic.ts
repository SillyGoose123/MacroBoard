import type {Config} from "@bindings/Config";
import type {Effect} from "@bindings/Effect";
import type {Action} from "@bindings/Action.ts";
import type {KnobAction} from "@bindings/KnobAction";

export const DEFAULT_CONFIG: Config = {
  switchAction: [
    [],
    [],
    [],
    [],
    [],
    []
  ],
  knobAction: {
    rotaryAction: {
      plus: [],
      minus: []
    },
    switch: []
  },
  effect: {
    colors: [],
    timeDiff: 0
  }
}

export function jsonEqual(json1: object | null, json2: object | null): boolean {
  if(!json1 && !json2) return true;
  if(!json1 || !json2) return false;
  return JSON.stringify(json1) == JSON.stringify(json2);
}

export function isDefaultConfig(config: Config | null): boolean {
  return jsonEqual(config, DEFAULT_CONFIG);
}

export type ConfigOptions = Action[] | KnobAction | Effect;
export type EditComponentProps<T extends ConfigOptions> = {
  part: T;
  change: (part: ConfigOptions) => void;
}

export function changePart(config: Config, part: ConfigOptions, index?: number): Config {
  let newConfig: Config = {...config};

  if ("colors" in part) newConfig.effect = part as Effect;
  if ("knob" in part) newConfig.knobAction = part as KnobAction;
  if(index && Array.isArray(part)) config.switchAction[index] = part as Action[];

  return newConfig;
}