import {Command} from "@bindings/Command.ts";
import type {Config} from "@bindings/Config";
import {parseConfig, type UsbData} from "./byte_deserializer.ts";
import {configToBytes, flashToBytes} from "./byte_serializer.ts";
import {usbPid, usbVid} from "@bindings/const.ts";
import type {Tone} from "@bindings/Tone.ts";
import type {Flash} from "@bindings/Flash";

const ENDPOINT: number = 3;
export const filters: USBDeviceRequestOptions = {
  filters: [
    {vendorId: usbVid, productId: usbPid}
  ]
};

async function sendCommand(device: USBDevice, command: Command, numbers: Uint8Array): Promise<boolean> {
  if (command === Command.getConfig) throw "Please use read_config for this command!";

  let status = await device.transferOut(ENDPOINT, Uint8Array.from([command.valueOf(), ...numbers]));
  if (status.status !== "ok") return false;

  let result = await device.transferIn(ENDPOINT, 1);
  if (result.status !== "ok" || result.data == undefined) return false;
  return result.data.getUint8(0) === 0;
}

export async function initDevice(device: USBDevice): Promise<USBDevice> {
  await device.open();
  if (device.configuration === null) await device.selectConfiguration(0);
  await device.claimInterface(3);
  return device;
}

export async function beep(device: USBDevice, tone: Tone): Promise<boolean> {
  return sendCommand(device, Command.summ, Uint8Array.of(tone.valueOf()));
}

export async function flash(device: USBDevice, flash: Flash): Promise<boolean> {
  return sendCommand(device, Command.flash, Uint8Array.of(...flashToBytes(flash)));
}

type Chunks = Array<ArrayBufferLike>

export async function readConfig(device: USBDevice): Promise<Config> {
  let status = await device.transferOut(ENDPOINT, Uint8Array.from([Command.getConfig.valueOf()]));
  if (status.status !== "ok") throw "Transfer command failed!";

  let result = await device.transferIn(ENDPOINT, 64);
  if (result.status !== "ok"
    || result.data == undefined
    || result.data.getUint8(0) !== 0)
    throw "Getting config failed!";

  let configLength = result.data.getUint32(1, true);
  let chunks: Chunks = [result.data.buffer.slice(1)];
  for (let i = 1; i * 64 < configLength + 1; i++) {
    let result = await device.transferIn(ENDPOINT, 64);
    if (result.status !== "ok" || result.data == undefined) throw `Reading config package ${i + 1} failed`;
    chunks.push(result.data.buffer);
  }


  return parseConfig(concatBuffers(chunks));
}

function concatBuffers(chunks: Chunks): UsbData {
  const totalLength = chunks.reduce(
    (sum, chunk) => sum + chunk.byteLength,
    0
  );

  const result = new ArrayBuffer(totalLength);
  const view = new Uint8Array(result);

  let offset = 0;
  for (const chunk of chunks) {
    view.set(
      new Uint8Array(
        chunk.slice(),
        chunk.byteLength
      ),
      offset
    );

    offset += chunk.byteLength;
  }

  return new DataView<ArrayBufferLike>(result);
}


export async function updateConfig(device: USBDevice, config: Config): Promise<boolean> {
  return sendCommand(device, Command.changeConfig, configToBytes(config));
}

