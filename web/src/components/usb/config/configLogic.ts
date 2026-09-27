import type {Config} from "@/../bindings/Config";
import type {Effect} from "@/../bindings/Effect";
import type {Action} from "@/../bindings/Action.ts";
import type {KnobAction} from "@/../bindings/KnobAction";

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


export function changePart(config: Config, part: ConfigOptions, _index?: number): Config {
  let newConfig: Config = {...config};
  console.log(typeof part);
  return newConfig;
}