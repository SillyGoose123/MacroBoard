import {test, expect} from "vitest";
import {
  action,
  array, configToBytes,
  effect, i8, keyAction,
  knobAction, mouseAction,
  rgb8,
  rotaryAction,
  summerAction, switchAction,
  u32
} from "@/components/Usb/utils/byte_serializer.ts";
import {Tone} from "../../../../bindings/Tone.ts";
import type {Config} from "../../../../bindings/Config";
import type {MouseReport} from "../../../../bindings/MouseReport";
import type {SlimKeyReport} from "../../../../bindings/SlimKeyReport";
import {
  configBytes,
  effectBytes, keyActionBytes,
  knobActionBytes, mouseActionBytes,
  rgb8Bytes,
  rotaryActionBytes, switchActionBytes
} from "@/components/Usb/utils/byte_deserializer.test.ts";

test("configToBytes", () => {
  expect(configToBytes(config)).toStrictEqual(Uint8Array.from(configBytes));
});

test("switchAction", () => {
  expect(switchAction(config.switchAction)).toStrictEqual(switchActionBytes);
});

test("action", () => {
  expect(action(config.switchAction[0][0])).toStrictEqual(switchActionBytes);
});

test("keyAction", () => {
  expect(keyAction(config.knobAction.switch[0].data as SlimKeyReport)).toStrictEqual(keyActionBytes);
});

test("mouseAction", () => {
  expect(mouseAction(config.switchAction[0][0].data as MouseReport))
    .toStrictEqual(mouseActionBytes);
});

test("summerAction", () => {
  expect(summerAction(config.knobAction.rotaryAction.plus[0].data as Tone))
    .toStrictEqual([Tone.default]);
});

test("knobAction", () => {
  expect(knobAction(config.knobAction)).toStrictEqual(knobActionBytes);
});

test("rotaryAction", () => {
  expect(rotaryAction(config.knobAction.rotaryAction)).toStrictEqual(rotaryActionBytes);
});

test("rgb8", () => {
  expect(rgb8(config.effect.colors[0])).toStrictEqual(rgb8Bytes);
});

test("i8", () => {
  expect(i8(-12)).toStrictEqual([244]);
})

test("effect", () => {
  expect(effect(config.effect)).toStrictEqual(effectBytes);
});

/*

1 2 4 8 16 32 64 128  256 512 1024 2048 4096 8192 16384 32768  => bit val
0 0 0 0 0  0  0  0    1   0   0    0    0    0    0     0      => bit in u16 => u32 0x00000000100000000000000000000000n
1 2 4 8 16 32 64 128  1   2   4    8    16   32   64    128

=> u8s 0, 1, 0, 0
*/
test("u32 to u8", () => {
  let u32Num = 256;
  expect(u32(u32Num)).toStrictEqual([0, 1, 0, 0]);
});

test("array", () => {
  let arr = [0, 1, 2, 3];
  let u8arr = array<number>(arr, (val) => [val]);
  expect(u8arr).toStrictEqual([4, 0, 1, 2, 3])
});

export const config: Config = {
  effect: {
    colors: [{r: 255, g: 122, b: 67}],
    timeDiff: 0
  },
  knobAction: {
    rotaryAction: {
      plus: [{type: 3, data: Tone.default}],
      minus: []
    },
    switch: [
      {
        type: 1,
        data: {
          modifier: 0,
          keycodes: [1, 0, 0, 0, 0, 0]
        }
      }
    ]
  },
  switchAction: [
    [{
      type: 2,
      data: {
        pan: 0,
        y: 1,
        x: 2,
        wheel: 0,
        buttons: 0
      }
    }],
    [],
    [],
    [],
    [],
    []
  ]
};