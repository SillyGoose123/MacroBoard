import type {Config} from "@/../bindings/Config";
import {Action as ActionEnum, type Action} from "@/../bindings/Action";
import type {KnobAction} from "@/../bindings/KnobAction";
import type {Effect} from "@/../bindings/Effect";
import type {SlimKeyReport} from "@/../bindings/SlimKeyReport";
import type {MouseReport} from "@/../bindings/MouseReport";
import type {Tone} from "@/../bindings/Tone.ts";
import type {RotaryAction} from "@/../bindings/RotaryAction";

type Bytes = number[];

export function configToBytes(config: Config): Uint8Array<ArrayBufferLike> {
  return Uint8Array.from([
    ...switchAction(config.switchAction),
    ...knobAction(config.knobAction),
    ...effect(config.effect)
  ]);
}

function switchAction(switchAction: [Action[], Action[], Action[], Action[], Action[], Action[]]): Bytes {
  let bytes: Bytes = [];

  for (const actionArr of switchAction) {
    bytes.push(...array(actionArr, action))
  }

  return bytes;
}

function action(action: Action): Bytes {function actionData(): Bytes {
    switch (action.type) {
      case ActionEnum.keyAction:
        return keyAction(action.data as SlimKeyReport);
      case ActionEnum.mouseAction:
        return mouseAction(action.data as MouseReport);
      case ActionEnum.summerAction:
        return summerAction(action.data as Tone);
      default:
        return [];
    }
  }

  return [
    action.type,
    ...actionData()
  ];
}

function keyAction(keyAction: SlimKeyReport): Bytes {
  return [
    keyAction.modifier,
    ...keyAction.keycodes
  ];
}

function mouseAction(mouseAction: MouseReport): Bytes {
  return Object.values(mouseAction);
}

function summerAction(summerAction: Tone): Bytes {
  return [summerAction];
}

function knobAction(knobAction: KnobAction) {
  return [
      ...rotaryAction(knobAction.rotaryAction),
      ...array(knobAction.switch, action)
  ];
}

function rotaryAction(rotaryAction: RotaryAction) {
  return [
      ...array(rotaryAction.plus, action),
      ...array(rotaryAction.minus, action)
  ];
}


function effect(effect: Effect) {
  return [
      ...effect.colors,
      u32(effect.timeDiff)
  ];
}

/* UTILS */
function u32(u32: number): Bytes {
  // Little-endian (least significant byte first)
  return [
    u32 & 0xFF,
    (u32 >> 8) & 0xFF,
    (u32 >> 16) & 0xFF,
    (u32 >> 24) & 0xFF
  ];
}

function array<T>(array: Array<T>, toBytesFn: (value: T) => Bytes): Bytes {
  let bytes: Bytes = [];

  for (const element of array) {
    bytes.push(...toBytesFn(element));
  }

  if (bytes.length > 255) throw "Max array length is 255!";
  return [
    bytes.length,
    ...bytes
  ];
}
