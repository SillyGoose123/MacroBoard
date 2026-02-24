import type {Config} from "@/../bindings/Config";
import {type Action, Action as ActionEnum} from "@/../bindings/Action";
import type {SlimKeyReport} from "@/../bindings/SlimKeyReport";
import type {MouseReport} from "@/../bindings/MouseReport";
import {Tone} from "@/../bindings/Tone.ts";
import type {RotaryAction} from "@/../bindings/RotaryAction";
import type {KnobAction} from "@/../bindings/KnobAction";
import type {Effect} from "@/../bindings/Effect";
import type {RGB8} from "@/../bindings/RGB8";

type UsbData = DataView<ArrayBufferLike>;

export function parseConfig(raw: UsbData): Config {
  let actions = [];
  let pointer = 0;

  for (let i = 0; i < 6; i++) {
    actions.push(parseArray(raw, pointer, parseAction));
  }

  return {
    switchAction: actions as [Action[], Action[], Action[], Action[], Action[], Action[]],
    knobAction: parseKnobAction(raw, pointer),
    effect: parseEffect(raw, pointer)
  };
}


function parseAction(raw: UsbData, pointer: number): Action {
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

function parseKeyAction(raw: UsbData, pointer: number): SlimKeyReport {
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

function parseMouseReport(raw: UsbData, pointer: number): MouseReport {
  return {
    buttons: getByte(raw, pointer),
    x: getI8(raw, pointer),
    y: getI8(raw, pointer),
    wheel: getI8(raw, pointer),
    pan: getI8(raw, pointer)
  }
}

function parseTone(raw: UsbData, pointer: number): Tone {
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

function parseKnobAction(raw: UsbData, pointer: number): KnobAction {
  return {
    rotaryAction: parseRotaryAction(raw, pointer),
    switch: parseArray(raw, pointer, parseAction)
  };
}

function parseRotaryAction(raw: UsbData, pointer: number) : RotaryAction {
  return {
    plus: parseArray(raw, pointer, parseAction),
    minus: parseArray(raw, pointer, parseAction)
  }
}

function parseEffect(raw: UsbData, pointer: number): Effect {
  let colors = parseArray(raw, pointer, parseRGB8);
  pointer += 4;
  return {
    colors,
    timeDiff: raw.getUint32(pointer - 4, true)
  }
}

function parseRGB8(raw: UsbData, pointer: number): RGB8 {
  return {
    r: getByte(raw, pointer),
    g: getByte(raw, pointer),
    b: getByte(raw, pointer)
  }
}


/* UTILS */
function getByte(raw: UsbData, pointer: number): number {
  pointer += 1;
  return raw.getUint8(pointer - 1);
}

function getI8(raw: UsbData, pointer: number) : number {
  pointer += 1;
  return raw.getInt8(pointer - 1);
}

function parseArray<T>(raw: UsbData, pointer: number, parsingFn: (raw: UsbData, pointer: number) => T) : Array<T> {
  let length = getByte(raw, pointer);
  let result: Array<T> = [];

  for (let i = 0; i < length; i++) {
    result.push(parsingFn(raw, pointer));
  }

  return result;
}