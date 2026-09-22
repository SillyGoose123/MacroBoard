import type {Config} from "@/../bindings/Config";
import {Action as ActionEnum, type Action} from "@/../bindings/Action";
import type {KnobAction} from "@/../bindings/KnobAction";
import type {Effect} from "@/../bindings/Effect";
import type {SlimKeyReport} from "@/../bindings/SlimKeyReport";
import type {MouseReport} from "@/../bindings/MouseReport";
import type {Tone} from "@/../bindings/Tone.ts";
import type {RotaryAction} from "@/../bindings/RotaryAction";
import type {RGB8} from "../../../../bindings/RGB8";

export type U8Numbers = number[];

export function configToBytes(config: Config): Uint8Array<ArrayBufferLike> {
  return Uint8Array.from([
    ...switchAction(config.switchAction),
    ...knobAction(config.knobAction),
    ...effect(config.effect)
  ]);
}

export function switchAction(switchAction: [Action[], Action[], Action[], Action[], Action[], Action[]]): U8Numbers {
  let bytes: U8Numbers = [];

  for (const actionArr of switchAction) {
    bytes.push(...array(actionArr, action))
  }

  return bytes;
}

export function action({type, data}: Action): U8Numbers {function actionData(): U8Numbers {
    switch (type) {
      case ActionEnum.keyAction:
        return keyAction(data as SlimKeyReport);
      case ActionEnum.mouseAction:
        return mouseAction(data as MouseReport);
      case ActionEnum.summerAction:
        return summerAction(data as Tone);
      default:
        return [];
    }
  }

  return [
    type,
    ...actionData()
  ];
}

export function keyAction({modifier, keycodes}: SlimKeyReport): U8Numbers {
  return [
    modifier,
    ...keycodes
  ];
}

export function mouseAction({buttons, x, y, wheel, pan}: MouseReport): U8Numbers {
  return [
    buttons,
    ...i8(x),
    ...i8(y),
    ...i8(wheel),
    ...i8(pan),
  ];
}

export function summerAction(summerAction: Tone): U8Numbers {
  return [summerAction];
}

export function knobAction(knobAction: KnobAction) {
  return [
      ...rotaryAction(knobAction.rotaryAction),
      ...array(knobAction.switch, action)
  ];
}

export function rotaryAction({plus, minus}: RotaryAction) {
  return [
      ...array(plus, action),
      ...array(minus, action)
  ];
}

export function rgb8(val: RGB8) {
  return Object.values(val);
}

export function effect({colors, timeDiff}: Effect) {
  return [
    ...array(colors, (val) => rgb8(val)),
    ...u32(timeDiff)
  ];
}

/* UTILS */
export function u32(u32: number): U8Numbers {
  // Little-endian (least significant byte first)
  return [
    u32 & 0xFF,
    (u32 >> 8) & 0xFF,
    (u32 >> 16) & 0xFF,
    (u32 >> 24) & 0xFF,
  ];
}

export function i8(i8: number): U8Numbers {
  return [(i8 + 256) % 256];
}


export function array<T>(array: Array<T>, toBytesFn: (value: T) => U8Numbers): U8Numbers {
  let bytes: U8Numbers = [];

  for (const element of array) {
    bytes.push(...toBytesFn(element));
  }

  if (array.length > 255) throw "Max array length is 255!";
  return [
    array.length,
    ...bytes
  ];
}
