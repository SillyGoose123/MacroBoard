import type {Config} from "@/../bindings/Config";
import {type Action, Action as ActionEnum} from "@/../bindings/Action";
import type {SlimKeyReport} from "@/../bindings/SlimKeyReport";
import type {MouseReport} from "@/../bindings/MouseReport";
import {Tone} from "@/../bindings/Tone.ts";
import type {RotaryAction} from "@/../bindings/RotaryAction";
import type {KnobAction} from "@/../bindings/KnobAction";
import type {Effect} from "@/../bindings/Effect";
import type {RGB8} from "@/../bindings/RGB8";

export type UsbData = DataView<ArrayBufferLike>;
export type Pointer = {value: number};

export function parseConfig(raw: UsbData): Config {
  let actions = [];
  let pointer = { value: 0}; //make object so its change is shared

  for (let i = 0; i < 6; i++) {
    actions.push(parseArray(raw, pointer, parseAction));
  }

  return {
    switchAction: actions as [Action[], Action[], Action[], Action[], Action[], Action[]],
    knobAction: parseKnobAction(raw, pointer),
    effect: parseEffect(raw, pointer)
  };
}


export function parseAction(raw: UsbData, pointer: Pointer): Action {
  let byte = getByte(raw, pointer);
  switch (byte) {
    case ActionEnum.keyAction:
      return {type: byte as 1, data: parseKeyAction(raw, pointer)};

    case ActionEnum.mouseAction:
      return {type: byte as 2, data: parseMouseReport(raw, pointer)}

    case ActionEnum.summerAction:
      return {type: byte as 3, data: parseTone(raw, pointer)}

    default:
      throw "Invalid action at offset " + pointer + " found!";
  }
}

export function parseKeyAction(raw: UsbData, pointer: Pointer): SlimKeyReport {
  return {
    modifier: getByte(raw, pointer),
    keycodes: [
      getByte(raw, pointer),
      getByte(raw, pointer),
      getByte(raw, pointer),
      getByte(raw, pointer),
      getByte(raw, pointer),
      getByte(raw, pointer)
    ],
  }
}

export function parseMouseReport(raw: UsbData, pointer: Pointer): MouseReport {
  return {
    buttons: getByte(raw, pointer),
    x: getI8(raw, pointer),
    y: getI8(raw, pointer),
    wheel: getI8(raw, pointer),
    pan: getI8(raw, pointer)
  }
}

export function parseTone(raw: UsbData, pointer: Pointer): Tone {
  switch (getByte(raw, pointer)) {
    case Tone.low:
      return Tone.low;
    case Tone.medium:
      return Tone.medium;
    case Tone.high:
      return Tone.high;
    default:
      return Tone.default;
  }
}

export function parseKnobAction(raw: UsbData, pointer: Pointer): KnobAction {
  return {
    rotaryAction: parseRotaryAction(raw, pointer),
    switch: parseArray(raw, pointer, parseAction)
  };
}

export function parseRotaryAction(raw: UsbData, pointer: Pointer): RotaryAction {
  return {
    plus: parseArray(raw, pointer, parseAction),
    minus: parseArray(raw, pointer, parseAction)
  }
}

export function parseEffect(raw: UsbData, pointer: Pointer): Effect {
  let colors = parseArray(raw, pointer, parseRGB8);
  pointer.value += 4;
  return {
    colors,
    timeDiff: raw.getUint32(pointer.value - 4, true)
  }
}

export function parseRGB8(raw: UsbData, pointer: Pointer): RGB8 {
  return {
    r: getByte(raw, pointer),
    g: getByte(raw, pointer),
    b: getByte(raw, pointer)
  }
}

/* UTILS */
export function getByte(raw: UsbData, pointer: Pointer): number {
  pointer.value += 1;
  return raw.getUint8(pointer.value - 1);
}

export function getI8(raw: UsbData, pointer: Pointer): number {
  pointer.value += 1;
  return raw.getInt8(pointer.value - 1);
}

export function parseArray<T>(raw: UsbData, pointer: Pointer, parsingFn: (raw: UsbData, pointer: Pointer) => T): Array<T> {
  let length = getByte(raw, pointer);
  let result: Array<T> = [];

  for (let i = 0; i < length; i++) {
    result.push(parsingFn(raw, pointer));
  }

  return result;
}