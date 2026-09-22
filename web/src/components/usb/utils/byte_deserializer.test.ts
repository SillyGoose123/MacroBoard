import {expect, test} from 'vitest'
import {
  getByte,
  getI8,
  parseArray,
  parseEffect, parseKeyAction, parseKnobAction, parseMouseReport,
  parseRGB8, parseRotaryAction, parseTone,
  type UsbData
} from "@/components/Usb/utils/byte_deserializer.ts";
import type {U8Numbers} from "@/components/Usb/utils/byte_serializer.ts";
import {config} from "@/components/Usb/utils/byte_serializer.test.ts";
import {Tone} from "../../../../bindings/Tone.ts";


test("parseConfig", () => {
  let pointer = {value: 0};
  let raw = toUsbData(configBytes);
  expect(parseKeyAction(raw, pointer)).toStrictEqual(config);
});


test("parseAction", () => {
  let pointer = {value: 0};
  let raw = toUsbData(actionBytes);
  expect(parseKeyAction(raw, pointer)).toStrictEqual(config.switchAction[0][0]);
});


test("parseKeyAction", () => {
  let pointer = {value: 0};
  let raw = toUsbData(keyActionBytes);
  expect(parseKeyAction(raw, pointer)).toStrictEqual(config.knobAction.switch[0].data);
});

test("parseMouseReport", () => {
  let pointer = {value: 0};
  let raw = toUsbData(mouseActionBytes);
  expect(parseMouseReport(raw, pointer)).toStrictEqual(config.switchAction[0][0].data);
});

test("parseTone", () => {
  let pointer = {value: 0};
  let raw = toUsbData([Tone.default]);
  expect(parseTone(raw, pointer)).toStrictEqual(config.knobAction.rotaryAction.plus[0].data);
});

test("parseKnobAction", () => {
  let pointer = {value: 0};
  let raw = toUsbData(knobActionBytes);
  expect(parseKnobAction(raw, pointer)).toStrictEqual(config.knobAction);
});

test("parseRotaryAction", () => {
  let pointer = {value: 0};
  let raw = toUsbData(rotaryActionBytes);
  expect(parseRotaryAction(raw, pointer)).toStrictEqual(config.knobAction.rotaryAction);
});

test("parseEffect", () => {
  let pointer = {value: 0};
  let raw = toUsbData(effectBytes);
  expect(parseEffect(raw, pointer)).toStrictEqual(config.effect);
});

test("parseRGB8", () => {
  let pointer = {value: 0};
  let raw = toUsbData(rgb8Bytes);
  expect(parseRGB8(raw, pointer)).toStrictEqual(config.effect.colors[0]);
});

test("getByte", () => {
  let pointer = {value: 0};
  let raw = toUsbData([1]);
  expect(getByte(raw, pointer)).toStrictEqual(1);
  expect(pointer.value).toStrictEqual(1);
});

test("getI8", () => {
  let pointer = {value: 0};
  let raw = toUsbData([244]);
  expect(getI8(raw, pointer)).toStrictEqual(-12)
});

test("parseArray", () => {
  let pointer = {value: 0};
  let raw = toUsbData([2, 8, 6]);
  expect(parseArray<number>(raw, pointer, (raw, pointer) => getByte(raw, pointer)))
    .toStrictEqual([8, 6]);
});


function toUsbData(raw: U8Numbers): UsbData {
  return new DataView(Uint8Array.from(raw).buffer);
}

export const rgb8Bytes: U8Numbers = [255, 122, 67];
export const effectBytes: U8Numbers = [1, ...rgb8Bytes, 0, 0, 0, 0];
export const rotaryActionBytes: U8Numbers = [1, 3, Tone.default, 0];
export const keyActionBytes: U8Numbers = [0, 1, 0, 0, 0, 0, 0];
export const switchBytes: U8Numbers = [1, ...keyActionBytes];
export const knobActionBytes: U8Numbers = [...rotaryActionBytes, ...switchBytes];
export const mouseActionBytes: U8Numbers = [0, 2, 1, 0, 0];
export const actionBytes: U8Numbers = [2, 0, 1, 2, 0, 0];
export const switchActionBytes: U8Numbers = [1, ...actionBytes, 0, 0, 0, 0, 0, 0,]
export const configBytes: U8Numbers = [...switchActionBytes, ...knobActionBytes, ...effectBytes];